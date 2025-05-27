import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient'; // Your Supabase client
import { Profile } from '../types/profile'; // Assuming you have a Profile type

// Define the shape of the AuthContext
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null; // Your custom profile type
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>; // Add other fields as needed
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to fetch user profile from your backend
  const fetchUserProfile = async (userId: string, currentSession: Session | null) => {
    if (!currentSession) {
        setProfile(null);
        setIsAdmin(false);
        return;
    }
    try {
      // Use the access token from the session to authenticate the request
      const response = await fetch('/api/users/me', { // Ensure this matches your backend route
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 404) { // Profile might not exist yet for a new user
            console.warn('Profile not found for user:', userId);
            setProfile(null); // Or set a default/empty profile
            setIsAdmin(false);
            return;
        }
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }
      const userProfile: Profile = await response.json();
      setProfile(userProfile);
      // Check if user has admin role from the profile (ensure 'role' field exists in your profile type)
      // Or, if role is in user.app_metadata from Supabase directly:
      // setIsAdmin(user?.app_metadata?.user_role === 'admin');
      setIsAdmin(userProfile.role === 'admin');

    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const getInitialSession = async () => {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
            await fetchUserProfile(initialSession.user.id, initialSession);
        }
        setLoading(false);
    };
    
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setLoading(true);
      setSession(newSession);
      const currentUser = newSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.id, newSession);
      } else {
        setProfile(null); // Clear profile on logout
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    // Auth state change will trigger profile fetch
    // setLoading(false); // onAuthStateChange will handle loading
  };

  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    // Supabase handles user creation.
    // Your backend trigger `on_auth_user_created_set_custom_claims` should create the initial profile entry with role.
    // The `username` here might be used to update the profile *after* Supabase user creation.
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // data: { username: username } // You can pass additional metadata here if needed
        // This data is available in user.user_metadata, not app_metadata
        // For app_metadata (like roles), use backend functions/triggers.
      }
    });

    if (signUpError) {
      setLoading(false);
      throw signUpError;
    }
    
    // After successful Supabase sign-up, if auto-confirm is on, user is logged in.
    // onAuthStateChange will handle session and trigger profile fetch.
    // If profile doesn't exist yet (trigger might be slow or fail), fetchUserProfile might return 404.
    // We might need to explicitly update the profile with the username if it wasn't set via options.data or trigger.
    if (signUpData.user) {
        // Example: Update profile with username immediately after sign up if needed
        // This assumes the 'profiles' table allows user to update their own username.
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ username: username, updated_at: new Date().toISOString() })
            .eq('id', signUpData.user.id);

        if (updateError) {
            console.warn("Failed to update username immediately after sign up:", updateError.message);
            // Don't necessarily throw error here, as sign up itself was successful
        } else {
            // Re-fetch profile if username was updated separately
            // Or rely on onAuthStateChange to eventually get the updated profile
            // For simplicity, onAuthStateChange will handle it.
        }
    }
    // setLoading(false); // onAuthStateChange will handle loading
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLoading(false);
      throw error;
    }
    // onAuthStateChange will clear session, user, and profile
    // setLoading(false);
  };

  const value = {
    session,
    user,
    profile,
    login,
    register,
    logout,
    loading,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Define a basic Profile type (you should expand this based on your 'profiles' table)
// It's better to have this in a separate types file, e.g., src/types/profile.ts
// For now, defining it here for simplicity.
// export interface Profile {
//   id: string; // Typically UUID, matches user.id
//   username?: string;
//   avatar_url?: string;
//   website?: string;
//   role?: string; // e.g., 'user', 'admin'
//   // Add other profile fields as needed
// }
