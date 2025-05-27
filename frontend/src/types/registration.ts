import { Championship } from './championship';
import { Event } from './event';
import { Profile } from './profile';
import { Team } from './team';
import { Vehicle } from './vehicle';

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'waitlisted' | string;

export interface Registration {
  id: number;
  user_id: string;
  championship_id?: number | null;
  event_id?: number | null;
  team_id?: number | null;
  vehicle_id?: number | null;
  status: RegistrationStatus;
  registration_date: string; // ISO date string
  updated_at: string; // ISO date string

  // Joined data (optional, based on API response)
  user?: Partial<Profile>;
  championship?: Partial<Championship>;
  event?: Partial<Event>;
  team?: Partial<Team>;
  vehicle?: Partial<Vehicle>;
}

export interface RegistrationCreationData {
  championship_id?: number | null;
  event_id?: number | null;
  team_id?: number | null;
  vehicle_id?: number | null;
}

export interface RegistrationUpdateData {
  status?: RegistrationStatus;
  team_id?: number | null; // Example: Allow changing team for a pending registration
  vehicle_id?: number | null; // Example: Allow changing vehicle
}
