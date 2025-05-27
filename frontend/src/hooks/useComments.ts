import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { Comment, CommentCreationData } from '../types/comment'; // Create this type
import { useAuth } from '../contexts/AuthContext'; // To get current user for posting/deleting

interface PaginatedComments {
  comments: Comment[];
  total: number;
  page: number;
  limit: number;
}

interface UseCommentsReturn {
  comments: Comment[];
  totalComments: number;
  loading: boolean;
  error: Error | null;
  fetchComments: (page?: number, limit?: number, parentId?: number | null) => Promise<void>;
  postComment: (commentData: CommentCreationData) => Promise<Comment | null>;
  deleteComment: (commentId: number) => Promise<boolean>;
}

// entityType and entityId are passed when the hook is used, not during initialization.
export const useComments = (
    entityType: string, 
    entityId: number | string // number for int IDs, string for UUIDs
): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10); // Default limit
  const [currentParentId, setCurrentParentId] = useState<number | null | undefined>(null); // null for top-level, undefined to not filter by parent

  const { user } = useAuth(); // For checking ownership for delete

  const fetchComments = useCallback(async (page: number = currentPage, limit: number = currentLimit, parentId: number | null | undefined = currentParentId) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentParentId(parentId);

    let url = `/api/comments?entity_type=${entityType}`;
    if (typeof entityId === 'number') {
        url += `&entity_id_int=${entityId}`;
    } else {
        url += `&entity_id_uuid=${entityId}`;
    }
    url += `&page=${page}&limit=${limit}`;

    if (parentId !== undefined) { // if undefined, fetch all (including replies in a flat list if backend supports, or handle hierarchy client-side)
        if (parentId === null) { // Explicitly fetch top-level comments
            url += `&parent_id=null`; // Or however your API specifies top-level
        } else {
            url += `&parent_id=${parentId}`; // Fetch replies to a specific comment
        }
    }
    
    try {
      const data = await apiClient.get<PaginatedComments>(url);
      // If fetching replies, append them. If fetching top-level, replace.
      // This simplified hook currently replaces. For threaded views, you might need more complex state management.
      setComments(data.comments || []);
      setTotalComments(data.total || 0);
    } catch (err: any) {
      setError(err);
      setComments([]);
      setTotalComments(0);
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, currentPage, currentLimit, currentParentId]); // Dependencies for useCallback

  useEffect(() => {
    if (entityType && entityId) {
        // Initial fetch for top-level comments when entityType/Id changes
        fetchComments(1, currentLimit, null); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId]); // Removed fetchComments from here to avoid loop, it's called inside.

  const postComment = async (commentData: CommentCreationData): Promise<Comment | null> => {
    setLoading(true); // Or a specific posting state
    try {
      // Ensure entityType and entityId are correctly included from the hook's scope
      const dataToPost = { 
        ...commentData, 
        entity_type: entityType,
        ...(typeof entityId === 'number' ? { entity_id_int: entityId } : { entity_id_uuid: entityId })
      };

      const newComment = await apiClient.post<Comment>('/api/comments', dataToPost);
      setError(null);
      // Refetch comments for the current view (e.g., top-level or specific parent)
      await fetchComments(currentPage, currentLimit, currentParentId); 
      setLoading(false);
      return newComment;
    } catch (err: any) {
      setError(err);
      console.error("Failed to post comment:", err);
      setLoading(false);
      return null;
    }
  };

  const deleteComment = async (commentId: number): Promise<boolean> => {
    // Authorization check could be here or rely on backend
    // For frontend check: find comment, check if comment.user.id === user?.id
    const commentToDelete = comments.find(c => c.id === commentId);
    if (!user || (commentToDelete && commentToDelete.user_id !== user.id && user.app_metadata?.user_role !== 'admin')) {
        setError(new Error("You don't have permission to delete this comment."));
        return false;
    }

    setLoading(true); // Or a specific deleting state
    try {
      await apiClient.delete(`/api/comments/${commentId}`);
      setError(null);
      // Refetch comments for the current view
      await fetchComments(currentPage, currentLimit, currentParentId);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to delete comment ${commentId}:`, err);
      setLoading(false);
      return false;
    }
  };

  return { 
    comments, 
    totalComments, 
    loading, 
    error, 
    fetchComments, 
    postComment, 
    deleteComment 
  };
};
