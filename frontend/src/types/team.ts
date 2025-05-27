// Basic Team structure, expand as needed based on backend API for teams
export interface Team {
  id: number; // Assuming integer ID for teams as per backend (event_id_int for comments)
  name: string;
  owner_id: string; // UUID of the user who owns the team
  description?: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string

  // Optional: if you fetch members or other details
  // members?: Partial<Profile>[]; 
}

// For creating a team (if needed on frontend, usually backend handles this based on auth)
export type TeamCreationData = Omit<Team, 'id' | 'owner_id' | 'created_at' | 'updated_at'>;

// For updating a team (if needed)
export type TeamUpdateData = Partial<TeamCreationData>;
