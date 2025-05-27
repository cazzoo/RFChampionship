import request from 'supertest';
import express from 'express';
import registrationRoutes from '../registrationRoutes'; // Adjust path
import { supabase } from '../../config/supabaseClient'; // Adjust path
// Mock authMiddleware to simulate authenticated users and their roles
import { authMiddleware } from '../../middleware/authMiddleware'; // Adjust path

jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    // rpc: jest.fn(), // If any RPCs were used
    auth: { // For authMiddleware if it makes direct calls, though we mock the middleware itself
      getUser: jest.fn() 
    }
  },
}));

// Simplified mock for authMiddleware
jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    if (req.headers['x-test-user-id']) {
      req.user = { 
        id: req.headers['x-test-user-id'], 
        app_metadata: { user_role: req.headers['x-test-user-role'] || 'user' } 
      };
    } else {
      req.user = undefined; // Simulate unauthenticated
    }
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/api/registrations', registrationRoutes);

describe('Registration Routes (/api/registrations)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/registrations', () => {
    const userId = 'user-123';
    const eventId = 1;
    const championshipId = 2;

    it('should allow a user to register for an event', async () => {
      (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({ // Duplicate check
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({ data: null, error: null }), // No existing registration
      });
      (supabase.from('registrations').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({ data: [{ id: 'reg-1', user_id: userId, event_id: eventId, status: 'pending' }], error: null }),
      });

      const response = await request(app)
        .post('/api/registrations')
        .set('x-test-user-id', userId)
        .send({ event_id: eventId });

      expect(response.status).toBe(201);
      expect(response.body[0].status).toBe('pending');
      expect(supabase.from('registrations').insert).toHaveBeenCalledWith(
        expect.objectContaining({ user_id: userId, event_id: eventId })
      );
    });

    it('should prevent duplicate active registration for the same event', async () => {
      (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({ // Duplicate check
        eq: jest.fn().mockReturnThis(),
        in: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({ data: { id: 'existing-reg' }, error: null }), // Existing active registration
      });

      const response = await request(app)
        .post('/api/registrations')
        .set('x-test-user-id', userId)
        .send({ event_id: eventId });
      
      expect(response.status).toBe(409);
      expect(response.body.error).toContain('already have an active registration');
    });
    
    it('should require event_id or championship_id', async () => {
        const response = await request(app)
            .post('/api/registrations')
            .set('x-test-user-id', userId)
            .send({}); // Missing both
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Either championship_id or event_id must be provided');
    });
  });

  describe('GET /api/registrations', () => {
    const userId = 'user-regular';
    const adminId = 'user-admin';
    const mockRegistrations = [
      { id: 'reg-1', user_id: userId, event_id: 1, event: { name: 'Event 1'} },
      { id: 'reg-2', user_id: 'other-user', event_id: 2, event: { name: 'Event 2'} },
    ];

    it('should return only own registrations for a regular user', async () => {
      (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValueOnce({ data: [mockRegistrations[0]], error: null, count: 1 }), // Filtered by user_id
      });

      const response = await request(app)
        .get('/api/registrations?page=1&limit=10')
        .set('x-test-user-id', userId)
        .set('x-test-user-role', 'user');

      expect(response.status).toBe(200);
      expect(response.body.registrations.length).toBe(1);
      expect(response.body.registrations[0].user_id).toBe(userId);
      expect(supabase.from('registrations').select().eq).toHaveBeenCalledWith('user_id', userId);
    });

    it('should return all registrations for an admin user', async () => {
      (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce({ data: mockRegistrations, error: null, count: mockRegistrations.length }),
      });

      const response = await request(app)
        .get('/api/registrations?page=1&limit=10')
        .set('x-test-user-id', adminId)
        .set('x-test-user-role', 'admin');

      expect(response.status).toBe(200);
      expect(response.body.registrations.length).toBe(mockRegistrations.length);
      expect(supabase.from('registrations').select().eq).not.toHaveBeenCalled(); // No user_id filter for admin unless specified in query
    });
  });
  
  describe('PUT /api/registrations/:id/status', () => {
    const registrationId = 1;
    const ownerUserId = 'owner-123';
    const adminUserId = 'admin-456';

    it('should allow a user to cancel their own registration', async () => {
      (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({ // Fetch existing reg
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: registrationId, user_id: ownerUserId, status: 'pending' }, error: null }),
      });
      (supabase.from('registrations').update as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: registrationId, status: 'cancelled' }, error: null }),
      });

      const response = await request(app)
        .put(`/api/registrations/${registrationId}/status`)
        .set('x-test-user-id', ownerUserId)
        .set('x-test-user-role', 'user')
        .send({ status: 'cancelled' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('cancelled');
      expect(supabase.from('registrations').update).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'cancelled' })
      );
    });

    it('should allow an admin to change status to confirmed', async () => {
       (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({ // Fetch existing reg
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: registrationId, user_id: 'any-user', status: 'pending' }, error: null }),
      });
      (supabase.from('registrations').update as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: registrationId, status: 'confirmed' }, error: null }),
      });

      const response = await request(app)
        .put(`/api/registrations/${registrationId}/status`)
        .set('x-test-user-id', adminUserId)
        .set('x-test-user-role', 'admin')
        .send({ status: 'confirmed' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('confirmed');
    });
    
    it('should prevent a user from changing status to something other than cancelled', async () => {
      (supabase.from('registrations').select as jest.Mock).mockReturnValueOnce({ // Fetch existing reg
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: registrationId, user_id: ownerUserId, status: 'pending' }, error: null }),
      });
      
      const response = await request(app)
        .put(`/api/registrations/${registrationId}/status`)
        .set('x-test-user-id', ownerUserId)
        .set('x-test-user-role', 'user')
        .send({ status: 'confirmed' }); // User trying to confirm
      
      expect(response.status).toBe(403);
      expect(response.body.error).toContain('You can only cancel your registration');
    });
  });
});
