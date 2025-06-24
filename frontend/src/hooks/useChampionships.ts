import { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient'; // Adjust path as necessary
import type { Championship } from '../types/championship.ts'; // Use .ts extension and type-only import

// Define the Championship type - consider moving to a types directory
// For now, defining it here if not already present.
// export interface Championship {
//   id: string;
//   name: string;
//   description?: string;
//   start_date?: string;
//   end_date?: string;
//   game_id?: string; // Or a Game object
//   rules?: string;
//   prize_pool?: string;
//   status?: 'upcoming' | 'ongoing' | 'completed';
//   created_by?: string; // User ID
//   created_at?: string;
//   updated_at?: string;
//   // Add any other relevant fields from your backend model
// }

interface UseChampionshipsReturn {
  championships: Championship[];
  loading: boolean;
  error: Error | null;
  refetch: () => void; // Allow manual refetching
}

export const useChampionships = (page: number = 1, limit: number = 10): UseChampionshipsReturn => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChampionships = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming your API returns an object like { championships: [], total: X, page: Y, limit: Z }
      const response = await apiClient.get<{ championships: Championship[], total: number }>(`/api/championships?page=${page}&limit=${limit}`);
      setChampionships(response.championships || []); // Ensure it's an array
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error occurred while fetching championships.'));
      }
      setChampionships([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChampionships();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]); // Refetch if page or limit changes

  return { championships, loading, error, refetch: fetchChampionships };
};

// Hook for a single championship
interface UseChampionshipReturn {
    championship: Championship | null;
    loading: boolean;
    error: Error | null;
    refetch: () => void;
}
export const useChampionship = (id: string | undefined): UseChampionshipReturn => {
    const [championship, setChampionship] = useState<Championship | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchChampionship = async () => {
        if (!id) {
            setLoading(false);
            // setError(new Error("Championship ID is required.")); // Or handle as you see fit
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await apiClient.get<Championship>(`/api/championships/${id}`);
            setChampionship(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err);
            } else {
                setError(new Error('Unknown error occurred while fetching championship.'));
            }
            setChampionship(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChampionship();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { championship, loading, error, refetch: fetchChampionship };
};
