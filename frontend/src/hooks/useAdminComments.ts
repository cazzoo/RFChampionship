import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { Comment } from '../types/comment'; // Ensure this type is defined

interface PaginatedAdminComments {
  comments: Comment[]; // Backend should populate user details
  total: number;
  page: number;
  limit: number;
}

interface UseAdminCommentsReturn {
  comments: Comment[];
  totalComments: number;
  loading: boolean;
  error: Error | null;
  fetchComments: (page?: number, limit?: number, filters?: { 
    userId?: string; 
    entityType?: string; 
    // entityIdInt?: number; // Less common for admin global view unless drilling down
    // entityIdUuid?: string; 
  }) => Promise<void>;
  deleteCommentAsAdmin: (commentId: number) => Promise<boolean>;
  // updateCommentAsAdmin: (commentId: number, content: string) => Promise<Comment | null>; // Optional
}

export const useAdminComments = (initialPage: number = 1, initialLimit: number = 10): UseAdminCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [currentFilters, setCurrentFilters] = useState<{ 
    userId?: string; 
    entityType?: string; 
  }>({});

  const fetchComments = useCallback(async (
    page: number = currentPage, 
    limit: number = currentLimit, 
    filters: { 
        userId?: string; 
        entityType?: string; 
    } = currentFilters
  ) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentFilters(filters);

    // Admin typically gets all comments, then filters.
    // The GET /api/comments endpoint needs to support admin access (no user_id filter unless specified)
    // and allow filtering by user_id, entity_type, etc.
    let url = `/api/comments?page=${page}&limit=${limit}&adminView=true`; // Assuming adminView query param for backend
    if (filters.userId) url += `&user_id=${filters.userId}`;
    if (filters.entityType) url += `&entity_type=${filters.entityType}`;
    // Add entityIdInt/Uuid filters if you want to drill down in admin view
    
    try {
      const data = await apiClient.get<PaginatedAdminComments>(url);
      setComments(data.comments || []);
      setTotalComments(data.total || 0);
    } catch (err: any) {
      setError(err);
      setComments([]);
      setTotalComments(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, currentFilters]);

  useEffect(() => {
    fetchComments(initialPage, initialLimit, {}); // Initial fetch with no filters
  }, [fetchComments, initialPage, initialLimit]);

  const deleteCommentAsAdmin = async (commentId: number): Promise<boolean> => {
    setLoading(true); // Or a specific deleting state
    try {
      // Admin delete uses the same endpoint, backend RBAC handles permissions
      await apiClient.delete(`/api/comments/${commentId}`);
      setError(null);
      // Refetch or remove locally
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      setTotalComments(prevTotal => prevTotal > 0 ? prevTotal -1 : 0);
      // await fetchComments(currentPage, currentLimit, currentFilters); // Could refetch too
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Admin failed to delete comment ${commentId}:`, err);
      setLoading(false);
      return false;
    }
  };

  // Optional: Admin can edit any comment's content
  // const updateCommentAsAdmin = async (commentId: number, content: string): Promise<Comment | null> => { ... }


  return { 
    comments, 
    totalComments, 
    loading, 
    error, 
    fetchComments, 
    deleteCommentAsAdmin,
    // updateCommentAsAdmin 
  };
};
