import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// POST /api/tracks - Create a new track (Admin only)
router.post('/', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { name, location, length_km, layout_image_url } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Track name is required.' });
  }
  if (length_km !== undefined && (typeof length_km !== 'number' || length_km <= 0)) {
    return res.status(400).json({ error: 'Invalid track length.' });
  }
  if (layout_image_url !== undefined && typeof layout_image_url !== 'string') {
    return res.status(400).json({ error: 'Invalid layout image URL format.' });
  }


  try {
    const { data, error } = await supabase
      .from('tracks')
      .insert([{ name, location, length_km, layout_image_url }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating track:', error.message);
    res.status(500).json({ error: 'Failed to create track', details: error.message });
  }
});

// GET /api/tracks - Get all tracks (Publicly listable)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('tracks')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(rangeStart, rangeEnd);

    if (error) throw error;
    res.json({
      tracks: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching tracks:', error.message);
    res.status(500).json({ error: 'Failed to fetch tracks', details: error.message });
  }
});

// GET /api/tracks/:id - Get a single track (Publicly viewable)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Track ID is required.'});

  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Track not found.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Track not found' });
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching track by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch track', details: error.message });
  }
});

// PUT /api/tracks/:id - Update an existing track (Admin only)
router.put('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Track ID is required.'});
  
  const { name, location, length_km, layout_image_url } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No update data provided.' });
  }
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Invalid track name.' });
  }
  if (length_km !== undefined && (length_km !== null && (typeof length_km !== 'number' || length_km <= 0))) {
    return res.status(400).json({ error: 'Invalid track length. Must be a positive number or null.' });
  }
   if (layout_image_url !== undefined && (layout_image_url !== null && typeof layout_image_url !== 'string')) {
    return res.status(400).json({ error: 'Invalid layout image URL format. Must be a string or null.' });
  }
  if (location !== undefined && (location !== null && typeof location !== 'string')) {
     return res.status(400).json({ error: 'Invalid location format. Must be a string or null.' });
  }


  const updates: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  // Allow setting fields to null explicitly
  updates.location = location;
  updates.length_km = length_km;
  updates.layout_image_url = layout_image_url;


  try {
    const { data, error } = await supabase
      .from('tracks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Track not found.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Track not found or no update occurred' });
    res.json(data);
  } catch (error: any) {
    console.error('Error updating track:', error.message);
    res.status(500).json({ error: 'Failed to update track', details: error.message });
  }
});

// DELETE /api/tracks/:id - Delete a track (Admin only)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Track ID is required.'});

  try {
    const { error, count } = await supabase
      .from('tracks')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Track not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting track:', error.message);
    res.status(500).json({ error: 'Failed to delete track', details: error.message });
  }
});

export default router;
