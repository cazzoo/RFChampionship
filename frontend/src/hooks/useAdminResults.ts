import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { Result, ResultCreationData, ResultUpdateData } from '../types/result'; // Create this type
import { Event } from '../types/event';
import { Profile } from '../types/profile'; // Or a simpler User type
import { Team } from '../types/team';
import { Vehicle } from '../types/vehicle';

interface PaginatedResults {
  results: Result[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminResultsReturn {
  results: Result[];
  totalResults: number;
  loading: boolean;
  error: Error | null;
  fetchResults: (page?: number, limit?: number, filters?: { eventId?: string; championshipId?: string; userId?: string; teamId?: string; }) => Promise<void>;
  addResult: (resultData: ResultCreationData) => Promise<Result | null>;
  updateResult: (id: number, resultData: ResultUpdateData) => Promise<Result | null>;
  deleteResult: (id: number) => Promise<boolean>;
  // For form dropdowns
  allEvents: Event[];
  allUsers: Profile[]; // Or a simpler User type for selection
  allTeams: Team[];
  allVehicles: Vehicle[];
  fetchRelatedDataForForm: () => Promise<void>;
}

export const useAdminResults = (initialPage: number = 1, initialLimit: number = 10): UseAdminResultsReturn => {
  const [results, setResults] = useState<Result[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [currentFilters, setCurrentFilters] = useState<{ eventId?: string; championshipId?: string; userId?: string; teamId?: string; }>({});

  // Data for filter/form dropdowns
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);


  const fetchResults = useCallback(async (
    page: number = currentPage, 
    limit: number = currentLimit, 
    filters: { eventId?: string; championshipId?: string; userId?: string; teamId?: string; } = currentFilters
  ) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentFilters(filters);

    let url = `/api/results?page=${page}&limit=${limit}`;
    if (filters.eventId) url += `&event_id=${filters.eventId}`;
    if (filters.championshipId) url += `&championship_id=${filters.championshipId}`; // Backend needs to support this
    if (filters.userId) url += `&user_id=${filters.userId}`;
    if (filters.teamId) url += `&team_id=${filters.teamId}`;
    
    try {
      const data = await apiClient.get<PaginatedResults>(url);
      setResults(data.results || []);
      setTotalResults(data.total || 0);
    } catch (err: any) {
      setError(err);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, currentFilters]);

  const fetchRelatedDataForForm = useCallback(async () => {
    setLoading(true);
    try {
      const eventPromise = apiClient.get<{events: Event[]}>('/api/events?limit=1000');
      const userPromise = apiClient.get<{users: Profile[]}>('/api/users?limit=1000'); // Admin endpoint to get all users
      const teamPromise = apiClient.get<{teams: Team[]}>('/api/teams?limit=1000');
      const vehiclePromise = apiClient.get<{vehicles: Vehicle[]}>('/api/vehicles?limit=1000');
      
      const [eventRes, userRes, teamRes, vehicleRes] = await Promise.all([
        eventPromise, userPromise, teamPromise, vehiclePromise
      ]);
      
      setAllEvents(eventRes.events || []);
      setAllUsers(userRes.users || []); // Ensure your /api/users returns this structure for admins
      setAllTeams(teamRes.teams || []);
      setAllVehicles(vehicleRes.vehicles || []);
      setError(null);
    } catch (err: any) {
        console.error("Failed to fetch related data for result form:", err);
        setError(err);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(initialPage, initialLimit, {});
    // fetchRelatedDataForForm(); // Call when form is about to open or if needed globally for filters
  }, [fetchResults, initialPage, initialLimit]);

  const addResult = async (resultData: ResultCreationData): Promise<Result | null> => {
    setLoading(true);
    try {
      const newResult = await apiClient.post<Result>('/api/results', resultData);
      setError(null);
      await fetchResults(); // Refetch
      return newResult;
    } catch (err: any) {
      setError(err);
      console.error("Failed to add result:", err);
      setLoading(false);
      return null;
    }
  };

  const updateResult = async (id: number, resultData: ResultUpdateData): Promise<Result | null> => {
    setLoading(true);
    try {
      const updatedResult = await apiClient.put<Result>(`/api/results/${id}`, resultData);
      setError(null);
      await fetchResults(); // Refetch
      return updatedResult;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to update result ${id}:`, err);
      setLoading(false);
      return null;
    }
  };

  const deleteResult = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/results/${id}`);
      setError(null);
      await fetchResults(); // Refetch
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to delete result ${id}:`, err);
      setLoading(false);
      return false;
    }
  };

  return { 
    results, 
    totalResults, 
    loading, 
    error, 
    fetchResults, 
    addResult, 
    updateResult, 
    deleteResult,
    allEvents,
    allUsers,
    allTeams,
    allVehicles,
    fetchRelatedDataForForm
  };
};
