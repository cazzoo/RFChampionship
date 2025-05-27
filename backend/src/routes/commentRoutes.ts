import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware'; // For admin actions if needed

const router = express.Router();

const VALID_ENTITY_TYPES = ['championship', 'event', 'result', 'track', 'vehicle', 'user_profile', 'team'];

// POST /api/comments - Create a new comment
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated.' });
  }

  const { content, entity_type, entity_id_int, entity_id_uuid, parent_id } = req.body;

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Comment content cannot be empty.' });
  }
  if (!entity_type || !VALID_ENTITY_TYPES.includes(entity_type)) {
    return res.status(400).json({ error: `Invalid entity_type. Must be one of: ${VALID_ENTITY_TYPES.join(', ')}` });
  }

  let entityIdInt: number | null = null;
  let entityIdUuid: string | null = null;

  if (['championship', 'event', 'result', 'track', 'vehicle', 'team'].includes(entity_type)) {
    if (entity_id_int === undefined || entity_id_int === null || typeof entity_id_int !== 'number' || entity_id_int <=0) {
      return res.status(400).json({ error: `entity_id_int is required and must be a positive number for entity_type '${entity_type}'.` });
    }
    entityIdInt = entity_id_int;
  } else if (entity_type === 'user_profile') {
    if (!entity_id_uuid || typeof entity_id_uuid !== 'string') {
      return res.status(400).json({ error: `entity_id_uuid is required and must be a valid UUID string for entity_type '${entity_type}'.` });
    }
    entityIdUuid = entity_id_uuid;
  } else {
    // This case should ideally be caught by VALID_ENTITY_TYPES check, but good for robustness
    return res.status(400).json({ error: 'Mismatched entity_type and entity_id provided or entity_id missing.' });
  }
  
  if (parent_id !== undefined && parent_id !== null && (typeof parent_id !== 'number' || parent_id <= 0)) {
    return res.status(400).json({ error: 'Invalid parent_id format. Must be a positive number or null.' });
  }

  const commentData: any = {
    user_id,
    content: content.trim(),
    entity_type,
    entity_id_int: entityIdInt,
    entity_id_uuid: entityIdUuid,
    parent_id: parent_id || null,
  };

  try {
    // Optional: Validate existence of parent_id if provided
    if (commentData.parent_id) {
        const { data: parentComment, error: parentError } = await supabase
            .from('comments')
            .select('id')
            .eq('id', commentData.parent_id)
            .single();
        if (parentError || !parentComment) {
            return res.status(400).json({ error: 'Invalid parent_id. Parent comment does not exist.' });
        }
    }
    // Optional: Validate existence of the entity being commented on (e.g., championship exists)
    // This can be complex due to different tables. For now, relying on DB constraints or simpler checks.


    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select(`
        *,
        user:profiles (id, username, avatar_url)
      `) // Fetch user details along with the new comment
      .single();

    if (error) {
        // Handle DB constraint errors
        if (error.code === '23503') { // Foreign key violation
             if (error.message.includes('comments_parent_id_fkey')) {
                return res.status(400).json({ error: 'Invalid parent_id. Parent comment does not exist.' });
            }
             // Add more specific FK error checks if needed for entity_id_int/uuid if not handled by app logic
        }
        throw error;
    }
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating comment:', error.message);
    res.status(500).json({ error: 'Failed to create comment', details: error.message });
  }
});

// GET /api/comments - Get comments for an entity
router.get('/', async (req: Request, res: Response) => {
  const { entity_type, entity_id_int, entity_id_uuid, parent_id, page = 1, limit = 10 } = req.query;

  if (!entity_type || typeof entity_type !== 'string' || !VALID_ENTITY_TYPES.includes(entity_type)) {
    return res.status(400).json({ error: `Invalid or missing entity_type. Must be one of: ${VALID_ENTITY_TYPES.join(', ')}` });
  }

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const rangeStart = (pageNum - 1) * limitNum;
  const rangeEnd = pageNum * limitNum - 1;

  let query = supabase
    .from('comments')
    .select(`
      *,
      user:profiles (id, username, avatar_url),
      reply_count:comments(count) 
    `, { count: 'exact' }) // Fetch reply count for each comment
    .eq('entity_type', entity_type);

  if (['championship', 'event', 'result', 'track', 'vehicle', 'team'].includes(entity_type)) {
    const idInt = parseInt(entity_id_int as string);
    if (isNaN(idInt) || idInt <= 0) {
      return res.status(400).json({ error: `Valid positive number entity_id_int is required for entity_type '${entity_type}'.` });
    }
    query = query.eq('entity_id_int', idInt);
  } else if (entity_type === 'user_profile') {
    if (!entity_id_uuid || typeof entity_id_uuid !== 'string') {
      return res.status(400).json({ error: `Valid UUID string entity_id_uuid is required for entity_type '${entity_type}'.` });
    }
    query = query.eq('entity_id_uuid', entity_id_uuid as string);
  } else {
    return res.status(400).json({ error: 'Missing or invalid entity ID for the given entity_type.' });
  }
  
  // Handle fetching top-level comments or replies
  if (parent_id && parent_id !== 'null') { // Fetch replies to a specific comment
    const parentIdNum = parseInt(parent_id as string);
    if (isNaN(parentIdNum) || parentIdNum <=0) return res.status(400).json({ error: 'Invalid parent_id.' });
    query = query.eq('parent_id', parentIdNum);
  } else { // Fetch top-level comments for the entity
    query = query.is('parent_id', null);
  }

  query = query.order('created_at', { ascending: true }) // Or false for newest first
               .range(rangeStart, rangeEnd);

  try {
    const { data, error, count } = await query;
    if (error) throw error;

    res.json({
      comments: data,
      total: count,
      page: pageNum,
      limit: limitNum
    });
  } catch (error: any) {
    console.error('Error fetching comments:', error.message);
    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
  }
});


// PUT /api/comments/:id - Update a comment
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const commentId = parseInt(req.params.id);
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;
  const { content } = req.body;

  if (isNaN(commentId) || commentId <= 0) {
    return res.status(400).json({ error: 'Invalid comment ID.' });
  }
  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Comment content cannot be empty.' });
  }

  try {
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !existingComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (currentUserRole !== 'admin' && existingComment.user_id !== currentUserId) {
      return res.status(403).json({ error: 'Forbidden. You can only update your own comments.' });
    }

    const { data: updatedComment, error: updateError } = await supabase
      .from('comments')
      .update({ content: content.trim(), updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .select(`
        *,
        user:profiles (id, username, avatar_url),
        reply_count:comments(count)
      `)
      .single();

    if (updateError) throw updateError;
    res.json(updatedComment);
  } catch (error: any) {
    console.error('Error updating comment:', error.message);
    res.status(500).json({ error: 'Failed to update comment', details: error.message });
  }
});

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const commentId = parseInt(req.params.id);
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;

  if (isNaN(commentId) || commentId <= 0) {
    return res.status(400).json({ error: 'Invalid comment ID.' });
  }

  try {
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('id, user_id') // Also fetch parent_id if you have logic for not deleting comments with replies
      .eq('id', commentId)
      .single();

    if (fetchError || !existingComment) {
      return res.status(404).json({ error: 'Comment not found.' });
    }

    if (currentUserRole !== 'admin' && existingComment.user_id !== currentUserId) {
      return res.status(403).json({ error: 'Forbidden. You can only delete your own comments.' });
    }
    
    // Policy: If a comment has replies, should it be deleted or marked as "deleted"?
    // For simplicity, direct deletion is implemented. For "soft delete" or preventing deletion of comments with replies,
    // additional logic would be needed here (e.g., check for replies, then update content to "[deleted]" or similar).
    // Supabase CASCADE on parent_id will delete replies if this comment is a parent.

    const { error: deleteError, count } = await supabase
      .from('comments')
      .delete({ count: 'exact' }) // Ensure we know if a row was actually deleted
      .eq('id', commentId);

    if (deleteError) throw deleteError;
    if (count === 0) {
        // Should have been caught by the check above, but as a safeguard
        return res.status(404).json({ error: 'Comment not found or already deleted.' });
    }
    
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ error: 'Failed to delete comment', details: error.message });
  }
});

export default router;
