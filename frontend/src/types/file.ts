// Based on backend/src/routes/fileRoutes.ts and potential DB schema
export interface FileMetadata {
  id: string; // UUID, primary key from 'files' table
  uploader_user_id: string; // UUID of the user who uploaded the file
  storage_bucket: string; // e.g., 'avatars', 'gallery'
  storage_path: string; // Full path within the bucket, e.g., 'avatars/user_id/image.png'
  file_name: string; // Original or sanitized file name
  mime_type: string;
  size_bytes: number;
  title?: string | null;
  description?: string | null;
  upload_status: 'pending' | 'completed' | 'failed' | string;
  
  // Optional entity linking
  entity_type?: string | null;
  entity_id_int?: number | null;
  entity_id_uuid?: string | null;

  created_at: string; // ISO date string
  updated_at: string; // ISO date string

  // Added by frontend after fetching, not directly from DB 'files' table usually
  public_url?: string; 
}

// For creating a file metadata record (usually done by backend when getting signed URL)
export interface FileMetadataCreationData {
  uploader_user_id: string;
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  title?: string | null;
  description?: string | null;
  upload_status: 'pending' | 'completed' | 'failed';
  entity_type?: string | null;
  entity_id_int?: number | null;
  entity_id_uuid?: string | null;
}

// For updating file metadata (e.g., title, description by user/admin)
export interface FileMetadataUpdateData {
  title?: string | null;
  description?: string | null;
}

// For the /signed-upload-url request body
export interface SignedUploadRequest {
    fileName: string;
    fileType: string; // MIME type
    fileSize: number; // bytes
    bucketName: string;
    title?: string;
    description?: string;
    entity_type?: string;
    entity_id_int?: number;
    entity_id_uuid?: string;
}

// For the /signed-upload-url response body
export interface SignedUploadResponse {
    signedUrl: string;
    storagePath: string; // Or just path, depending on Supabase SDK version
    fileRecordId: string; // UUID of the file metadata record created
}

// For the /upload-complete request body
export interface UploadCompleteRequest {
    fileRecordId: string;
    success: boolean;
    errorMessage?: string;
}
