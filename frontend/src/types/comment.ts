import { Profile } from './profile'; // Assuming Profile type exists

export interface Comment {
  id: number;
  user_id: string;
  content: string;
  entity_type: string; // e.g., 'championship', 'event', 'user_profile'
  entity_id_int?: number | null; // For entities with integer IDs
  entity_id_uuid?: string | null; // For entities with UUID IDs (like user_profile)
  parent_id?: number | null; // For threaded comments
  created_at: string; // ISO date string
  updated_at: string; // ISO date string

  // Joined data (optional, based on API response)
  user?: Partial<Profile>; // User who posted the comment
  replies?: Comment[]; // For nested comments, if fetched this way
  reply_count?: number; // Count of direct replies
}

// For creating a new comment
export interface CommentCreationData {
  content: string;
  entity_type: string;
  entity_id_int?: number | null;
  entity_id_uuid?: string | null;
  parent_id?: number | null;
  // user_id is set by the backend based on authenticated user
}

// For updating a comment (usually just content)
export interface CommentUpdateData {
  content: string;
}
