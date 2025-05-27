import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// POST /api/events - Create a new event (Admin only)
router.post('/', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { name, description, event_date, championship_id, location, status } = req.body;

  if (!name || !event_date || !championship_id) {
    return res.status(400).json({ error: 'Event name, event_date, and championship_id are required.' });
  }
  // Add more validation as needed (e.g., date format, valid championship_id)

  try {
    const { data, error } = await supabase
      .from('events')
      .insert([{ 
        name, 
        description, 
        event_date, 
        championship_id,
        location,
        status: status || 'upcoming', // Default status
        created_by: req.user?.id 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ error: 'Failed to create event', details: error.message });
  }
});

// GET /api/events - Get all events (Publicly listable)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;
  const championship_id = req.query.championship_id as string;

  try {
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('event_date', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (championship_id) {
      query = query.eq('championship_id', championship_id);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    res.json({
      events: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching events:', error.message);
    res.status(500).json({ error: 'Failed to fetch events', details: error.message });
  }
});

// GET /api/events/:id - Get a single event (Publicly viewable)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Event ID is required.'})
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*') // Consider joining with championship details: '*, championship_id(*)'
      .eq('id', id)
      .single();

    if (error) {
        if (error.code === 'PGRST116') { // Not found or multiple rows
            return res.status(404).json({ error: 'Event not found.' });
        }
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Event not found' }); // Should be caught by PGRST116 mostly
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching event by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch event', details: error.message });
  }
});

// PUT /api/events/:id - Update an existing event (Admin only)
router.put('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, event_date, championship_id, location, status } = req.body;

  if (!id) return res.status(400).json({ error: 'Event ID is required.'})
  // Basic validation
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No update data provided.' });
  }
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Invalid event name.' });
  }
  // Add more specific validation for other fields as necessary

  const updates: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (event_date !== undefined) updates.event_date = event_date;
  if (championship_id !== undefined) updates.championship_id = championship_id;
  if (location !== undefined) updates.location = location;
  if (status !== undefined) updates.status = status;


  try {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
        if (error.code === 'PGRST116') { 
            return res.status(404).json({ error: 'Event not found.' });
        }
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Event not found or no update occurred' });
    res.json(data);
  } catch (error: any) {
    console.error('Error updating event:', error.message);
    res.status(500).json({ error: 'Failed to update event', details: error.message });
  }
});

// DELETE /api/events/:id - Delete an event (Admin only)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Event ID is required.'})

  try {
    const { error, count } = await supabase
      .from('events')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Event not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting event:', error.message);
    res.status(500).json({ error: 'Failed to delete event', details: error.message });
  }
});

export default router;
