import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// POST /api/vehicles - Create a new vehicle (Admin only)
router.post('/', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { name, type, manufacturer, performance_rating } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Vehicle name is required.' });
  }
  if (performance_rating !== undefined && (typeof performance_rating !== 'number' || performance_rating < 0 || performance_rating > 10)) {
      return res.status(400).json({ error: 'Performance rating must be a number between 0 and 10.' });
  }
  // Add more validation as needed

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{ name, type, manufacturer, performance_rating }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating vehicle:', error.message);
    res.status(500).json({ error: 'Failed to create vehicle', details: error.message });
  }
});

// GET /api/vehicles - Get all vehicles (Publicly listable)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('vehicles')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(rangeStart, rangeEnd);

    if (error) throw error;
    res.json({
      vehicles: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching vehicles:', error.message);
    res.status(500).json({ error: 'Failed to fetch vehicles', details: error.message });
  }
});

// GET /api/vehicles/:id - Get a single vehicle (Publicly viewable)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Vehicle ID is required.'});


  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Vehicle not found.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching vehicle by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch vehicle', details: error.message });
  }
});

// PUT /api/vehicles/:id - Update an existing vehicle (Admin only)
router.put('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Vehicle ID is required.'});

  const { name, type, manufacturer, performance_rating } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No update data provided.' });
  }
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Invalid vehicle name.' });
  }
  if (performance_rating !== undefined && (performance_rating !== null && (typeof performance_rating !== 'number' || performance_rating < 0 || performance_rating > 10))) {
      return res.status(400).json({ error: 'Performance rating must be a number between 0 and 10, or null.' });
  }
  // Add more validation for type, manufacturer as needed

  const updates: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  
  // Allow setting fields to null explicitly or updating them
  updates.type = type;
  updates.manufacturer = manufacturer;
  updates.performance_rating = performance_rating;


  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Vehicle not found.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Vehicle not found or no update occurred' });
    res.json(data);
  } catch (error: any) {
    console.error('Error updating vehicle:', error.message);
    res.status(500).json({ error: 'Failed to update vehicle', details: error.message });
  }
});

// DELETE /api/vehicles/:id - Delete a vehicle (Admin only)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) return res.status(400).json({ error: 'Valid Vehicle ID is required.'});

  try {
    const { error, count } = await supabase
      .from('vehicles')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Vehicle not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting vehicle:', error.message);
    res.status(500).json({ error: 'Failed to delete vehicle', details: error.message });
  }
});

export default router;
