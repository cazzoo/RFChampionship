// Based on backend/src/routes/eventRoutes.ts and potential DB schema
export interface Event {
  id: string; // Typically UUID
  name: string;
  description?: string | null;
  event_date: string; // ISO date string
  championship_id: string; // UUID, links to championships table
  location?: string | null;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | string; // Allow for other statuses
  created_by?: string; // User ID (UUID)
  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string

  // Optional: If you join championship details in the backend API response
  // championship?: { id: string; name: string; /* other championship fields */ };
}

// Type for creating events
export type EventCreationData = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'created_by'>;

// Type for updating events
export type EventUpdateData = Partial<EventCreationData>;
