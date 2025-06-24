import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import type { Result } from '../types/result.ts'; // Ensure this type is defined

interface PaginatedResults {
  results: Result[];
  total: number;
  page: number;
  limit: number;
}

interface UseResultsReturn {
  results: Result[];
  totalResults: number;
  loading: boolean;
  error: Error | null;
  fetchResults: (page?: number, limit?: number) => Promise<void>;
}

// This hook fetches results based on provided filters.
// Filters (eventId, championshipId, userId) are passed directly to fetchResults.
export const useResults = (
    initialPage: number = 1,
    initialLimit: number = 10,
    // Initial filters can be passed but are typically dynamic
    initialFilters: { eventId?: string; championshipId?: string; userId?: string; } = {}
): UseResultsReturn => {
  const [results, setResults] = useState<Result[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState<boolean>(false); // Set to false initially
  const [error, setError] = useState<Error | null>(null);

  // Store current pagination and filters to allow refetching with same parameters
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [currentFilters, setCurrentFilters] = useState(initialFilters);

  const fetchResults = useCallback(async (
    page: number = currentPage,
    limit: number = currentLimit,
    filters: { eventId?: string; championshipId?: string; userId?: string; } = currentFilters
  ) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentFilters(filters);

    let url = `/api/results?page=${page}&limit=${limit}`;
    if (filters.eventId) url += `&event_id=${filters.eventId}`;
    if (filters.championshipId) url += `&championship_id=${filters.championshipId}`;
    if (filters.userId) url += `&user_id=${filters.userId}`;

    try {
      const data = await apiClient.get<PaginatedResults>(url);
      setResults(data.results || []);
      setTotalResults(data.total || 0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error occurred while fetching results.'));
      }
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, currentFilters]); // Dependencies for useCallback

  // Initial fetch can be triggered by the component using the hook if filters are ready
  // Or, if initialFilters are provided and valid:
  // useEffect(() => {
  //   if (currentFilters.eventId || currentFilters.championshipId || currentFilters.userId) {
  //     fetchResults(initialPage, initialLimit, currentFilters);
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [fetchResults, initialPage, initialLimit, JSON.stringify(currentFilters)]);
  // Using JSON.stringify for object dependency is a common pattern but has nuances.

  return {
    results,
    totalResults,
    loading,
    error,
    fetchResults
  };
};
