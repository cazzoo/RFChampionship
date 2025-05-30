import request from 'supertest';
import { app } from '../../index'; // Adjust path if your app is exported differently
import { supabase } from '../../lib/supabaseClient'; // Used by the actual route, so keep it here
import { authenticate, AuthenticatedRequest, checkRole } from '../../middleware/auth';
import * as seedingService from '../../services/seedingService'; // To mock seedDatabase
import { NextFunction, Response } from 'express';

// Mock auth middleware
jest.mock('../../middleware/auth', () => ({
  authenticate: jest.fn(),
  checkRole: jest.fn(),
}));

// Mock seedingService
jest.mock('../../services/seedingService', () => ({
  seedDatabase: jest.fn(),
}));

const mockAdminUserId = 'admin-user-id';
const mockRegularUserId = 'regular-user-id';

describe('Admin Routes - POST /api/admin/seed-data', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Default mock implementation for authenticate
    (authenticate as jest.Mock).mockImplementation((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      // This default might simulate no user, or you can make it an error state
      // For specific tests, we'll override this.
      next();
    });

    // Default mock implementation for checkRole
    (checkRole as jest.Mock).mockImplementation((role: string | string[]) =>
      (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      // This default might simulate role check failure
      // For specific tests, we'll override this.
      next();
    });
  });

  const mockAdminAuth = () => {
    (authenticate as jest.Mock).mockImplementation((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      req.user = { id: mockAdminUserId, role: 'admin', app_metadata: { roles: ['admin'] } };
      req.isAdmin = true;
      next();
    });
    (checkRole as jest.Mock).mockImplementation((role: string | string[]) =>
      (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.isAdmin && (role === 'admin' || (Array.isArray(role) && role.includes('admin')))) {
          next();
        } else {
          res.status(403).json({ message: 'Forbidden: User does not have required role' });
        }
      }
    );
  };

  const mockUserAuth = () => {
    (authenticate as jest.Mock).mockImplementation((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      req.user = { id: mockRegularUserId, role: 'user', app_metadata: { roles: ['user'] } };
      req.isAdmin = false;
      next();
    });
     (checkRole as jest.Mock).mockImplementation((role: string | string[]) =>
      (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (req.isAdmin && (role === 'admin' || (Array.isArray(role) && role.includes('admin')))) {
          next();
        } else {
           res.status(403).json({ message: 'Forbidden: User does not have required role' });
        }
      }
    );
  };

  const mockNoAuth = () => {
    (authenticate as jest.Mock).mockImplementation((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
       res.status(401).json({ message: 'Unauthorized: No token provided or token is invalid' });
    });
    // checkRole would not be called if authenticate fails
  };


  it('should allow admin to call seed-data and call seedingService.seedDatabase (overwrite=false by default)', async () => {
    mockAdminAuth();
    (seedingService.seedDatabase as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/api/admin/seed-data')
      .set('Authorization', 'Bearer admintoken');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Database seeded successfully.');
    expect(response.body.details).toContain('Overwrite was false');
    expect(seedingService.seedDatabase).toHaveBeenCalledTimes(1);
    // Supabase client is passed, and overwrite is false
    expect(seedingService.seedDatabase).toHaveBeenCalledWith(expect.anything(), false);
  });

  it('should allow admin to call seed-data with overwrite=true', async () => {
    mockAdminAuth();
    (seedingService.seedDatabase as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/api/admin/seed-data?overwrite=true')
      .set('Authorization', 'Bearer admintoken');

    expect(response.status).toBe(200);
    expect(response.body.details).toContain('Overwrite was true');
    expect(seedingService.seedDatabase).toHaveBeenCalledTimes(1);
    expect(seedingService.seedDatabase).toHaveBeenCalledWith(expect.anything(), true);
  });

  it('should allow admin to call seed-data with overwrite=false explicitly', async () => {
    mockAdminAuth();
    (seedingService.seedDatabase as jest.Mock).mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/api/admin/seed-data?overwrite=false')
      .set('Authorization', 'Bearer admintoken');

    expect(response.status).toBe(200);
    expect(response.body.details).toContain('Overwrite was false');
    expect(seedingService.seedDatabase).toHaveBeenCalledTimes(1);
    expect(seedingService.seedDatabase).toHaveBeenCalledWith(expect.anything(), false);
  });


  it('should return 403 if a non-admin user tries to call seed-data', async () => {
    mockUserAuth();

    const response = await request(app)
      .post('/api/admin/seed-data')
      .set('Authorization', 'Bearer usertoken');

    expect(response.status).toBe(403);
    expect(response.body.message).toContain('Forbidden');
    expect(seedingService.seedDatabase).not.toHaveBeenCalled();
  });

  it('should return 401 if user is not authenticated', async () => {
    mockNoAuth(); // Simulate that authenticate middleware calls res.status(401)

    const response = await request(app)
      .post('/api/admin/seed-data'); // No auth token

    expect(response.status).toBe(401);
    expect(response.body.message).toContain('Unauthorized');
    expect(seedingService.seedDatabase).not.toHaveBeenCalled();
  });

  it('should handle errors from seedingService.seedDatabase', async () => {
    mockAdminAuth();
    const errorMessage = 'Seeding failed spectacularly!';
    (seedingService.seedDatabase as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app)
      .post('/api/admin/seed-data')
      .set('Authorization', 'Bearer admintoken');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Failed to seed database.');
    expect(response.body.error).toBe(errorMessage);
    expect(seedingService.seedDatabase).toHaveBeenCalledTimes(1);
  });
});
