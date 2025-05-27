import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// POST /api/registrations - Register for an event or championship
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated.' });
  }

  const { championship_id, event_id, team_id, vehicle_id } = req.body;

  if (!championship_id && !event_id) {
    return res.status(400).json({ error: 'Either championship_id or event_id must be provided.' });
  }
  if (championship_id && event_id) {
    return res.status(400).json({ error: 'Cannot register for both a championship and an event simultaneously with one registration.' });
  }

  // Basic validation for IDs
  if (championship_id !== undefined && (typeof championship_id !== 'number' || championship_id <= 0)) {
    return res.status(400).json({ error: 'Invalid championship_id.' });
  }
  if (event_id !== undefined && (typeof event_id !== 'number' || event_id <= 0)) {
    return res.status(400).json({ error: 'Invalid event_id.' });
  }
  if (team_id !== undefined && (team_id !== null && (typeof team_id !== 'number' || team_id <= 0))) {
    return res.status(400).json({ error: 'Invalid team_id.' });
  }
  if (vehicle_id !== undefined && (vehicle_id !== null && (typeof vehicle_id !== 'number' || vehicle_id <= 0))) {
    return res.status(400).json({ error: 'Invalid vehicle_id.' });
  }
  
  const registrationData: any = {
    user_id,
    championship_id: championship_id || null,
    event_id: event_id || null,
    team_id: team_id || null,
    vehicle_id: vehicle_id || null,
    status: 'pending', // Default status
  };

  try {
    // Check for duplicate active registrations (pending, confirmed)
    // This logic might need to be more sophisticated depending on how "active" is defined
    // and if re-registration after cancellation is allowed. The DB unique constraints help.
    let duplicateCheckQuery = supabase
      .from('registrations')
      .select('id')
      .eq('user_id', user_id)
      .in('status', ['pending', 'confirmed']); // Check against active statuses

    if (event_id) {
      duplicateCheckQuery = duplicateCheckQuery.eq('event_id', event_id);
    } else if (championship_id) {
      duplicateCheckQuery = duplicateCheckQuery.eq('championship_id', championship_id);
    }
    
    const { data: existingReg, error: checkError } = await duplicateCheckQuery.maybeSingle();

    if (checkError) throw checkError;
    if (existingReg) {
      return res.status(409).json({ error: 'You already have an active registration for this event/championship.' });
    }

    // Create registration
    const { data, error } = await supabase
      .from('registrations')
      .insert(registrationData)
      .select()
      .single();

    if (error) {
        // Handle specific errors like foreign key violations if a championship/event doesn't exist
        if (error.code === '23503') { // Foreign key violation
            if (error.message.includes('registrations_championship_id_fkey')) {
                return res.status(400).json({ error: 'Invalid championship_id. Championship does not exist.' });
            }
            if (error.message.includes('registrations_event_id_fkey')) {
                return res.status(400).json({ error: 'Invalid event_id. Event does not exist.' });
            }
             if (error.message.includes('registrations_team_id_fkey')) {
                return res.status(400).json({ error: 'Invalid team_id. Team does not exist.' });
            }
             if (error.message.includes('registrations_vehicle_id_fkey')) {
                return res.status(400).json({ error: 'Invalid vehicle_id. Vehicle does not exist.' });
            }
        }
         // Handle unique constraint violations from DB if the application logic check was insufficient
        if (error.code === '23505') { // Unique violation
             return res.status(409).json({ error: 'This registration would create a duplicate entry (likely due to status and event/championship combination).' });
        }
        throw error;
    }
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating registration:', error.message);
    res.status(500).json({ error: 'Failed to create registration', details: error.message });
  }
});

// GET /api/registrations - Get registrations (All for admin, own for users)
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  const userRole = req.user?.app_metadata?.user_role;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  // Filters for admin
  const filterUserId = req.query.user_id as string;
  const filterEventId = req.query.event_id as string;
  const filterChampionshipId = req.query.championship_id as string;
  const filterStatus = req.query.status as string;

  try {
    let query = supabase
      .from('registrations')
      .select(`
        *,
        user:profiles(id, username, avatar_url),
        championship:championships(id, name),
        event:events(id, name),
        team:teams(id, name),
        vehicle:vehicles(id, name)
      `, { count: 'exact' })
      .order('registration_date', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (userRole !== 'admin') {
      query = query.eq('user_id', user_id);
    } else {
      // Admin can filter
      if (filterUserId) query = query.eq('user_id', filterUserId);
      if (filterEventId) query = query.eq('event_id', filterEventId);
      if (filterChampionshipId) query = query.eq('championship_id', filterChampionshipId);
      if (filterStatus) query = query.eq('status', filterStatus);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    res.json({
      registrations: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching registrations:', error.message);
    res.status(500).json({ error: 'Failed to fetch registrations', details: error.message });
  }
});

// GET /api/registrations/:id - Get a single registration
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const registrationId = parseInt(req.params.id);
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;

  if (isNaN(registrationId)) {
    return res.status(400).json({ error: 'Invalid registration ID.' });
  }

  try {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        user:profiles(id, username, avatar_url),
        championship:championships(id, name),
        event:events(id, name),
        team:teams(id, name),
        vehicle:vehicles(id, name)
      `)
      .eq('id', registrationId)
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Registration not found.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Registration not found.' });

    // Authorization: Admin or owner of the registration
    if (currentUserRole !== 'admin' && data.user_id !== currentUserId) {
      return res.status(403).json({ error: 'Forbidden. You do not have permission to view this registration.' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error fetching registration by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch registration', details: error.message });
  }
});

// PUT /api/registrations/:id/status - Update registration status
router.put('/:id/status', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const registrationId = parseInt(req.params.id);
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;
  const { status } = req.body;

  if (isNaN(registrationId)) {
    return res.status(400).json({ error: 'Invalid registration ID.' });
  }
  if (!status || typeof status !== 'string') {
    return res.status(400).json({ error: 'New status is required and must be a string.' });
  }
  // Validate status against the ENUM values (optional, DB will enforce it too)
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'waitlisted'];
  if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    // Fetch the registration to check ownership if user is not admin
    const { data: existingReg, error: fetchError } = await supabase
      .from('registrations')
      .select('user_id, status') // Only fetch what's needed
      .eq('id', registrationId)
      .single();

    if (fetchError) {
        if (fetchError.code === 'PGRST116') return res.status(404).json({ error: 'Registration not found.' });
        throw fetchError;
    }
    if (!existingReg) return res.status(404).json({ error: 'Registration not found.' });

    // Authorization
    if (currentUserRole !== 'admin') {
      if (existingReg.user_id !== currentUserId) {
        return res.status(403).json({ error: 'Forbidden. You cannot modify this registration.' });
      }
      // Regular user can only cancel their own registration
      if (status !== 'cancelled') {
        return res.status(403).json({ error: 'Forbidden. You can only cancel your registration.' });
      }
      // Optional: Prevent cancelling already confirmed/completed registrations by users.
      // if (existingReg.status === 'confirmed' && status === 'cancelled') { /* allow or deny */ }
    }

    // Update status
    const { data: updatedReg, error: updateError } = await supabase
      .from('registrations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', registrationId)
      .select() // Select updated record
      .single();

    if (updateError) {
        // The DB unique constraints might cause errors here if changing status creates a duplicate active registration
        if (updateError.code === '23505') { 
             return res.status(409).json({ error: 'Updating status would create a duplicate active registration for this user and event/championship.' });
        }
        throw updateError;
    }
    
    res.json(updatedReg);
  } catch (error: any) {
    console.error('Error updating registration status:', error.message);
    res.status(500).json({ error: 'Failed to update registration status', details: error.message });
  }
});

// DELETE /api/registrations/:id - Delete a registration (Admin only for now)
router.delete('/:id', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const registrationId = parseInt(req.params.id);

  if (isNaN(registrationId)) {
    return res.status(400).json({ error: 'Invalid registration ID.' });
  }
  
  // Optional: Allow users to delete their own 'pending' or 'cancelled' registrations
  // const currentUserId = req.user?.id;
  // const currentUserRole = req.user?.app_metadata?.user_role;
  // if (currentUserRole !== 'admin') {
  //   const { data: reg, error: fetchErr } = await supabase.from('registrations').select('user_id, status').eq('id', registrationId).single();
  //   if (fetchErr || !reg) return res.status(404).json({ error: 'Registration not found or could not verify ownership.' });
  //   if (reg.user_id !== currentUserId || !['pending', 'cancelled'].includes(reg.status)) {
  //     return res.status(403).json({ error: 'Forbidden. You can only delete your own pending/cancelled registrations.' });
  //   }
  // }

  try {
    const { error, count } = await supabase
      .from('registrations')
      .delete({ count: 'exact' })
      .eq('id', registrationId);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Registration not found.' });
    }
    res.status(204).send(); // No Content
  } catch (error: any) {
    console.error('Error deleting registration:', error.message);
    res.status(500).json({ error: 'Failed to delete registration', details: error.message });
  }
});

export default router;
