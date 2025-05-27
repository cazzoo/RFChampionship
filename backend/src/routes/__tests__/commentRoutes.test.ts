import request from 'supertest';
import express from 'express';
import commentRoutes from '../commentRoutes'; // Adjust path
import { supabase } from '../../config/supabaseClient'; // Adjust path
import { authMiddleware } from '../../middleware/authMiddleware'; // Adjust path

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

const app = express();
app.use(express.json());
app.use('/api/comments', commentRoutes);

describe('Comment Routes (/api/comments)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/comments', () => {
    const userId = 'user-commenter';
    const commentData = { 
      content: 'This is a test comment', 
      entity_type: 'championship', 
      entity_id_int: 1 
    };

    it('should allow an authenticated user to post a comment', async () => {
      (supabase.from('comments').insert as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockResolvedValueOnce({ 
          data: [{ ...commentData, id: 1, user_id: userId, user: { username: 'testuser' } }], 
          error: null 
        }),
      });

      const response = await request(app)
        .post('/api/comments')
        .set('x-test-user-id', userId)
        .send(commentData);

      expect(response.status).toBe(201);
      expect(response.body[0].content).toBe(commentData.content);
      expect(supabase.from('comments').insert).toHaveBeenCalledWith(
        expect.objectContaining({ ...commentData, user_id: userId })
      );
    });

    it('should require content for a comment', async () => {
      const response = await request(app)
        .post('/api/comments')
        .set('x-test-user-id', userId)
        .send({ entity_type: 'championship', entity_id_int: 1 }); // Missing content
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Comment content cannot be empty');
    });

    it('should require a valid entity_type', async () => {
       const response = await request(app)
        .post('/api/comments')
        .set('x-test-user-id', userId)
        .send({ content: 'Test', entity_type: 'invalid_type', entity_id_int: 1 });
        
       expect(response.status).toBe(400);
       expect(response.body.error).toContain('Invalid entity_type');
    });
    
    it('should require entity_id_int for relevant entity_types', async () => {
       const response = await request(app)
        .post('/api/comments')
        .set('x-test-user-id', userId)
        .send({ content: 'Test', entity_type: 'championship' }); // Missing entity_id_int
        
       expect(response.status).toBe(400);
       expect(response.body.error).toContain('entity_id_int is required');
    });
     it('should require entity_id_uuid for user_profile entity_type', async () => {
       const response = await request(app)
        .post('/api/comments')
        .set('x-test-user-id', userId)
        .send({ content: 'Test', entity_type: 'user_profile' }); // Missing entity_id_uuid
        
       expect(response.status).toBe(400);
       expect(response.body.error).toContain('entity_id_uuid is required');
    });
  });

  describe('GET /api/comments', () => {
    const mockComments = [
      { id: 1, content: 'Comment 1', user_id: 'user-a', user: { username: 'UserA' }, reply_count: 0 },
      { id: 2, content: 'Comment 2', user_id: 'user-b', user: { username: 'UserB' }, reply_count: 1, parent_id: null },
      { id: 3, content: 'Reply to Comment 2', user_id: 'user-a', user: { username: 'UserA' }, reply_count: 0, parent_id: 2 },
    ];

    it('should fetch top-level comments for an entity', async () => {
      (supabase.from('comments').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(), // for entity_type
        eq: jest.fn().mockReturnThis(), // for entity_id_int
        is: jest.fn().mockReturnThis(), // for parent_id is null
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce({ data: [mockComments[0], mockComments[1]], error: null, count: 2 }),
      });

      const response = await request(app)
        .get('/api/comments?entity_type=championship&entity_id_int=1&page=1&limit=10');

      expect(response.status).toBe(200);
      expect(response.body.comments.length).toBe(2);
      expect(response.body.comments.every(c => c.parent_id === null)).toBe(true);
      expect(supabase.from('comments').select().is).toHaveBeenCalledWith('parent_id', null);
    });
    
    it('should fetch replies for a parent comment', async () => {
      (supabase.from('comments').select as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockReturnThis(), // entity_type
        eq: jest.fn().mockReturnThis(), // entity_id_int
        eq: jest.fn().mockReturnThis(), // parent_id
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockResolvedValueOnce({ data: [mockComments[2]], error: null, count: 1 }),
      });

      const response = await request(app)
        .get('/api/comments?entity_type=championship&entity_id_int=1&parent_id=2');
      
      expect(response.status).toBe(200);
      expect(response.body.comments.length).toBe(1);
      expect(response.body.comments[0].parent_id).toBe(2);
      expect(supabase.from('comments').select().eq).toHaveBeenCalledWith('parent_id', 2);
    });
  });

  describe('DELETE /api/comments/:id', () => {
    const commentId = 1;
    const ownerUserId = 'comment-owner-id';
    const adminUserId = 'admin-id';
    const otherUserId = 'other-user-id';

    it('should allow owner to delete their comment', async () => {
      (supabase.from('comments').select as jest.Mock).mockReturnValueOnce({ // Fetch existing comment
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: commentId, user_id: ownerUserId }, error: null }),
      });
      (supabase.from('comments').delete as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockResolvedValueOnce({ error: null, count: 1 }),
      });

      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('x-test-user-id', ownerUserId);
      
      expect(response.status).toBe(204);
      expect(supabase.from('comments').delete().eq).toHaveBeenCalledWith('id', commentId);
    });

    it('should allow admin to delete any comment', async () => {
      (supabase.from('comments').select as jest.Mock).mockReturnValueOnce({ // Fetch existing comment
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: commentId, user_id: ownerUserId }, error: null }),
      });
       (supabase.from('comments').delete as jest.Mock).mockReturnValueOnce({
        eq: jest.fn().mockResolvedValueOnce({ error: null, count: 1 }),
      });

      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('x-test-user-id', adminUserId)
        .set('x-test-user-role', 'admin');
        
      expect(response.status).toBe(204);
    });
    
    it('should prevent non-owner/non-admin from deleting a comment', async () => {
      (supabase.from('comments').select as jest.Mock).mockReturnValueOnce({ // Fetch existing comment
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValueOnce({ data: { id: commentId, user_id: ownerUserId }, error: null }),
      });

      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('x-test-user-id', otherUserId); // Not owner, not admin
        
      expect(response.status).toBe(403);
      expect(response.body.error).toContain('You can only delete your own comments');
    });
  });
  
  // TODO: Add tests for PUT /api/comments/:id (Update comment)
  //  - Owner can update
  //  - Admin can update
  //  - Non-owner/non-admin cannot update
  //  - Invalid content
});
