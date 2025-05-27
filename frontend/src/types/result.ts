import { Event } from './event';
import { Profile } from './profile'; // Or a simpler User type
import { Team } from './team';
import { Vehicle } from './vehicle';

export interface Result {
  id: number;
  event_id: number;
  user_id: string; // Participant's user_id (UUID)
  position: number;
  points?: number | null;
  team_id?: number | null;
  vehicle_id?: number | null;
  lap_time_ms?: number | null; // Lap time in milliseconds
  notes?: string | null;
  submitted_by: string; // Admin user_id (UUID) who submitted the result
  created_at: string; // ISO date string
  updated_at: string; // ISO date string

  // Joined data (optional, based on API response)
  event?: Partial<Event>;
  user?: Partial<Profile>; // Participant's profile
  team?: Partial<Team>;
  vehicle?: Partial<Vehicle>;
}

export interface ResultCreationData {
  event_id: number;
  user_id: string; // Participant's user_id
  position: number;
  points?: number | null;
  team_id?: number | null;
  vehicle_id?: number | null;
  lap_time_ms?: number | null;
  notes?: string | null;
  // submitted_by will be set by the backend based on authenticated admin
}

export type ResultUpdateData = Partial<Omit<ResultCreationData, 'event_id' | 'user_id'>>; // Typically event_id and user_id are not changed for an existing result entry. If they are, this type needs adjustment.
