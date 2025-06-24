import React, { useState, useEffect } from 'react';
import { useAdminFiles } from '../../../hooks/useAdminFiles';
import type { FileMetadata, FileMetadataUpdateData } from '../../../types/file';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';

interface FileMetadataFormProps {
  file: FileMetadata;
  onSave: (fileId: string, data: FileMetadataUpdateData) => Promise<void>;
  onClose: () => void;
}

const FileMetadataForm: React.FC<FileMetadataFormProps> = ({ file, onSave, onClose }) => {
  const [title, setTitle] = useState(file.title || '');
  const [description, setDescription] = useState(file.description || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave(file.id, { title: title || null, description: description || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file-meta-title">Title</label>
        <Input id="file-meta-title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
      </div>
      <div>
        <label htmlFor="file-meta-desc">Description</label>
        <textarea id="file-meta-desc" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={3} />
      </div>
      <div>
        <button type="button" onClick={onClose}>Cancel</button>
        <Button type="submit">Save Metadata</Button>
      </div>
    </form>
  );
};

export default function AdminFilesListPage() {
  const { files, totalFiles, loading, error, fetchFiles, deleteFile, updateFileMetadata } = useAdminFiles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileMetadata | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterUploaderId, setFilterUploaderId] = useState('');
  const [filterBucketName, setFilterBucketName] = useState('');
  const [filterUploadStatus, setFilterUploadStatus] = useState('');

  useEffect(() => {
    fetchFiles(currentPage, itemsPerPage, {
      uploaderUserId: filterUploaderId || undefined,
      bucketName: filterBucketName || undefined,
      uploadStatus: filterUploadStatus || undefined,
    });
  }, [currentPage, filterUploaderId, filterBucketName, filterUploadStatus, fetchFiles]);

  const handleEditMetadata = (file: FileMetadata) => {
    setEditingFile(file);
    setIsFormOpen(true);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file (from storage and database)?')) {
      await deleteFile(fileId);
    }
  };

  const handleSaveMetadata = async (fileId: string, data: FileMetadataUpdateData) => {
    await updateFileMetadata(fileId, {
      title: data.title || undefined,
      description: data.description || undefined,
    });
    setIsFormOpen(false);
    setEditingFile(null);
  };

  const totalPages = Math.ceil(totalFiles / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-semibold mb-6">Manage Files</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <div>
          <label htmlFor="filter-uploader">Uploader ID</label>
          <Input id="filter-uploader" value={filterUploaderId} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterUploaderId(e.target.value)} placeholder="Enter User ID (UUID)" />
        </div>
        <div>
          <label htmlFor="filter-bucket">Bucket Name</label>
          <select id="filter-bucket" value={filterBucketName} onChange={(e) => setFilterBucketName(e.target.value)}>
            <option value="">All Buckets</option>
            <option value="avatars">Avatars</option>
            <option value="gallery">Gallery</option>
            <option value="track_layouts">Track Layouts</option>
            <option value="general_uploads">General Uploads</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-status">Upload Status</label>
          <select id="filter-status" value={filterUploadStatus} onChange={(e) => setFilterUploadStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      {editingFile && isFormOpen && (
        <div>
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit File Metadata</DialogTitle>
              </DialogHeader>
              <FileMetadataForm
                file={editingFile}
                onSave={handleSaveMetadata}
                onClose={() => { setIsFormOpen(false); setEditingFile(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
      {loading && <p>Loading files...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Bucket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploader ID</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    {file.mime_type?.startsWith('image/') ? (
                      <img src={file.public_url || `https://via.placeholder.com/50?text=NoPreview`} alt={file.title || file.file_name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <span>{file.mime_type?.split('/')[1] || 'File'}</span>
                    )}
                  </TableCell>
                  <TableCell>{file.file_name}</TableCell>
                  <TableCell>{file.storage_bucket}</TableCell>
                  <TableCell>{file.upload_status}</TableCell>
                  <TableCell>{file.uploader_user_id}</TableCell>
                  <TableCell>{(file.size_bytes / 1024).toFixed(1)} KB</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditMetadata(file)}>Edit Meta</Button>
                    <Button onClick={() => handleDeleteFile(file.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalFiles === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
