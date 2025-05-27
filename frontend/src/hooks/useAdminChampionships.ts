import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { Championship, ChampionshipCreationData, ChampionshipUpdateData } from '../types/championship';

interface PaginatedChampionships {
  championships: Championship[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminChampionshipsReturn {
  championships: Championship[];
  totalChampionships: number;
  loading: boolean;
  error: Error | null;
  fetchChampionships: (page?: number, limit?: number) => Promise<void>;
  addChampionship: (championshipData: ChampionshipCreationData) => Promise<Championship | null>;
  updateChampionship: (id: string, championshipData: ChampionshipUpdateData) => Promise<Championship | null>; // ID is string (UUID)
  deleteChampionship: (id: string) => Promise<boolean>;
}

export const useAdminChampionships = (initialPage: number = 1, initialLimit: number = 10): UseAdminChampionshipsReturn => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [totalChampionships, setTotalChampionships] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  const fetchChampionships = useCallback(async (page: number = currentPage, limit: number = currentLimit) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    try {
      const data = await apiClient.get<PaginatedChampionships>(`/api/championships?page=${page}&limit=${limit}`);
      setChampionships(data.championships || []);
      setTotalChampionships(data.total || 0);
    } catch (err: any) {
      setError(err);
      setChampionships([]);
      setTotalChampionships(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit]);

  useEffect(() => {
    fetchChampionships(initialPage, initialLimit);
  }, [fetchChampionships, initialPage, initialLimit]);

  const addChampionship = async (championshipData: ChampionshipCreationData): Promise<Championship | null> => {
    setLoading(true);
    try {
      const newChampionship = await apiClient.post<Championship>('/api/championships', championshipData);
      setError(null);
      await fetchChampionships(); // Refetch
      return newChampionship;
    } catch (err: any) {
      setError(err);
      console.error("Failed to add championship:", err);
      setLoading(false);
      return null;
    }
  };

  const updateChampionship = async (id: string, championshipData: ChampionshipUpdateData): Promise<Championship | null> => {
    setLoading(true);
    try {
      const updatedChampionship = await apiClient.put<Championship>(`/api/championships/${id}`, championshipData);
      setError(null);
      await fetchChampionships(); // Refetch
      return updatedChampionship;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to update championship ${id}:`, err);
      setLoading(false);
      return null;
    }
  };

  const deleteChampionship = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/championships/${id}`);
      setError(null);
      await fetchChampionships(); // Refetch
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to delete championship ${id}:`, err);
      setLoading(false);
      return false;
    }
  };

  return { 
    championships, 
    totalChampionships, 
    loading, 
    error, 
    fetchChampionships, 
    addChampionship, 
    updateChampionship, 
    deleteChampionship 
  };
};
