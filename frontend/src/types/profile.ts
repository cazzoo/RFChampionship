export interface Profile {
  id: string; // Typically UUID, matches user.id
  username?: string;
  avatar_url?: string;
  website?: string;
  role?: string; // e.g., 'user', 'admin'
  updated_at?: string; // Timestamps are good to have
  // Add other profile fields as per your 'profiles' table in Supabase
}
