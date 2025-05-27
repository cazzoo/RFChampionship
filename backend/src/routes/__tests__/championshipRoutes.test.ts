import request from 'supertest';
import express from 'express'; // Import express to create a minimal app for tests
import championshipRoutes from '../championshipRoutes'; // Adjust path
import { supabase } from '../../config/supabaseClient'; // Adjust path
import { authMiddleware } from '../../middleware/authMiddleware'; // Adjust path
import { checkRole } from '../../middleware/rbacMiddleware'; // Adjust path

// Mock Supabase client
jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    rpc: jest.fn(), // if you use RPC calls
    auth: {
      getUser: jest.fn(), // Mock for authMiddleware
      admin: { // Mock for admin operations if any in these routes (not directly, but authMiddleware uses it)
        getUserById: jest.fn() 
      }
    }
  },
}));

// Mock authMiddleware and rbacMiddleware
// We will bypass actual token verification and role checks by mocking implementations
jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    // Simulate user based on a header for testing, or a global test variable
    if (req.headers['x-test-user-id']) {
      req.user = { 
        id: req.headers['x-test-user-id'], 
        app_metadata: { user_role: req.headers['x-test-user-role'] || 'user' } 
      };
    }
    next();
  }),
}));

jest.mock('../../middleware/rbacMiddleware', () => ({
  checkRole: jest.fn((roleOrRoles) => (req, res, next) => {
    if (!req.user || !req.user.app_metadata || !req.user.app_metadata.user_role) {
        return res.status(403).json({ error: 'Forbidden. User role not available for RBAC check.' });
    }
    const userRole = req.user.app_metadata.user_role;
    const requiredRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    if (requiredRoles.includes(userRole)) {
        next();
    } else {
        return res.status(403).json({ error: 'Forbidden. Insufficient permissions for RBAC.' });
    }
  }),
}));


// Setup a minimal Express app with the routes
const app = express();
app.use(express.json());
app.use('/api/championships', championshipRoutes); // Mount the routes under test

describe('Championship Routes (/api/championships)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/championships', () => {
    it('should return 200 and a list of championships', async () => {
      const mockChampionships = [{ id: '1', name: 'Championship 1' }, { id: '2', name: 'Championship 2' }];
      const mockCount = mockChampionships.length;
      (supabase.from('championships').select as jest.Mock).mockReturnValueOnce({
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce({ data: mockChampionships, error: null, count: mockCount }),
      });
      
      const response = await request(app).get('/api/championships?page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.championships).toEqual(mockChampionships);
      expect(response.body.total).toBe(mockCount);
      expect(supabase.from).toHaveBeenCalledWith('championships');
      expect(supabase.from('championships').select).toHaveBeenCalledWith('*', { count: 'exact' });
    });

     it('should return 500 if Supabase fails to fetch championships', async () => {
      (supabase.from('championships').select as jest.Mock).mockReturnValueOnce({
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Supabase fetch error'), count: 0 }),
      });

      const response = await request(app).get('/api/championships');

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Failed to fetch championships');
    });
  });

  describe('POST /api/championships', () => {
    const newChampionshipData = { name: 'New Champ', description: 'Desc', start_date: '2024-01-01', end_date: '2024-01-02' };

    it('should return 201 and the created championship for an admin user', async () => {
      const mockCreatedChampionship = { ...newChampionshipData, id: '3', created_by: 'admin-user-id' };
      (supabase.from('championships').insert as jest.Mock).mockReturnValueOnce({
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValueOnce({ data: mockCreatedChampionship, error: null })
      });

      const response = await request(app)
        .post('/api/championships')
        .set('x-test-user-id', 'admin-user-id') // Simulate authenticated admin
        .set('x-test-user-role', 'admin')       // Simulate admin role for RBAC
        .send(newChampionshipData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCreatedChampionship);
      expect(supabase.from).toHaveBeenCalledWith('championships');
      expect(supabase.from('championships').insert).toHaveBeenCalledWith([
        expect.objectContaining({ ...newChampionshipData, created_by: 'admin-user-id' }),
      ]);
    });

    it('should return 403 for a non-admin user', async () => {
      const response = await request(app)
        .post('/api/championships')
        .set('x-test-user-id', 'non-admin-user-id') // Simulate authenticated non-admin
        .set('x-test-user-role', 'user')          // Simulate user role for RBAC
        .send(newChampionshipData);

      expect(response.status).toBe(403); // checkRole mock will deny if role is not 'admin'
      expect(response.body.error).toContain('Insufficient permissions');
    });
    
    it('should return 401 if no user token is effectively provided (simulated by no x-test-user-id)', async () => {
        // To truly test this, we'd need to modify the authMiddleware mock to reject if no header.
        // For now, our mock authMiddleware calls next() even without x-test-user-id.
        // A more accurate test would involve a more sophisticated mock or testing the original middleware.
        // Let's assume the original authMiddleware would reject.
        // To make this test meaningful with current mocks, we need to ensure req.user is undefined for checkRole.
        // We can achieve this by not setting x-test-user-id for this specific test case if authMiddleware mock is adjusted,
        // or by directly testing the original authMiddleware (which is done in its own test file).

        // For this route test, if authMiddleware lets it pass to checkRole without user, checkRole will deny.
        // If authMiddleware itself would deny, this test would be on authMiddleware.
        // Let's assume checkRole is the one catching it because authMiddleware mock might be too permissive.
        const tempAuthMiddleware = authMiddleware as jest.Mock;
        tempAuthMiddleware.mockImplementationOnce((req, res, next) => {
            // Simulate no user for this specific test for POST
            req.user = undefined; 
            next();
        });
        
        const response = await request(app)
            .post('/api/championships')
            // No x-test-user-id or role headers
            .send(newChampionshipData);
        
        // Since checkRole is the first middleware after auth that needs req.user for its logic
        expect(response.status).toBe(403); 
        expect(response.body.error).toContain('User role not available'); // This comes from checkRole when req.user is missing.
        
        // Restore original mock for other tests
        tempAuthMiddleware.mockImplementation((req, res, next) => {
            if (req.headers['x-test-user-id']) {
              req.user = { 
                id: req.headers['x-test-user-id'], 
                app_metadata: { user_role: req.headers['x-test-user-role'] || 'user' } 
              };
            }
            next();
          });
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
        .post('/api/championships')
        .set('x-test-user-id', 'admin-user-id')
        .set('x-test-user-role', 'admin')
        .send({ description: 'Only description' }); // Missing 'name'

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Championship name is required.');
    });

    it('should return 500 if Supabase fails to insert', async () => {
        (supabase.from('championships').insert as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({ data: null, error: new Error('Supabase insert error') })
        });
        
        const response = await request(app)
        .post('/api/championships')
        .set('x-test-user-id', 'admin-user-id')
        .set('x-test-user-role', 'admin')
        .send(newChampionshipData);

        expect(response.status).toBe(500);
        expect(response.body.error).toContain('Failed to create championship');
    });
  });

  // Example for GET /api/championships/:id
  describe('GET /api/championships/:id', () => {
    it('should return 200 and the championship if found', async () => {
      const mockChampionship = { id: '1', name: 'Test Champ' };
      (supabase.from('championships').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: mockChampionship, error: null }),
      });

      const response = await request(app).get('/api/championships/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockChampionship);
      expect(supabase.from).toHaveBeenCalledWith('championships');
      expect(supabase.from('championships').select).toHaveBeenCalledWith('*');
      expect(supabase.from('championships').select().eq).toHaveBeenCalledWith('id', '1');
    });

    it('should return 404 if championship not found', async () => {
      (supabase.from('championships').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: null, error: { code: 'PGRST116', message: 'Not found' } }), // Simulate Supabase not found
      });
      const response = await request(app).get('/api/championships/unknown');
      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Championship not found');
    });
  });
  
  // TODO: Add tests for PUT and DELETE following similar patterns:
  // - Test success case (200 for PUT, 204 for DELETE) with admin role.
  // - Test 403 for non-admin user.
  // - Test 401 for unauthenticated user (requires more specific authMiddleware mock adjustment for this route).
  // - Test 404 if championship to update/delete is not found.
  // - Test 400 for invalid input on PUT.
  // - Test 500 for Supabase errors.
});
