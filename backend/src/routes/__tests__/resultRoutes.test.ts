import request from 'supertest';
import express from 'express';
import resultRoutes from '../resultRoutes'; // Adjust path
import { supabase } from '../../config/supabaseClient'; // Adjust path
import { authMiddleware } from '../../middleware/authMiddleware'; // Adjust path
import { checkRole } from '../../middleware/rbacMiddleware'; // Adjust path for checkRole

jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    auth: { getUser: jest.fn() }
  },
}));

// Mock authMiddleware and rbacMiddleware
jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    if (req.headers['x-test-user-id']) {
      req.user = { 
        id: req.headers['x-test-user-id'], 
        app_metadata: { user_role: req.headers['x-test-user-role'] || 'user' } 
      };
    } else {
      req.user = undefined;
    }
    next();
  }),
}));

jest.mock('../../middleware/rbacMiddleware', () => ({
  checkRole: jest.fn((roleOrRoles) => (req, res, next) => {
    // Simplified RBAC check for testing: assumes user exists if this middleware is called
    if (!req.user) return res.status(401).json({error: 'RBAC: User not authenticated for role check.'});
    const userRole = req.user.app_metadata.user_role;
    const requiredRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
    if (requiredRoles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({ error: 'RBAC: Insufficient permissions.' });
    }
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/results', resultRoutes);

describe('Result Routes (/api/results)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/results', () => {
    const adminId = 'admin-user-id';
    const resultData = { event_id: 1, user_id: 'participant-1', position: 1, points: 100 };

    it('should allow an admin to submit results', async () => {
      // Mock for optional registration check (if implemented fully)
      (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValueOnce({ data: { id: 'reg-1' }, error: null }) // Assume participant is registered
      });
      // Mock for duplicate result check
      (supabase.from('results').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValueOnce({ data: null, error: null }) // No existing result
      });
      // Mock for insert
      (supabase.from('results').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({ data: [{ ...resultData, id: 'result-1', submitted_by: adminId }], error: null }),
      });

      const response = await request(app)
        .post('/api/results')
        .set('x-test-user-id', adminId)
        .set('x-test-user-role', 'admin')
        .send(resultData);

      expect(response.status).toBe(201);
      expect(response.body[0].position).toBe(resultData.position);
      expect(supabase.from('results').insert).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ ...resultData, submitted_by: adminId })])
      );
    });

    it('should prevent non-admin from submitting results', async () => {
      const response = await request(app)
        .post('/api/results')
        .set('x-test-user-id', 'user-id')
        .set('x-test-user-role', 'user') // Non-admin
        .send(resultData);
      
      expect(response.status).toBe(403); // checkRole mock will deny
      expect(response.body.error).toContain('Insufficient permissions');
    });

    it('should require event_id, user_id, and position', async () => {
        const response = await request(app)
            .post('/api/results')
            .set('x-test-user-id', adminId)
            .set('x-test-user-role', 'admin')
            .send({ points: 100 }); // Missing required fields
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('event_id, user_id, and position are required');
    });
  });

  describe('GET /api/results', () => {
    const mockResults = [
      { id: 'res-1', event_id: 1, user_id: 'user-a', position: 1, event: { name: 'Race 1'} },
      { id: 'res-2', event_id: 1, user_id: 'user-b', position: 2, event: { name: 'Race 1'} },
      { id: 'res-3', event_id: 2, user_id: 'user-a', position: 1, event: { name: 'Race 2'} },
    ];

    it('should return results for a specific event_id', async () => {
      (supabase.from('results').select as jest.Mock).mockReturnValueOnce({
        order: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(), // second order
        range: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({ data: [mockResults[0], mockResults[1]], error: null, count: 2 }),
      });

      const response = await request(app).get('/api/results?event_id=1');

      expect(response.status).toBe(200);
      expect(response.body.results.length).toBe(2);
      expect(response.body.results[0].event_id).toBe(1);
      expect(supabase.from('results').select().eq).toHaveBeenCalledWith('event_id', '1');
    });

    it('should return all results if no filter is provided', async () => {
      (supabase.from('results').select as jest.Mock).mockReturnValueOnce({
        order: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce({ data: mockResults, error: null, count: mockResults.length }),
      });
      
      const response = await request(app).get('/api/results');
      
      expect(response.status).toBe(200);
      expect(response.body.results.length).toBe(mockResults.length);
      // Ensure no specific eq filter was called without arguments (supabase mock might need adjustment for this specific check)
    });
  });
  
  // TODO: Add tests for GET /api/results/:id
  // TODO: Add tests for PUT /api/results/:id (Admin only)
  // TODO: Add tests for DELETE /api/results/:id (Admin only)
});
