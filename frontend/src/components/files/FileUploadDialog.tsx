import React, { useState, ChangeEvent } from 'react';
import apiClient from '../../lib/apiClient';
import type { SignedUploadRequest, SignedUploadResponse, UploadCompleteRequest, FileMetadata } from '../../types/file.ts';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
// import { toast } from 'sonner';

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };

interface FileUploadDialogProps {
  triggerButtonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  bucketName: string;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
  entityType?: string;
  entityIdInt?: number;
  entityIdUuid?: string;
  onUploadSuccess?: (file: FileMetadata) => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  triggerButtonText = "Upload File",
  dialogTitle = "Upload a new file",
  dialogDescription = "Select a file from your device to upload.",
  bucketName,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  maxFileSizeMB = 5,
  entityType,
  entityIdInt,
  entityIdUuid,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
        setError(`Invalid file type. Allowed: ${allowedFileTypes.join(', ')}`);
        setSelectedFile(null);
        return;
      }
      const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError(`File too large. Max size: ${maxFileSizeMB}MB.`);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      if (!fileTitle) setFileTitle(file.name); // Pre-fill title with file name
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    if (!user) {
        setError("You must be logged in to upload files.");
        return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const uploadRequestData: SignedUploadRequest = {
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: selectedFile.size,
      bucketName,
      title: fileTitle || selectedFile.name,
      description: fileDescription || undefined,
      entity_type: entityType,
      entity_id_int: entityIdInt,
      // If uploading an avatar, entity_id_uuid should be the user's ID.
      entity_id_uuid: entityType === 'user_profile' ? (entityIdUuid || user.id) : entityIdUuid,
    };

    let fileRecordId: string | null = null;

    try {
      // 1. Get signed URL and create file record
      const signedUrlResponse = await apiClient.post<SignedUploadResponse>('/api/files/signed-upload-url', uploadRequestData);
      fileRecordId = signedUrlResponse.fileRecordId;

      // 2. Upload file to Supabase Storage using the signed URL
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedUrlResponse.signedUrl, true);
      xhr.setRequestHeader('Content-Type', selectedFile.type); // Important for Supabase storage if not using default 'application/octet-stream'

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        const success = xhr.status >= 200 && xhr.status < 300;
        let uploadErrorMessage: string | undefined;
        if (!success) {
            console.error('Upload failed:', xhr.responseText);
            uploadErrorMessage = `Storage upload failed with status ${xhr.status}.`;
            setError(uploadErrorMessage);
        }

        // 3. Notify backend of upload completion
        const completeRequest: UploadCompleteRequest = { fileRecordId: fileRecordId!, success, errorMessage: uploadErrorMessage };
        const completeResponse = await apiClient.post<{ message: string, fileRecord: FileMetadata }>('/api/files/upload-complete', completeRequest);

        if (success) {
          toast.success(completeResponse.message || "File uploaded successfully!");
          if (onUploadSuccess && completeResponse.fileRecord) {
            onUploadSuccess(completeResponse.fileRecord);
          }
          handleCloseDialog();
        } else {
          // Error already set from xhr.onload or backend might provide more details
          toast.error(completeResponse.message || uploadErrorMessage || "Failed to finalize upload.");
        }
      };

      xhr.onerror = () => {
        setError("Network error during upload.");
        if (fileRecordId) {
          apiClient.post('/api/files/upload-complete', { fileRecordId, success: false, errorMessage: "Network error" });
        }
      };

      xhr.send(selectedFile);

    } catch (err: unknown) {
      let message = 'An unexpected error occurred during upload.';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        message = (err as { message: string }).message;
      }
      console.error("Upload process error:", err);
      setError(message);
      if (fileRecordId) { // If metadata record was created but something else failed
        apiClient.post('/api/files/upload-complete', { fileRecordId, success: false, errorMessage: message });
      }
      setIsUploading(false);
      setUploadProgress(0);
    }
    // setIsUploading and setUploadProgress handled by XHR events or final catch
  };

  const handleCloseDialog = () => {
    setSelectedFile(null);
    setFileTitle('');
    setFileDescription('');
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button>{triggerButtonText}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</p>}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>File</Label>
            <Input type="file" onChange={handleFileChange} disabled={isUploading} />
          </div>
          {selectedFile && !error && (
            <div className="text-xs text-gray-500 col-start-2 col-span-3">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Title</Label>
            <Input
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              placeholder="Optional title for the file"
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>Description</Label>
            <Input
              value={fileDescription}
              onChange={(e) => setFileDescription(e.target.value)}
              placeholder="Optional description"
              disabled={isUploading}
            />
          </div>
          {isUploading && (
            <div>
              <Progress value={uploadProgress} />
              <p className="text-xs text-center mt-1">{uploadProgress}%</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button type="button" onClick={handleCloseDialog} disabled={isUploading}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
