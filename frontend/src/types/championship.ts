// Based on backend/src/routes/championshipRoutes.ts and potential DB schema
export interface Championship {
  id: string; // Typically UUID
  name: string;
  description?: string | null;
  start_date?: string | null; // ISO date string
  end_date?: string | null;   // ISO date string
  game_id?: string | null;    // Assuming it's a string ID for now, could be a Game object if populated
  rules?: string | null;
  prize_pool?: string | null;
  status?: 'upcoming' | 'ongoing' | 'completed' | string; // Allow for other statuses if any
  created_by?: string;      // User ID (UUID)
  created_at: string;       // ISO date string
  updated_at: string;       // ISO date string
  
  // Optional: If you join game details in the backend API response
  // game?: { id: string; name: string; /* other game fields */ };

  // Optional: If you include event count or a small list of upcoming events directly
  // events_count?: number;
  // upcoming_events?: Partial<Event>[]; // Assuming Event type is defined elsewhere
}

// You might also want a type for creating/updating championships if fields differ
export type ChampionshipCreationData = Omit<Championship, 'id' | 'created_at' | 'updated_at' | 'created_by'> & {
    // Any specific fields for creation, e.g., if game_id is mandatory
};

export type ChampionshipUpdateData = Partial<Omit<ChampionshipCreationData, 'game_id'>>; // Example: game_id might not be updatable or has specific logic
