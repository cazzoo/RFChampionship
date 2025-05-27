import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// POST /api/championships - Create a new championship (Admin only)
router.post('/', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, start_date, end_date, game_id, rules, prize_pool } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Championship name is required.' });
  }
  // Add more validation as needed for other fields

  try {
    const { data, error } = await supabase
      .from('championships')
      .insert([{ 
        name, 
        description, 
        start_date, 
        end_date, 
        game_id, // Assuming game_id is provided and valid
        rules, 
        prize_pool,
        created_by: req.user?.id // Set the creator from authenticated user
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating championship:', error.message);
    res.status(500).json({ error: 'Failed to create championship', details: error.message });
  }
});

// GET /api/championships - Get all championships (Publicly listable)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('championships')
      .select('*', { count: 'exact' }) // Fetches all columns and total count
      .order('created_at', { ascending: false }) // Example ordering
      .range(rangeStart, rangeEnd);

    if (error) throw error;
    res.json({
      championships: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching championships:', error.message);
    res.status(500).json({ error: 'Failed to fetch championships', details: error.message });
  }
});

// GET /api/championships/:id - Get a single championship (Publicly viewable)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('championships')
      .select('*') // Consider joining with related data like game name if needed: '*, game_id(*)'
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Championship not found' });
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching championship by ID:', error.message);
    if (error.code === 'PGRST116') { // PostgREST error for "JSON object requested, multiple (or no) rows returned"
        return res.status(404).json({ error: 'Championship not found or multiple entries returned unexpectedly.' });
    }
    res.status(500).json({ error: 'Failed to fetch championship', details: error.message });
  }
});

// PUT /api/championships/:id - Update an existing championship (Admin only)
router.put('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, start_date, end_date, game_id, rules, prize_pool, status } = req.body;

  // Validate input
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Invalid championship name.' });
  }
  // Add more validation for other fields as necessary

  const updates: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (start_date !== undefined) updates.start_date = start_date;
  if (end_date !== undefined) updates.end_date = end_date;
  if (game_id !== undefined) updates.game_id = game_id;
  if (rules !== undefined) updates.rules = rules;
  if (prize_pool !== undefined) updates.prize_pool = prize_pool;
  if (status !== undefined) updates.status = status; // e.g., 'upcoming', 'ongoing', 'completed'


  try {
    const { data, error } = await supabase
      .from('championships')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Championship not found or no update occurred' });
    res.json(data);
  } catch (error: any) {
    console.error('Error updating championship:', error.message);
     if (error.code === 'PGRST116') { 
        return res.status(404).json({ error: 'Championship not found.' });
    }
    res.status(500).json({ error: 'Failed to update championship', details: error.message });
  }
});

// DELETE /api/championships/:id - Delete a championship (Admin only)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { error, count } = await supabase
      .from('championships')
      .delete({ count: 'exact' }) // Ensure we know if a row was actually deleted
      .eq('id', id);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Championship not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting championship:', error.message);
    res.status(500).json({ error: 'Failed to delete championship', details: error.message });
  }
});

export default router;
