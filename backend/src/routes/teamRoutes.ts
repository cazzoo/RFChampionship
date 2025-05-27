import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware'; // Assuming checkRole can handle 'admin'

const router = express.Router();

// POST /api/teams - Create a new team
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body;
  const owner_id = req.user?.id;

  if (!name) {
    return res.status(400).json({ error: 'Team name is required.' });
  }
  if (!owner_id) {
    return res.status(401).json({ error: 'User not authenticated or user ID missing.' });
  }

  try {
    // Start a transaction
    const { data: teamData, error: teamError } = await supabase.rpc('create_team_and_add_owner', {
        team_name: name,
        team_description: description,
        owner_user_id: owner_id
    });

    if (teamError) {
        console.error('Error in create_team_and_add_owner RPC:', teamError.message);
        // Check for specific error details if available
        if (teamError.details?.includes('unique constraint')) {
            return res.status(409).json({ error: 'A team with this name might already exist or another unique constraint violated.', details: teamError.message });
        }
        return res.status(500).json({ error: 'Failed to create team and add owner', details: teamError.message });
    }
    
    // The RPC should return the created team data or some success indicator.
    // If it returns the team, we can send it back.
    // If your RPC is set up to return the team details from the 'teams' table:
    if (!teamData || (Array.isArray(teamData) && teamData.length === 0)) {
        // This might happen if the RPC doesn't return the team or returns an empty array on success
        // For now, let's assume the RPC returns the new team, or we fetch it if needed.
        // For simplicity, if teamData is not what we expect, query for the team.
        // This part depends heavily on your RPC's return value.
        // A better RPC would return the created team directly.
        // As a fallback (not ideal), fetch the team:
        const { data: fetchedTeam, error: fetchError } = await supabase
            .from('teams')
            .select('*')
            .eq('name', name)
            .eq('owner_id', owner_id)
            .single();
        if (fetchError || !fetchedTeam) {
            console.error('Failed to fetch team after RPC creation or RPC returned no data:', fetchError?.message);
            return res.status(201).json({ message: 'Team created, but failed to retrieve details immediately.', name });
        }
        return res.status(201).json(fetchedTeam);
    }
    
    // If teamData is correctly returned by the RPC (e.g., as the first element of an array if using SELECT in PL/pgSQL)
    // And assuming teamData is the team object itself or an array containing it.
    const finalTeamData = Array.isArray(teamData) ? teamData[0] : teamData;

    res.status(201).json(finalTeamData);

  } catch (error: any) {
    console.error('Error creating team:', error.message);
    res.status(500).json({ error: 'Failed to create team', details: error.message });
  }
});

// GET /api/teams - Get all teams
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('teams')
      .select('*, owner:profiles(id, username, avatar_url)', { count: 'exact' }) // Fetch owner's public profile
      .order('created_at', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) throw error;
    res.json({
      teams: data,
      total: count,
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({ error: 'Failed to fetch teams', details: error.message });
  }
});

// GET /api/teams/:id - Get a single team by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Team ID is required.' });

  try {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*, owner:profiles(id, username, avatar_url)') // Fetch team details and owner's profile
      .eq('id', id)
      .single();

    if (teamError) {
        if (teamError.code === 'PGRST116') return res.status(404).json({ error: 'Team not found.' });
        throw teamError;
    }
    if (!team) return res.status(404).json({ error: 'Team not found.' }); // Should be caught by PGRST116

    // Fetch team members
    const { data: members, error: membersError } = await supabase
      .from('team_members')
      .select('user_id, joined_at, profiles (id, username, avatar_url, role)') // Join with profiles to get member details
      .eq('team_id', id);

    if (membersError) {
        console.warn('Failed to fetch team members for team ID:', id, membersError.message);
        // Decide if you want to return the team data even if members fail to load
        return res.json({ ...team, members: [], warning: 'Could not fetch team members.' });
    }

    res.json({ ...team, members: members || [] });
  } catch (error: any) {
    console.error('Error fetching team by ID:', error.message);
    res.status(500).json({ error: 'Failed to fetch team', details: error.message });
  }
});


// Helper function to check team ownership or admin role
const canModifyTeam = async (userId: string, teamId: string, userRole?: string): Promise<boolean> => {
  if (userRole === 'admin') {
    return true;
  }
  const { data: team, error } = await supabase
    .from('teams')
    .select('owner_id')
    .eq('id', teamId)
    .single();
  if (error || !team) {
    return false;
  }
  return team.owner_id === userId;
};

// PUT /api/teams/:id - Update an existing team
router.put('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: teamId } = req.params;
  const { name, description } = req.body;
  const userId = req.user?.id;
  const userRole = req.user?.app_metadata?.user_role;

  if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
  if (!teamId) return res.status(400).json({ error: 'Team ID is required.' });
  if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
    return res.status(400).json({ error: 'Invalid team name.' });
  }
   if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ error: 'Invalid team description format.' });
  }

  const authorized = await canModifyTeam(userId, teamId, userRole);
  if (!authorized) {
    return res.status(403).json({ error: 'Forbidden. You do not have permission to modify this team.' });
  }

  const updates: any = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  
  if (Object.keys(updates).length <= 1 && !name && !description) { // only updated_at
      return res.status(400).json({ error: 'No valid fields provided for update.' });
  }

  try {
    const { data, error } = await supabase
      .from('teams')
      .update(updates)
      .eq('id', teamId)
      .select()
      .single();

    if (error) {
        if (error.code === 'PGRST116') return res.status(404).json({ error: 'Team not found or no update occurred.' });
        throw error;
    }
    if (!data) return res.status(404).json({ error: 'Team not found or no update occurred.' });
    res.json(data);
  } catch (error: any) {
    console.error('Error updating team:', error.message);
    res.status(500).json({ error: 'Failed to update team', details: error.message });
  }
});

// DELETE /api/teams/:id - Delete a team
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { id: teamId } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.app_metadata?.user_role;

  if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
  if (!teamId) return res.status(400).json({ error: 'Team ID is required.' });

  const authorized = await canModifyTeam(userId, teamId, userRole);
  if (!authorized) {
    return res.status(403).json({ error: 'Forbidden. You do not have permission to delete this team.' });
  }

  try {
    // Deleting from 'teams' should cascade to 'team_members' if FK is set up with ON DELETE CASCADE
    const { error, count } = await supabase
      .from('teams')
      .delete({ count: 'exact' })
      .eq('id', teamId);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Team not found.' });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting team:', error.message);
    res.status(500).json({ error: 'Failed to delete team', details: error.message });
  }
});

// POST /api/teams/:teamId/members - Add member to a team
router.post('/:teamId/members', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { teamId } = req.params;
  const { userId: memberUserId } = req.body; // User ID of the member to add
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;

  if (!currentUserId) return res.status(401).json({ error: 'User not authenticated.' });
  if (!teamId) return res.status(400).json({ error: 'Team ID is required.' });
  if (!memberUserId) return res.status(400).json({ error: 'User ID of the member to add is required.' });

  const authorized = await canModifyTeam(currentUserId, teamId, currentUserRole);
  if (!authorized) {
    return res.status(403).json({ error: 'Forbidden. You do not have permission to add members to this team.' });
  }

  try {
    // Check if user is already a member
    const { data: existingMember, error: checkError } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId)
      .eq('user_id', memberUserId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows, which is fine here
        throw checkError;
    }
    if (existingMember) {
      return res.status(409).json({ error: 'User is already a member of this team.' });
    }

    // Add member
    const { data: newMembership, error: insertError } = await supabase
      .from('team_members')
      .insert({ team_id: teamId, user_id: memberUserId })
      .select('*, profile:profiles(id, username, avatar_url)') // Optionally return details of the new member
      .single();

    if (insertError) throw insertError;
    res.status(201).json(newMembership);
  } catch (error: any) {
    console.error('Error adding member to team:', error.message);
    if (error.code === '23503') { // Foreign key violation (e.g. user_id or team_id doesn't exist)
        return res.status(404).json({ error: 'User or Team not found.', details: error.message });
    }
    res.status(500).json({ error: 'Failed to add member to team', details: error.message });
  }
});

// DELETE /api/teams/:teamId/members/:userId - Remove member from a team
router.delete('/:teamId/members/:userId', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { teamId, userId: memberUserIdToRemove } = req.params;
  const currentUserId = req.user?.id;
  const currentUserRole = req.user?.app_metadata?.user_role;

  if (!currentUserId) return res.status(401).json({ error: 'User not authenticated.' });
  if (!teamId) return res.status(400).json({ error: 'Team ID is required.' });
  if (!memberUserIdToRemove) return res.status(400).json({ error: 'User ID of the member to remove is required.' });

  // Check if the team exists and get owner_id for authorization
  const { data: team, error: teamFetchError } = await supabase
    .from('teams')
    .select('owner_id')
    .eq('id', teamId)
    .single();

  if (teamFetchError || !team) {
    return res.status(404).json({ error: 'Team not found.' });
  }

  const isOwner = team.owner_id === currentUserId;
  const isAdmin = currentUserRole === 'admin';
  const isSelf = currentUserId === memberUserIdToRemove;
  
  // Prevent owner from being removed by this endpoint if they are not admin or self-removing (should delete team or transfer ownership)
  if (team.owner_id === memberUserIdToRemove && !isAdmin && !isSelf) {
      return res.status(403).json({ error: "Team owner cannot be removed directly by another non-admin user. Consider transferring ownership or deleting the team."});
  }
  // Prevent owner from removing themselves if they are the last member (or handle this case specifically, e.g., by requiring team deletion)
  // This check might be complex: requires checking if owner is the only member. For simplicity, this check is omitted here,
  // but in a real app, you'd want to prevent orphaning a team or ensure the owner is not the one being removed if they are the last one.

  if (!isAdmin && !isOwner && !isSelf) {
    return res.status(403).json({ error: 'Forbidden. You do not have permission to remove this member.' });
  }

  try {
    const { error, count } = await supabase
      .from('team_members')
      .delete({ count: 'exact' })
      .eq('team_id', teamId)
      .eq('user_id', memberUserIdToRemove);

    if (error) throw error;
    if (count === 0) {
        return res.status(404).json({ error: 'Member not found in this team or already removed.' });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error('Error removing member from team:', error.message);
    res.status(500).json({ error: 'Failed to remove member from team', details: error.message });
  }
});

export default router;
