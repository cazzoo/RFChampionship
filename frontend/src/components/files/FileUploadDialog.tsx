import React, { useState, useCallback, ChangeEvent } from 'react';
import apiClient from '../../lib/apiClient'; // Adjust path
import { SignedUploadRequest, SignedUploadResponse, UploadCompleteRequest, FileMetadata } from '../../types/file'; // Adjust path
import { useAuth } from '../../contexts/AuthContext'; // To associate file with current user if needed

// Conceptual Shadcn UI imports
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress'; // Conceptual Shadcn Progress
// import { toast } from 'sonner';

// Fallbacks for conceptual UI
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialog: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogHeader: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogTitle: React.FC<any> = ({ children, ...props }) => <h2 {...props}>{children}</h2>;
const FallbackDialogDescription: React.FC<any> = ({ children, ...props }) => <p {...props}>{children}</p>;
const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialogFooter: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogClose: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackInput: React.FC<any> = (props) => <input {...props} />;
const FallbackLabel: React.FC<any> = ({ children, ...props }) => <label {...props}>{children}</label>;
const FallbackProgress: React.FC<any> = ({ value, ...props }) => <progress value={value} max="100" {...props} />;

const ActualButton = Button || FallbackButton;
const ActualDialog = Dialog || FallbackDialog;
const ActualDialogContent = DialogContent || FallbackDialogContent;
const ActualDialogHeader = DialogHeader || FallbackDialogHeader;
const ActualDialogTitle = DialogTitle || FallbackDialogTitle;
const ActualDialogDescription = DialogDescription || FallbackDialogDescription;
const ActualDialogTrigger = DialogTrigger || FallbackDialogTrigger;
const ActualDialogFooter = DialogFooter || FallbackDialogFooter;
const ActualDialogClose = DialogClose || FallbackDialogClose;
const ActualInput = Input || FallbackInput;
const ActualLabel = Label || FallbackLabel;
const ActualProgress = Progress || FallbackProgress; // Use fallback if Shadcn not present
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


interface FileUploadDialogProps {
  triggerButtonText?: string;
  dialogTitle?: string;
  dialogDescription?: string;
  bucketName: string; // e.g., 'avatars', 'gallery'
  allowedFileTypes?: string[]; // e.g., ['image/jpeg', 'image/png']
  maxFileSizeMB?: number;
  entityType?: string; // For associating the file with an entity
  entityIdInt?: number;
  entityIdUuid?: string;
  onUploadSuccess?: (file: FileMetadata) => void; // Callback with the completed file metadata
  // onOpenChange for controlling dialog externally if needed
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  triggerButtonText = "Upload File",
  dialogTitle = "Upload a new file",
  dialogDescription = "Select a file from your device to upload.",
  bucketName,
  allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'], // Default allowed types
  maxFileSizeMB = 5,
  entityType,
  entityIdInt,
  entityIdUuid,
  onUploadSuccess,
  open,
  onOpenChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  const { user } = useAuth(); // To set uploader_user_id if not passed via entity_id_uuid for user_profile

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null); // Clear previous error
      // Validate file type
      if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
        setError(`Invalid file type. Allowed: ${allowedFileTypes.join(', ')}`);
        setSelectedFile(null);
        return;
      }
      // Validate file size
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
        let success = xhr.status >= 200 && xhr.status < 300;
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

    } catch (err: any) {
      console.error("Upload process error:", err);
      setError(err.message || "An unexpected error occurred during upload.");
      if (fileRecordId) { // If metadata record was created but something else failed
        apiClient.post('/api/files/upload-complete', { fileRecordId, success: false, errorMessage: err.message });
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
    if (onOpenChange) onOpenChange(false);
    else setInternalOpen(false);
  };
  
  const currentOpenState = open !== undefined ? open : internalOpen;
  const setCurrentOpenState = onOpenChange || setInternalOpen;


  return (
    <ActualDialog open={currentOpenState} onOpenChange={(isOpen) => {
        setCurrentOpenState(isOpen);
        if (!isOpen) handleCloseDialog(); // Reset state when dialog is closed
    }}>
      <ActualDialogTrigger asChild>
        <ActualButton variant="outline">{triggerButtonText}</ActualButton>
      </ActualDialogTrigger>
      <ActualDialogContent className="sm:max-w-[480px] bg-white p-6 rounded-lg shadow-xl">
        <ActualDialogHeader>
          <ActualDialogTitle>{dialogTitle}</ActualDialogTitle>
          <ActualDialogDescription>{dialogDescription}</ActualDialogDescription>
        </ActualDialogHeader>
        <div className="grid gap-4 py-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</p>}
          <div className="grid grid-cols-4 items-center gap-4">
            <ActualLabel htmlFor="file-input" className="text-right col-span-1">File</ActualLabel>
            <ActualInput id="file-input" type="file" onChange={handleFileChange} className="col-span-3" disabled={isUploading} />
          </div>
          {selectedFile && !error && ( // Show preview/details only if no error related to selection
            <div className="text-xs text-gray-500 col-start-2 col-span-3">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <ActualLabel htmlFor="file-title" className="text-right col-span-1">Title</ActualLabel>
            <ActualInput 
              id="file-title" 
              value={fileTitle} 
              onChange={(e) => setFileTitle(e.target.value)} 
              placeholder="Optional title for the file"
              className="col-span-3" 
              disabled={isUploading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <ActualLabel htmlFor="file-description" className="text-right col-span-1">Description</ActualLabel>
            <ActualInput 
              id="file-description" 
              value={fileDescription} 
              onChange={(e) => setFileDescription(e.target.value)} 
              placeholder="Optional description"
              className="col-span-3" 
              disabled={isUploading}
            />
          </div>
          {isUploading && (
            <div className="col-span-4">
              <ActualProgress value={uploadProgress} className="w-full" />
              <p className="text-xs text-center mt-1">{uploadProgress}%</p>
            </div>
          )}
        </div>
        <ActualDialogFooter>
          <ActualDialogClose asChild>
            <ActualButton type="button" variant="outline" onClick={handleCloseDialog} disabled={isUploading}>Cancel</ActualButton>
          </ActualDialogClose>
          <ActualButton onClick={handleUpload} disabled={isUploading || !selectedFile}>
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
          </ActualButton>
        </ActualDialogFooter>
      </ActualDialogContent>
    </ActualDialog>
  );
};

export default FileUploadDialog;
