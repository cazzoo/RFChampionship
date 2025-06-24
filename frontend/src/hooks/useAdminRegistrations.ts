import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import type { Registration, RegistrationStatus } from '../types/registration.ts';
import type { Championship } from '../types/championship.ts';
import type { Event } from '../types/event.ts';
import type { Profile } from '../types/profile.ts';


// Type for the paginated response from the backend
interface PaginatedAdminRegistrations {
  registrations: Registration[]; // Backend should populate user, championship, event details
  total: number;
  page: number;
  limit: number;
}

interface UseAdminRegistrationsReturn {
  registrations: Registration[];
  totalRegistrations: number;
  loading: boolean;
  error: Error | null;
  fetchRegistrations: (
    page?: number,
    limit?: number,
    filters?: {
      userId?: string;
      eventId?: string;
      championshipId?: string;
      status?: RegistrationStatus;
    }
  ) => Promise<void>;
  updateRegistrationStatus: (registrationId: number, status: RegistrationStatus) => Promise<Registration | null>;
  // For filter dropdowns
  allChampionships: Championship[];
  allEvents: Event[];
  allUsers: Profile[]; // Or a simpler User type if full profile not needed for filter
  fetchAllFilterData: () => Promise<void>;
}

export const useAdminRegistrations = (initialPage: number = 1, initialLimit: number = 10): UseAdminRegistrationsReturn => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [currentFilters, setCurrentFilters] = useState<{
    userId?: string;
    eventId?: string;
    championshipId?: string;
    status?: RegistrationStatus;
  }>({});

  // Data for filter dropdowns
  const [allChampionships, setAllChampionships] = useState<Championship[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]); // Assuming Profile contains user info


  const fetchRegistrations = useCallback(async (
    page: number = currentPage,
    limit: number = currentLimit,
    filters: {
      userId?: string;
      eventId?: string;
      championshipId?: string;
      status?: RegistrationStatus;
    } = currentFilters
  ) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentFilters(filters);

    let url = `/api/registrations?page=${page}&limit=${limit}`;
    if (filters.userId) url += `&user_id=${filters.userId}`;
    if (filters.eventId) url += `&event_id=${filters.eventId}`;
    if (filters.championshipId) url += `&championship_id=${filters.championshipId}`;
    if (filters.status) url += `&status=${filters.status}`;

    try {
      const data = await apiClient.get<PaginatedAdminRegistrations>(url);
      setRegistrations(data.registrations || []);
      setTotalRegistrations(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setRegistrations([]);
      setTotalRegistrations(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, currentFilters]);

  const fetchAllFilterData = useCallback(async () => {
    setLoading(true); // Or a separate loading state for this
    try {
      const champPromise = apiClient.get<{championships: Championship[]}>('/api/championships?limit=1000');
      const eventPromise = apiClient.get<{events: Event[]}>('/api/events?limit=1000');
      // Assuming /api/users returns a list of users (profiles) suitable for filtering.
      // This might need adjustment based on your actual /api/users structure for admins.
      const userPromise = apiClient.get<{users: Profile[]}>('/api/users?limit=1000');

      const [champResponse, eventResponse, userResponse] = await Promise.all([champPromise, eventPromise, userPromise]);

      setAllChampionships(champResponse.championships || []);
      setAllEvents(eventResponse.events || []);
      setAllUsers(userResponse.users || []); // Ensure this matches the actual response structure
      setError(null);
    } catch (err) {
      console.error("Failed to fetch filter data for registrations:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false); // Or the separate loading state
    }
  }, []);


  useEffect(() => {
    fetchRegistrations(initialPage, initialLimit, {});
    fetchAllFilterData(); // Fetch data for filters when hook mounts
  }, [fetchRegistrations, fetchAllFilterData, initialPage, initialLimit]); // Dependencies for initial fetch

  const updateRegistrationStatus = async (registrationId: number, status: RegistrationStatus): Promise<Registration | null> => {
    setLoading(true); // Or a specific loading state for this action
    try {
      const updatedRegistration = await apiClient.put<Registration>(`/api/registrations/${registrationId}/status`, { status });
      setError(null);
      // Update the registration in the local state or refetch
      setRegistrations(prevRegs =>
        prevRegs.map(reg => reg.id === registrationId ? { ...reg, status: updatedRegistration.status, updated_at: updatedRegistration.updated_at } : reg)
      );
      // await fetchRegistrations(); // Or refetch the current page
      setLoading(false);
      return updatedRegistration;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`Failed to update status for registration ${registrationId}:`, err);
      setLoading(false);
      return null;
    }
  };

  return {
    registrations,
    totalRegistrations,
    loading,
    error,
    fetchRegistrations,
    updateRegistrationStatus,
    allChampionships,
    allEvents,
    allUsers,
    fetchAllFilterData
  };
};
