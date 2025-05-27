import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Make sure you have VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  // You might want to throw an error here or handle this case more gracefully
  // depending on whether these are critical for app startup outside of specific features.
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
