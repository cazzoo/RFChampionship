import express, { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { authMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/rbacMiddleware';

const router = express.Router();

// GET /api/users/me - Get current user's profile
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Profile not found' });
    res.json(data);
  } catch (error: any) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
});

// PUT /api/users/me - Update current user's profile
router.put('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  const { username, avatar_url, website } = req.body;
  // Basic validation
  if (username !== undefined && typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid username format' });
  }
  if (avatar_url !== undefined && typeof avatar_url !== 'string') {
    return res.status(400).json({ error: 'Invalid avatar_url format' });
  }
  if (website !== undefined && typeof website !== 'string') {
    return res.status(400).json({ error: 'Invalid website format' });
  }

  const updates: { username?: string, avatar_url?: string, website?: string, updated_at: string } = { updated_at: new Date().toISOString() };
  if (username !== undefined) updates.username = username;
  if (avatar_url !== undefined) updates.avatar_url = avatar_url;
  if (website !== undefined) updates.website = website;


  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// GET /api/users - Get all users (Admin only)
router.get('/', authMiddleware, checkRole('admin'), async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const rangeStart = (page - 1) * limit;
  const rangeEnd = page * limit - 1;

  try {
    // Fetch users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers({ page, perPage: limit });
    if (authError) throw authError;

    // Fetch profiles for these users
    // Note: This makes N+1 queries if not careful. For larger scale, consider a join or a function.
    // However, Supabase's RLS should handle profile access if profiles table also has RLS.
    // For simplicity here, we fetch profiles based on IDs from authUsers.
    // This example does not perform a direct join due to potential complexity with separate auth/db schemas.

    const userIds = authUsers.users.map(u => u.id);
    if (userIds.length === 0) {
        return res.json({ users: [], total: 0, page, limit });
    }
    
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

    if (profilesError) throw profilesError;

    // Combine auth user data with profile data
    const usersWithProfiles = authUsers.users.map(authUser => {
        const profile = profiles.find(p => p.id === authUser.id);
        return { ...authUser, profile }; // Spread authUser and add profile
    });
    
    // Supabase's listUsers doesn't directly provide a total count in the same way as db queries.
    // For accurate total count for pagination, a separate count query might be needed or rely on heuristics if the API provides it.
    // The `authUsers.total` (or similar property if available from `listUsers`) should be used.
    // As of current Supabase JS client, `listUsers` returns `aud`, `users` but total might be inferred or require another call.
    // Let's assume for now `authUsers.users.length` gives current page count and we might need a different total.
    // For a robust solution, a dedicated count like `supabase.auth.admin.listUsers({page:1, perPage:1})` and checking a total property or a separate DB count on profiles.
    // For this example, we'll simulate total count based on if more users could exist.

    res.json({
      users: usersWithProfiles,
      total: authUsers.users.length === limit ? page * limit +1 : page * limit - (limit - authUsers.users.length), // This is an approximation
      page,
      limit
    });

  } catch (error: any) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});


// PUT /api/users/:userId/role - Update user role (Admin only)
router.put('/:userId/role', authMiddleware, checkRole('admin'), async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  if (!newRole || typeof newRole !== 'string') {
    return res.status(400).json({ error: 'Invalid newRole provided.' });
  }

  // Validate role if you have a predefined list of roles
  // const validRoles = ['user', 'moderator', 'admin'];
  // if (!validRoles.includes(newRole)) {
  //   return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
  // }

  try {
    // 1. Update app_metadata in auth.users
    const { data: updatedUser, error: updateAuthError } = await supabase.auth.admin.updateUserById(
      userId,
      { app_metadata: { user_role: newRole } }
    );
    if (updateAuthError) throw updateAuthError;

    // 2. Update the role in the 'profiles' table (or your user metadata table)
    // This step is crucial if you also store roles directly in your public tables for easier querying
    // and want to keep it in sync with auth.users app_metadata.
    const { data: updatedProfile, error: updateProfileError } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (updateProfileError) {
        // Potentially attempt to rollback or log the inconsistency
        console.warn(`User's role in auth.users updated to ${newRole}, but failed to update 'profiles' table for user ${userId}: ${updateProfileError.message}`);
        // Depending on your error handling strategy, you might want to inform the admin about this partial success.
        return res.status(500).json({ error: 'Failed to update role in profiles table after updating auth metadata.', details: updateProfileError.message, user: updatedUser });
    }

    res.json({ message: 'User role updated successfully.', user: updatedUser, profile: updatedProfile });
  } catch (error: any) {
    console.error('Error updating user role:', error.message);
    // Check if it's a Supabase specific error for more details
    if (error.code) { // Supabase errors often have a code
        return res.status(error.status || 500).json({ error: `Failed to update user role: ${error.message}`, code: error.code });
    }
    res.status(500).json({ error: 'Failed to update user role', details: error.message });
  }
});

export default router;
