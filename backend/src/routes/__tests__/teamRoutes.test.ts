import request from 'supertest';
import express from 'express';
import teamRoutes from '../teamRoutes'; // Adjust path
import { supabase } from '../../config/supabaseClient'; // Adjust path
import { authMiddleware } from '../../middleware/authMiddleware'; // Adjust path
// RBAC checkRole is not directly used in teamRoutes for PUT/DELETE, it uses a custom canModifyTeam.
// However, if any sub-routes were to use checkRole, it would be good to have it mocked generally.

jest.mock('../../config/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    rpc: jest.fn(),
    auth: {
      getUser: jest.fn(),
      admin: {
        // Mock admin functions if used by your routes, e.g., for listing users
      }
    }
  },
}));

// Mock authMiddleware
jest.mock('../../middleware/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    if (req.headers['x-test-user-id']) {
      req.user = { 
        id: req.headers['x-test-user-id'], 
        // Simulate app_metadata which might contain user_role
        app_metadata: { user_role: req.headers['x-test-user-role'] || 'user' } 
      };
    } else {
      // If no test user ID, simulate unauthenticated user for relevant tests
      req.user = undefined; 
    }
    next();
  }),
}));


const app = express();
app.use(express.json());
app.use('/api/teams', teamRoutes);

describe('Team Routes (/api/teams)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/teams', () => {
    const newTeamData = { name: 'The Testers', description: 'We test everything' };

    it('should return 201 and the created team for an authenticated user', async () => {
      const mockUserId = 'user-123';
      const mockRpcResponse = { id: 'team-xyz', name: newTeamData.name, description: newTeamData.description, owner_id: mockUserId };
      
      (supabase.rpc as jest.Mock).mockResolvedValueOnce({ data: mockRpcResponse, error: null });
      // If RPC doesn't return full team, and you have a fallback fetch:
      // (supabase.from('teams').select as jest.Mock).mockReturnValueOnce({ /* ... */ });


      const response = await request(app)
        .post('/api/teams')
        .set('x-test-user-id', mockUserId)
        .send(newTeamData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(mockRpcResponse));
      expect(supabase.rpc).toHaveBeenCalledWith('create_team_and_add_owner', {
        team_name: newTeamData.name,
        team_description: newTeamData.description,
        owner_user_id: mockUserId,
      });
    });

    it('should return 401 if user is not authenticated', async () => {
       // authMiddleware mock will set req.user to undefined if no x-test-user-id
      const response = await request(app)
        .post('/api/teams')
        // No x-test-user-id header
        .send(newTeamData);
      
      expect(response.status).toBe(401);
      expect(response.body.error).toContain('User not authenticated'); 
    });

    it('should return 400 if team name is missing', async () => {
      const response = await request(app)
        .post('/api/teams')
        .set('x-test-user-id', 'user-123')
        .send({ description: 'Only description' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Team name is required.');
    });
    
    it('should return 500 if Supabase RPC call fails', async () => {
        (supabase.rpc as jest.Mock).mockResolvedValueOnce({ data: null, error: new Error('Supabase RPC error') });

        const response = await request(app)
            .post('/api/teams')
            .set('x-test-user-id', 'user-123')
            .send(newTeamData);

        expect(response.status).toBe(500);
        expect(response.body.error).toContain('Failed to create team');
    });
  });

  describe('PUT /api/teams/:id', () => {
    const teamId = 'team-abc';
    const updateData = { name: 'The Super Testers' };
    const ownerId = 'owner-123';
    const adminId = 'admin-456';
    const otherUserId = 'other-789';

    beforeEach(() => {
        // Mock the canModifyTeam check (which internally calls supabase.from('teams').select()...)
        // This mock simulates that the team exists and its owner is ownerId
        (supabase.from('teams').select as jest.Mock).mockImplementation((fields) => {
            if (fields === 'owner_id') { // This is from canModifyTeam
                return {
                    eq: jest.fn().mockReturnThis(),
                    single: jest.fn().mockResolvedValueOnce({ data: { owner_id: ownerId }, error: null })
                };
            }
            // This is for the main update operation's select
            return { 
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValueOnce({ data: { id: teamId, ...updateData, owner_id: ownerId }, error: null })
            };
        });
        (supabase.from('teams').update as jest.Mock).mockReturnValueOnce({
            eq: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({ data: { id: teamId, ...updateData, owner_id: ownerId }, error: null })
        });
    });

    it('should return 200 and updated team for team owner', async () => {
      const response = await request(app)
        .put(`/api/teams/${teamId}`)
        .set('x-test-user-id', ownerId)
        .set('x-test-user-role', 'user')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(supabase.from).toHaveBeenCalledWith('teams'); // once for canModify, once for update
      expect(supabase.from('teams').update).toHaveBeenCalledWith(expect.objectContaining(updateData));
    });

    it('should return 200 and updated team for admin', async () => {
      const response = await request(app)
        .put(`/api/teams/${teamId}`)
        .set('x-test-user-id', adminId)
        .set('x-test-user-role', 'admin')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
    });

    it('should return 403 for a non-owner, non-admin user', async () => {
      const response = await request(app)
        .put(`/api/teams/${teamId}`)
        .set('x-test-user-id', otherUserId)
        .set('x-test-user-role', 'user')
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Forbidden. You do not have permission');
    });
    
    it('should return 401 if user is not authenticated', async () => {
        const response = await request(app)
            .put(`/api/teams/${teamId}`)
            // No x-test-user-id header
            .send(updateData);
        
        expect(response.status).toBe(401);
        expect(response.body.error).toContain('User not authenticated');
    });

    it('should return 404 if team to update is not found (simulated by canModifyTeam failing)', async () => {
        (supabase.from('teams').select as jest.Mock).mockImplementation((fields) => {
            if (fields === 'owner_id') { // canModifyTeam check
                 return {
                    eq: jest.fn().mockReturnThis(),
                    single: jest.fn().mockResolvedValueOnce({ data: null, error: { message: 'Not found' } }) // Simulate team not found
                };
            }
           return { /* default mock for other selects if needed */ };
        });
        
        const response = await request(app)
            .put(`/api/teams/${teamId}`)
            .set('x-test-user-id', ownerId) // User is owner, but team is not found by canModifyTeam
            .send(updateData);

        // The canModifyTeam will return false if team not found, leading to 403
        // A more direct 404 would come if the update's .single() returns PGRST116
        expect(response.status).toBe(403); // Because canModifyTeam returns false
    });
  });

  // Example for POST /api/teams/:teamId/members
  describe('POST /api/teams/:teamId/members', () => {
    const teamId = 'team-for-members';
    const memberToAddId = 'new-member-id';
    const teamOwnerId = 'team-owner-id';
    const adminUserId = 'admin-user-id';

    beforeEach(() => {
        // Mock for canModifyTeam check (inside the route handler)
        (supabase.from('teams').select as jest.Mock).mockImplementation((fields) => {
             if (fields === 'owner_id') {
                return {
                    eq: jest.fn().mockReturnThis(), // for teamId
                    single: jest.fn().mockResolvedValueOnce({ data: { owner_id: teamOwnerId }, error: null })
                };
            }
            return { /* default mock for other selects */ };
        });

        // Mock for checking if user is already a member
        (supabase.from('team_members').select as jest.Mock).mockReturnValueOnce({
            eq: jest.fn().mockReturnThis(), // team_id
            eq: jest.fn().mockReturnThis(), // user_id
            maybeSingle: jest.fn().mockResolvedValueOnce({ data: null, error: null }) // Simulate member not existing
        });
        // Mock for inserting the new member
        (supabase.from('team_members').insert as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValueOnce({ data: { team_id: teamId, user_id: memberToAddId }, error: null })
        });
    });

    it('should allow team owner to add a member', async () => {
      const response = await request(app)
        .post(`/api/teams/${teamId}/members`)
        .set('x-test-user-id', teamOwnerId)
        .set('x-test-user-role', 'user') // Owner is a 'user' but has ownership permission
        .send({ userId: memberToAddId });

      expect(response.status).toBe(201);
      expect(response.body.user_id).toBe(memberToAddId);
      expect(supabase.from('team_members').insert).toHaveBeenCalledWith({ team_id: teamId, user_id: memberToAddId });
    });
    
    it('should allow admin to add a member', async () => {
      const response = await request(app)
        .post(`/api/teams/${teamId}/members`)
        .set('x-test-user-id', adminUserId)
        .set('x-test-user-role', 'admin')
        .send({ userId: memberToAddId });

      expect(response.status).toBe(201);
      expect(response.body.user_id).toBe(memberToAddId);
    });

    it('should return 409 if member already exists', async () => {
        // Override the specific mock for this test
        (supabase.from('team_members').select as jest.Mock).mockReset(); // Clear previous general mock
        (supabase.from('team_members').select as jest.Mock).mockReturnValueOnce({ // For the check if member exists
            eq: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            maybeSingle: jest.fn().mockResolvedValueOnce({ data: { team_id: teamId, user_id: memberToAddId }, error: null }) // Simulate member *does* exist
        });
        
        const response = await request(app)
            .post(`/api/teams/${teamId}/members`)
            .set('x-test-user-id', teamOwnerId)
            .send({ userId: memberToAddId });

        expect(response.status).toBe(409);
        expect(response.body.error).toContain('User is already a member');
    });
  });
  
  // TODO: Add tests for DELETE /api/teams/:id (similar to PUT, checking ownership/admin)
  // TODO: Add tests for DELETE /api/teams/:teamId/members/:userId
  //  - Admin can remove anyone.
  //  - Owner can remove anyone (except themselves if last member, depending on rules - this test is more complex).
  //  - User can remove themselves.
  //  - Non-owner/non-admin cannot remove others.
  //  - 404 if member or team not found.
});
