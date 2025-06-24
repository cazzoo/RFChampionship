import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import type { Vehicle, VehicleCreationData, VehicleUpdateData } from '../types/vehicle.ts';

interface PaginatedVehicles {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminVehiclesReturn {
  vehicles: Vehicle[];
  totalVehicles: number;
  loading: boolean;
  error: Error | null;
  fetchVehicles: (page?: number, limit?: number) => Promise<void>;
  addVehicle: (vehicleData: VehicleCreationData) => Promise<Vehicle | null>;
  updateVehicle: (id: number, vehicleData: VehicleUpdateData) => Promise<Vehicle | null>;
  deleteVehicle: (id: number) => Promise<boolean>;
}

export const useAdminVehicles = (initialPage: number = 1, initialLimit: number = 10): UseAdminVehiclesReturn => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  const fetchVehicles = useCallback(async (page: number = currentPage, limit: number = currentLimit) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    try {
      const data = await apiClient.get<PaginatedVehicles>(`/api/vehicles?page=${page}&limit=${limit}`);
      setVehicles(data.vehicles || []);
      setTotalVehicles(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setVehicles([]);
      setTotalVehicles(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit]);

  useEffect(() => {
    fetchVehicles(initialPage, initialLimit);
  }, [fetchVehicles, initialPage, initialLimit]);

  const addVehicle = async (vehicleData: VehicleCreationData): Promise<Vehicle | null> => {
    setLoading(true);
    try {
      const newVehicle = await apiClient.post<Vehicle>('/api/vehicles', vehicleData);
      setError(null);
      await fetchVehicles(); // Refetch
      return newVehicle;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error("Failed to add vehicle:", err);
      setLoading(false);
      return null;
    }
  };

  const updateVehicle = async (id: number, vehicleData: VehicleUpdateData): Promise<Vehicle | null> => {
    setLoading(true);
    try {
      const updatedVehicle = await apiClient.put<Vehicle>(`/api/vehicles/${id}`, vehicleData);
      setError(null);
      await fetchVehicles(); // Refetch
      return updatedVehicle;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`Failed to update vehicle ${id}:`, err);
      setLoading(false);
      return null;
    }
  };

  const deleteVehicle = async (id: number): Promise<boolean> => {
    setLoading(true);
    try {
      await apiClient.delete(`/api/vehicles/${id}`);
      setError(null);
      await fetchVehicles(); // Refetch
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`Failed to delete vehicle ${id}:`, err);
      setLoading(false);
      return false;
    }
  };

  return { vehicles, totalVehicles, loading, error, fetchVehicles, addVehicle, updateVehicle, deleteVehicle };
};
