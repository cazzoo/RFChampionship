// Based on backend/src/routes/trackRoutes.ts and potential DB schema
export interface Track {
  id: number; // Assuming integer ID from DB sequence
  name: string;
  location?: string | null;
  length_km?: number | null;
  layout_image_url?: string | null;
  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string
}

// Type for creating tracks
export type TrackCreationData = Omit<Track, 'id' | 'created_at' | 'updated_at'>;

// Type for updating tracks
export type TrackUpdateData = Partial<TrackCreationData>;
