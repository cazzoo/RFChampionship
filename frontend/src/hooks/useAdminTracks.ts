import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { Track, TrackCreationData, TrackUpdateData } from '../types/track';

interface PaginatedTracks {
  tracks: Track[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminTracksReturn {
  tracks: Track[];
  totalTracks: number;
  loading: boolean;
  error: Error | null;
  fetchTracks: (page?: number, limit?: number) => Promise<void>;
  addTrack: (trackData: TrackCreationData) => Promise<Track | null>;
  updateTrack: (id: number, trackData: TrackUpdateData) => Promise<Track | null>;
  deleteTrack: (id: number) => Promise<boolean>;
}

// Note: This is a simplified hook. For a production app, consider SWR or React Query
// for caching, automatic refetching, optimistic updates, etc.
export const useAdminTracks = (initialPage: number = 1, initialLimit: number = 10): UseAdminTracksReturn => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  // Store page and limit for refetching with current pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);


  const fetchTracks = useCallback(async (page: number = currentPage, limit: number = currentLimit) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    try {
      const data = await apiClient.get<PaginatedTracks>(`/api/tracks?page=${page}&limit=${limit}`);
      setTracks(data.tracks || []);
      setTotalTracks(data.total || 0);
    } catch (err: any) {
      setError(err);
      setTracks([]);
      setTotalTracks(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit]); // Dependencies for useCallback

  useEffect(() => {
    fetchTracks(initialPage, initialLimit);
  }, [fetchTracks, initialPage, initialLimit]); // Initial fetch

  const addTrack = async (trackData: TrackCreationData): Promise<Track | null> => {
    setLoading(true);
    try {
      const newTrack = await apiClient.post<Track>('/api/tracks', trackData);
      setError(null);
      // Refetch or update list locally - for simplicity, refetching current page
      await fetchTracks(); 
      return newTrack;
    } catch (err: any) {
      setError(err);
      console.error("Failed to add track:", err);
      setLoading(false); // Ensure loading is false on error
      return null;
    }
    // setLoading(false); // This was missing, handled by finally in fetchTracks if called
  };

  const updateTrack = async (id: number, trackData: TrackUpdateData): Promise<Track | null> => {
    setLoading(true);
    try {
      const updatedTrack = await apiClient.put<Track>(`/api/tracks/${id}`, trackData);
      setError(null);
      // Refetch or update list locally
      await fetchTracks();
      return updatedTrack;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to update track ${id}:`, err);
      setLoading(false);
      return null;
    }
  };

  const deleteTrack = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/tracks/${id}`);
      setError(null);
      // Refetch or update list locally
      await fetchTracks(); // Refetch, could also filter out locally: setTracks(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to delete track ${id}:`, err);
      setLoading(false);
      return false;
    }
  };

  return { tracks, totalTracks, loading, error, fetchTracks, addTrack, updateTrack, deleteTrack };
};
