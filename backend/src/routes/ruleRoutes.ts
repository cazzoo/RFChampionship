import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// POST /api/rules - Create a new rule (Admin only)
router.post('/', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { title, description, championship_id } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Rule title and description are required.' });
  }
  if (championship_id !== undefined && (typeof championship_id !== 'number' && championship_id !== null)) {
    return res.status(400).json({ error: 'Invalid championship_id format. Must be a number or null.' });
  }

  try {
    const { data, error } = await supabase
      .from('rules')
      .insert([{ title, description, championship_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating rule:', error.message);
    if (error.code === '23503' && error.detail?.includes('championship_id')) { // Foreign key violation
        return res.status(400).json({ error: 'Invalid championship_id. The championship does not exist.' });
    }
    res.status(500).json({ error: 'Failed to create rule', details: error.message });
  }
});

// GET /api/rules - Get all rules (Publicly listable, filter by championship_id)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const championship_id = req.query.championship_id as string;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  try {
    let query = supabase
      .from('rules')
      .select('*, championship:championships(id, name)', { count: 'exact' }) // Optionally fetch related championship name
      .order('created_at', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (championship_id) {
      query = query.eq('championship_id', championship_id);
    } else if (req.query.global_only === 'true') { // Example: allow fetching only global rules
      query = query.is('championship_id', null);
    }


    const { data, error, count } = await query;

    if (error) throw error;
    res.json({
      rules: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching rules:', error.message);
    res.status(500).json({ error: 'Failed to fetch rules', details: error.message });
  }
});

// GET /api/rules/:id - Get a single rule (Publicly viewable)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Rule ID is required.'});

  try {
    const { data, error } = await supabase
      .from('rules')
      .select('*, championship:championships(id, name)')
      .eq('id', id)
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Rule not found.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Rule not found' });
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching rule by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch rule', details: error.message });
  }
});

// PUT /api/rules/:id - Update an existing rule (Admin only)
router.put('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
   if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Rule ID is required.'});

  const { title, description, championship_id } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No update data provided.' });
  }
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: 'Invalid rule title.' });
  }
  if (description !== undefined && (typeof description !== 'string' || description.trim() === '')) {
    return res.status(400).json({ error: 'Invalid rule description.' });
  }
  if (championship_id !== undefined && (typeof championship_id !== 'number' && championship_id !== null)) {
    return res.status(400).json({ error: 'Invalid championship_id format. Must be a number or null.' });
  }

  const updates: any = { updated_at: new Date().toISOString() };
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  // Allow setting championship_id to null (for global rule) or updating it
  if (championship_id !== undefined) updates.championship_id = championship_id;


  try {
    const { data, error } = await supabase
      .from('rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Rule not found.' });
        if (error.code === '23503' && error.detail?.includes('championship_id')) {
             return res.status(400).json({ error: 'Invalid championship_id. The championship does not exist.' });
        }
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Rule not found or no update occurred' });
    res.json(data);
  } catch (error: any) {
    console.error('Error updating rule:', error.message);
    res.status(500).json({ error: 'Failed to update rule', details: error.message });
  }
});

// DELETE /api/rules/:id - Delete a rule (Admin only)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Rule ID is required.'});

  try {
    const { error, count } = await supabase
      .from('rules')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Rule not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting rule:', error.message);
    res.status(500).json({ error: 'Failed to delete rule', details: error.message });
  }
});

export default router;
