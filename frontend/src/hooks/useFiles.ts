import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import type { FileMetadata } from '../types/file'; // Create this type

interface PaginatedFiles {
  files: FileMetadata[];
  total: number;
  page: number;
  limit: number;
}

interface UseFilesReturn {
  files: FileMetadata[];
  totalFiles: number;
  loading: boolean;
  error: Error | null;
  fetchFiles: (page?: number, limit?: number) => Promise<void>;
}

// Fetches files for a specific entity or by other criteria
export const useFiles = (
  entityType?: string,
  entityId?: number | string, // number for int IDs, string for UUIDs
  bucketName?: string,
  uploaderUserId?: string,
  initialPage: number = 1,
  initialLimit: number = 20 // Default to more images for a gallery
): UseFilesReturn => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);

  const fetchFiles = useCallback(async (page: number = currentPage, limit: number = currentLimit) => {
    if (!entityType && !uploaderUserId && !bucketName) { // At least one filter usually needed unless fetching ALL files (admin)
        // For public galleries, entityType and entityId are key.
        // For a user's own files page, uploaderUserId would be key.
        // console.warn("useFiles: Fetching without specific filters. Ensure this is intended.");
        // setFiles([]); setTotalFiles(0); return; // Or allow if an admin context
    }

    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);

    let url = `/api/files?page=${page}&limit=${limit}`;
    if (entityType) url += `&entity_type=${entityType}`;
    if (entityId) {
        if (typeof entityId === 'number') url += `&entity_id_int=${entityId}`;
        else url += `&entity_id_uuid=${entityId}`;
    }
    if (bucketName) url += `&bucketName=${bucketName}`;
    if (uploaderUserId) url += `&uploader_user_id=${uploaderUserId}`;

    try {
      const data = await apiClient.get<PaginatedFiles>(url);
      setFiles(prevFiles => page === 1 ? (data.files || []) : [...prevFiles, ...(data.files || [])]);
      setTotalFiles(data.total || 0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Unknown error occurred while fetching files.'));
      }
      // Don't clear files on error if it's a subsequent page load error
      if (page === 1) {
        setFiles([]);
        setTotalFiles(0);
      }
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId, bucketName, uploaderUserId, currentPage, currentLimit]);

  // Initial fetch when key identifiers change
  useEffect(() => {
    // Reset page to 1 when key identifiers change to avoid fetching wrong page with new filters
    setCurrentPage(1);
    fetchFiles(1, currentLimit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId, bucketName, uploaderUserId, currentLimit]); // fetchFiles is memoized

  return {
    files,
    totalFiles,
    loading,
    error,
    fetchFiles
  };
};
