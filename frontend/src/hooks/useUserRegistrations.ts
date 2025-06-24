import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import type { Registration, RegistrationCreationData } from '../types/registration.ts';
import type { Team } from '../types/team.ts'; // For fetching user's teams
import type { Vehicle } from '../types/vehicle.ts'; // For fetching available vehicles

interface PaginatedRegistrations {
  registrations: Registration[];
  total: number;
  page: number;
  limit: number;
}

interface UseUserRegistrationsReturn {
  registrations: Registration[];
  totalRegistrations: number;
  loading: boolean;
  error: Error | null;
  userTeams: Team[]; // Teams the current user is part of
  availableVehicles: Vehicle[]; // All available vehicles
  fetchRegistrations: (page?: number, limit?: number) => Promise<void>;
  createRegistration: (data: RegistrationCreationData) => Promise<Registration | null>;
  cancelRegistration: (registrationId: number) => Promise<boolean>;
  fetchUserRelatedDataForRegistration: () => Promise<void>; // Fetches teams and vehicles
}

export const useUserRegistrations = (initialPage: number = 1, initialLimit: number = 10): UseUserRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Combined loading state for simplicity
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  const fetchRegistrations = useCallback(async (page: number = currentPage, limit: number = currentLimit) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    try {
      // The backend GET /api/registrations for non-admins automatically filters by current user
      const data = await apiClient.get<PaginatedRegistrations>(`/api/registrations?page=${page}&limit=${limit}`);
      setRegistrations(data.registrations || []);
      setTotalRegistrations(data.total || 0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error occurred while fetching registrations.'));
      }
      setRegistrations([]);
      setTotalRegistrations(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit]);

  const fetchUserRelatedDataForRegistration = useCallback(async () => {
    setLoading(true); // Consider separate loading states if preferred
    try {
        // Fetch user's teams (assuming an endpoint like /api/users/me/teams or /api/teams?member_id=me)
        // For simplicity, let's assume /api/teams?member_id=me (backend would need to implement this based on auth user)
        // OR if user's profile from AuthContext contains team memberships.
        // This is a placeholder, as /api/users/me/teams is not yet defined.
        // const teamsData = await apiClient.get<{ teams: Team[] }>('/api/users/me/teams');
        // setUserTeams(teamsData.teams || []);
        // For now, using a general teams list; user will have to know their team ID
        // Or, more realistically, a user's profile would contain their team affiliations.
        // Using a simplified approach: fetch all teams, user has to pick.
        const teamsData = await apiClient.get<{teams: Team[]}>('/api/teams?limit=100'); // Get some teams
        setUserTeams(teamsData.teams || []);


        // Fetch available vehicles
        const vehiclesData = await apiClient.get<{vehicles: Vehicle[]}>('/api/vehicles?limit=100'); // Get some vehicles
        setAvailableVehicles(vehiclesData.vehicles || []);
        setError(null);
    } catch (err: unknown) {
        console.error("Failed to fetch related data for registration:", err);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unknown error occurred while fetching related data.'));
        }
        setUserTeams([]);
        setAvailableVehicles([]);
    } finally {
        setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchRegistrations(initialPage, initialLimit);
    // fetchUserRelatedDataForRegistration(); // Call if data is needed immediately on hook load
                                          // Or call it on-demand when registration form is opened.
  }, [fetchRegistrations, initialPage, initialLimit]); // Removed fetchUserRelatedDataForRegistration from deps

  const createRegistration = async (data: RegistrationCreationData): Promise<Registration | null> => {
    setLoading(true);
    try {
      const newRegistration = await apiClient.post<Registration>('/api/registrations', data);
      setError(null);
      await fetchRegistrations(); // Refresh the list of registrations
      return newRegistration;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        console.error("Failed to create registration:", err);
      } else {
        setError(new Error('Unknown error occurred while creating registration.'));
        console.error("Failed to create registration: Unknown error");
      }
      setLoading(false);
      return null;
    }
  };

  const cancelRegistration = async (registrationId: number): Promise<boolean> => {
    setLoading(true);
    try {
      await apiClient.put<Registration>(`/api/registrations/${registrationId}/status`, { status: 'cancelled' });
      setError(null);
      // Update specific registration in list or refetch
      setRegistrations(prevRegs =>
        prevRegs.map(reg => reg.id === registrationId ? { ...reg, status: 'cancelled' } : reg)
      );
      // await fetchRegistrations(); // Or refetch the whole list
      setLoading(false);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
        console.error(`Failed to cancel registration ${registrationId}:`, err);
      } else {
        setError(new Error('Unknown error occurred while cancelling registration.'));
        console.error(`Failed to cancel registration ${registrationId}: Unknown error`);
      }
      setLoading(false);
      return false;
    }
  };

  return {
    registrations,
    totalRegistrations,
    loading,
    error,
    userTeams,
    availableVehicles,
    fetchRegistrations,
    createRegistration,
    cancelRegistration,
    fetchUserRelatedDataForRegistration
  };
};
