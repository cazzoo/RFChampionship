import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';
import { FileMetadata } from '../types/file'; // Ensure this type is defined

interface PaginatedAdminFiles {
  files: FileMetadata[];
  total: number;
  page: number;
  limit: number;
}

interface UseAdminFilesReturn {
  files: FileMetadata[];
  totalFiles: number;
  loading: boolean;
  error: Error | null;
  fetchFiles: (page?: number, limit?: number, filters?: { 
    uploaderUserId?: string; 
    bucketName?: string; 
    entityType?: string; 
    uploadStatus?: string;
  }) => Promise<void>;
  deleteFile: (fileId: string) => Promise<boolean>;
  updateFileMetadata: (fileId: string, metadata: { title?: string; description?: string; }) => Promise<FileMetadata | null>;
}

export const useAdminFiles = (initialPage: number = 1, initialLimit: number = 10): UseAdminFilesReturn => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentLimit, setCurrentLimit] = useState(initialLimit);
  const [currentFilters, setCurrentFilters] = useState<{ 
    uploaderUserId?: string; 
    bucketName?: string; 
    entityType?: string; 
    uploadStatus?: string;
  }>({});

  const fetchFiles = useCallback(async (
    page: number = currentPage, 
    limit: number = currentLimit, 
    filters: { 
        uploaderUserId?: string; 
        bucketName?: string; 
        entityType?: string; 
        uploadStatus?: string;
    } = currentFilters
  ) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setCurrentLimit(limit);
    setCurrentFilters(filters);

    let url = `/api/files?page=${page}&limit=${limit}`;
    if (filters.uploaderUserId) url += `&uploader_user_id=${filters.uploaderUserId}`;
    if (filters.bucketName) url += `&bucketName=${filters.bucketName}`;
    if (filters.entityType) url += `&entity_type=${filters.entityType}`;
    if (filters.uploadStatus) url += `&upload_status=${filters.uploadStatus}`; // Backend needs to support this filter
    
    try {
      const data = await apiClient.get<PaginatedAdminFiles>(url);
      setFiles(data.files || []);
      setTotalFiles(data.total || 0);
    } catch (err: any) {
      setError(err);
      setFiles([]);
      setTotalFiles(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentLimit, currentFilters]);

  useEffect(() => {
    fetchFiles(initialPage, initialLimit, {}); // Initial fetch with no filters
  }, [fetchFiles, initialPage, initialLimit]);

  const deleteFile = async (fileId: string): Promise<boolean> => {
    setLoading(true); // Or a specific deleting state
    try {
      await apiClient.delete(`/api/files/${fileId}`);
      setError(null);
      // Refetch or remove locally
      setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
      setTotalFiles(prevTotal => prevTotal > 0 ? prevTotal -1 : 0);
      // await fetchFiles(currentPage, currentLimit, currentFilters); // Could refetch too
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Failed to delete file ${fileId}:`, err);
      setLoading(false);
      return false;
    }
  };

  const updateFileMetadata = async (fileId: string, metadata: { title?: string; description?: string; }): Promise<FileMetadata | null> => {
    setLoading(true);
    try {
        const updatedFile = await apiClient.put<FileMetadata>(`/api/files/${fileId}/metadata`, metadata);
        setError(null);
        setFiles(prevFiles => prevFiles.map(f => f.id === fileId ? { ...f, ...updatedFile } : f));
        setLoading(false);
        return updatedFile;
    } catch (err: any) {
        setError(err);
        console.error(`Failed to update metadata for file ${fileId}:`, err);
        setLoading(false);
        return null;
    }
  };

  return { 
    files, 
    totalFiles, 
    loading, 
    error, 
    fetchFiles, 
    deleteFile,
    updateFileMetadata
  };
};
