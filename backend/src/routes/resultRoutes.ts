import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// POST /api/results - Submit results for an event (Admin only)
router.post('/', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { 
    event_id, 
    user_id, // This is the participant's user_id
    position, 
    points, 
    team_id, 
    vehicle_id, 
    lap_time_ms,
    notes
  } = req.body;

  if (!event_id || !user_id || position === undefined) {
    return res.status(400).json({ error: 'event_id, user_id, and position are required.' });
  }
  if (typeof position !== 'number' || position <= 0) {
    return res.status(400).json({ error: 'Position must be a positive number.' });
  }
  if (points !== undefined && typeof points !== 'number') {
    return res.status(400).json({ error: 'Points must be a number.' });
  }
  if (lap_time_ms !== undefined && (typeof lap_time_ms !== 'number' || lap_time_ms < 0)) {
    return res.status(400).json({ error: 'lap_time_ms must be a non-negative number.' });
  }
  // Add more validation for team_id, vehicle_id if they are numbers, etc.

  try {
    // Optional: Check if the user is actually registered for the event
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', event_id)
      .eq('user_id', user_id)
      .in('status', ['confirmed']) // Only allow results for confirmed participants
      .maybeSingle();

    if (regError) throw regError;
    if (!registration) {
      // return res.status(400).json({ error: 'The specified user is not confirmed for this event.' });
      // Depending on strictness, you might allow results even without prior registration, or log a warning.
      // For now, we'll proceed, but this is a common validation.
      console.warn(`Submitting result for user ${user_id} in event ${event_id} who does not have a 'confirmed' registration.`);
    }
    
    // Check for existing result for this user in this event to prevent duplicates
    const { data: existingResult, error: existingResultError } = await supabase
        .from('results')
        .select('id')
        .eq('event_id', event_id)
        .eq('user_id', user_id)
        .maybeSingle();

    if (existingResultError) throw existingResultError;
    if (existingResult) {
        return res.status(409).json({ error: 'A result for this user in this event already exists. Use PUT to update.' });
    }


    const { data, error } = await supabase
      .from('results')
      .insert([{ 
        event_id, 
        user_id, 
        position, 
        points, 
        team_id, 
        vehicle_id, 
        lap_time_ms,
        notes,
        submitted_by: req.user?.id // Admin who submitted this result
      }])
      .select()
      .single();

    if (error) {
        // Handle specific errors like foreign key violations
        if (error.code === '23503') { 
            if (error.message.includes('results_event_id_fkey')) {
                return res.status(400).json({ error: 'Invalid event_id. Event does not exist.' });
            }
            if (error.message.includes('results_user_id_fkey')) {
                return res.status(400).json({ error: 'Invalid user_id. User does not exist.' });
            }
            // Add checks for team_id, vehicle_id if they have FK constraints
        }
        throw error;
    }
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error submitting result:', error.message);
    res.status(500).json({ error: 'Failed to submit result', details: error.message });
  }
});

// GET /api/results - Get all results (Publicly accessible, filterable)
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  const { event_id, championship_id, user_id, team_id } = req.query;

  try {
    let query = supabase
      .from('results')
      .select(`
        *,
        event:events(id, name, championship_id, championships(id, name)),
        user:profiles(id, username, avatar_url),
        team:teams(id, name),
        vehicle:vehicles(id, name)
      `, { count: 'exact' })
      .order('position', { ascending: true }) // Usually results are ordered by position
      .order('points', { ascending: false })   // Then by points for tie-breaking if needed
      .range(rangeStart, rangeEnd);

    if (event_id) query = query.eq('event_id', event_id as string);
    if (user_id) query = query.eq('user_id', user_id as string);
    if (team_id) query = query.eq('team_id', team_id as string);
    
    if (championship_id) {
      // This requires a join or a subquery on events if 'championship_id' is not directly in 'results'
      // Assuming 'events' table has 'championship_id'
      // We can filter by events that belong to the championship_id
      const { data: eventIds, error: eventIdError } = await supabase
        .from('events')
        .select('id')
        .eq('championship_id', championship_id as string);
      
      if (eventIdError) throw eventIdError;
      if (eventIds && eventIds.length > 0) {
        query = query.in('event_id', eventIds.map(e => e.id));
      } else {
        // No events for this championship, so no results
        return res.json({ results: [], total: 0, page, limit });
      }
    }

    const { data, error, count } = await query;

    if (error) throw error;
    res.json({
      results: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching results:', error.message);
    res.status(500).json({ error: 'Failed to fetch results', details: error.message });
  }
});

// GET /api/results/:id - Get a single result (Publicly viewable)
router.get('/:id', async (req: Request, res: Response) => {
  const resultId = parseInt(req.params.id);
  if (isNaN(resultId)) return res.status(400).json({ error: 'Invalid result ID.' });

  try {
    const { data, error } = await supabase
      .from('results')
      .select(`
        *,
        event:events(id, name, championship_id, championships(id, name)),
        user:profiles(id, username, avatar_url),
        team:teams(id, name),
        vehicle:vehicles(id, name)
      `)
      .eq('id', resultId)
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Result not found.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Result not found.' });
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching result by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch result', details: error.message });
  }
});

// PUT /api/results/:id - Update a result (Admin only)
router.put('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const resultId = parseInt(req.params.id);
  if (isNaN(resultId)) return res.status(400).json({ error: 'Invalid result ID.' });

  const { position, points, team_id, vehicle_id, lap_time_ms, notes, user_id, event_id } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'No update data provided.' });
  }
  // Add similar validation as in POST for the fields being updated
  if (position !== undefined && (typeof position !== 'number' || position <= 0)) {
    return res.status(400).json({ error: 'Position must be a positive number.' });
  }

  const updates: any = { updated_at: new Date().toISOString() };
  if (position !== undefined) updates.position = position;
  if (points !== undefined) updates.points = points; // Allow null for points
  if (lap_time_ms !== undefined) updates.lap_time_ms = lap_time_ms; // Allow null
  
  // Allow explicit nulls or new values for optional fields
  if (req.body.hasOwnProperty('team_id')) updates.team_id = team_id;
  if (req.body.hasOwnProperty('vehicle_id')) updates.vehicle_id = vehicle_id;
  if (req.body.hasOwnProperty('notes')) updates.notes = notes;
  
  // Potentially allow changing user_id or event_id, but this is risky and might indicate a new result entry
  // For now, we'll assume these are not changed or handled carefully by admin.
  if (user_id !== undefined) updates.user_id = user_id;
  if (event_id !== undefined) updates.event_id = event_id;


  try {
    // Check if trying to change user_id or event_id to something that creates a duplicate
    if (user_id || event_id) {
        const currentResult = await supabase.from('results').select('user_id, event_id').eq('id', resultId).single();
        if (currentResult.data) {
            const targetUserId = user_id || currentResult.data.user_id;
            const targetEventId = event_id || currentResult.data.event_id;
            if (targetUserId !== currentResult.data.user_id || targetEventId !== currentResult.data.event_id) {
                const { data: existing, error: checkErr } = await supabase.from('results')
                    .select('id')
                    .eq('user_id', targetUserId)
                    .eq('event_id', targetEventId)
                    .neq('id', resultId) // Exclude the current result itself
                    .maybeSingle();
                if (checkErr) throw checkErr;
                if (existing) return res.status(409).json({ error: 'Updating user_id or event_id would create a duplicate result entry.'});
            }
        }
    }


    const { data, error } = await supabase
      .from('results')
      .update(updates)
      .eq('id', resultId)
      .select()
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Result not found.' });
        if (error.code === '23503') { /* Handle FK violations */ }
        if (error.code === '23505') { /* Handle unique violations if any on update */ }
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Result not found or no update occurred' });
    res.json(data);
  } catch (error: any) {
    console.error('Error updating result:', error.message);
    res.status(500).json({ error: 'Failed to update result', details: error.message });
  }
});

// DELETE /api/results/:id - Delete a result (Admin only)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const resultId = parseInt(req.params.id);
  if (isNaN(resultId)) return res.status(400).json({ error: 'Invalid result ID.' });

  try {
    const { error, count } = await supabase
      .from('results')
      .delete({ count: 'exact' })
      .eq('id', resultId);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Result not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting result:', error.message);
    res.status(500).json({ error: 'Failed to delete result', details: error.message });
  }
});

export default router;
