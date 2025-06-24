import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import type { Profile } from '../types/profile.ts'; // Assuming Profile includes role and other user details

// The backend /api/users endpoint for admin returns Supabase Auth User object combined with profile
// Adjust this type based on the actual structure returned by your /api/users (admin)
export interface AdminUserView extends Profile { // Inherits from Profile
  id: string; // Auth user ID (UUID)
  email?: string;
  created_at?: string; // Auth user created_at
  last_sign_in_at?: string;
  // Profile fields like username, avatar_url, role are from the Profile type
  // Ensure 'role' is part of your Profile type or this extended type
}

interface PaginatedAdminUsers {
  users: AdminUserView[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminUsersReturn {
  users: AdminUserView[];
  totalUsers: number;
  loading: boolean;
  error: Error | null;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  updateUserRole: (userId: string, newRole: string) => Promise<AdminUserView | null>;
}

export const useAdminUsers = (initialPage: number = 1, initialLimit: number = 10): UseAdminUsersReturn => {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  const fetchUsers = useCallback(async (page: number = currentPage, limit: number = currentLimit) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    try {
      // Backend endpoint for admin to get users is /api/users
      const data = await apiClient.get<PaginatedAdminUsers>(`/api/users?page=${page}&limit=${limit}`);
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit]);

  useEffect(() => {
    fetchUsers(initialPage, initialLimit);
  }, [fetchUsers, initialPage, initialLimit]);

  const updateUserRole = async (userId: string, newRole: string): Promise<AdminUserView | null> => {
    setLoading(true); // Or a specific loading state for this action
    try {
      // Backend endpoint for admin to update user role is PUT /api/users/:userId/role
      const response = await apiClient.put<{ user: AdminUserView }>(`/api/users/${userId}/role`, { newRole });
      setError(null);
      // Update the user in the local state or refetch
      setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole, ...response.user } : u)); // Optimistic update
      // await fetchUsers(); // Or refetch the current page
      setLoading(false);
      return response.user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error(`Failed to update role for user ${userId}:`, err);
      setLoading(false);
      return null;
    }
  };

  return {
    users,
    totalUsers,
    loading,
    error,
    fetchUsers,
    updateUserRole
  };
};
