import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Ensure this path is correct relative to where the script is run

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Key is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    // It's generally recommended to set autoRefreshToken to false for server-side operations
    // as you'll typically be using the service_role key which doesn't expire or rely on refresh tokens.
    // However, if you plan to use this client for user-specific operations initiated by the backend
    // where you might pass a user's JWT, then consider your token refresh strategy.
    // For service_role key usage, this is less critical.
    autoRefreshToken: false,
    persistSession: false, // Do not persist sessions on the server
    // detectSessionInUrl: false // Useful if you are dealing with OAuth redirects on the server, but typically not for service client
  }
});
