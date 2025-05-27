import React, { useState, useEffect } from 'react';
import { useAdminFiles } from '../../../hooks/useAdminFiles';
import { FileMetadata, FileMetadataUpdateData } from '../../../types/file';

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
// import { toast } from 'sonner';

// Fallback components
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackTable: React.FC<any> = ({ children, ...props }) => <table {...props}>{children}</table>;
const FallbackTableBody: React.FC<any> = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
const FallbackTableCell: React.FC<any> = ({ children, ...props }) => <td {...props}>{children}</td>;
const FallbackTableHead: React.FC<any> = ({ children, ...props }) => <th {...props}>{children}</th>;
const FallbackTableHeader: React.FC<any> = ({ children, ...props }) => <thead {...props}>{children}</thead>;
const FallbackTableRow: React.FC<any> = ({ children, ...props }) => <tr {...props}>{children}</tr>;
const FallbackDialog: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogHeader: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogTitle: React.FC<any> = ({ children, ...props }) => <h2 {...props}>{children}</h2>;
const FallbackDialogDescription: React.FC<any> = ({ children, ...props }) => <p {...props}>{children}</p>;
// const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialogFooter: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogClose: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackInput: React.FC<any> = (props) => <input {...props} />;
const FallbackTextarea: React.FC<any> = (props) => <textarea {...props} />;
const FallbackLabel: React.FC<any> = ({ children, ...props }) => <label {...props}>{children}</label>;
const FallbackSelect: React.FC<any> = ({ children, ...props }) => <select {...props}>{children}</select>;
const FallbackSelectContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackSelectItem: React.FC<any> = ({ children, ...props }) => <option {...props}>{children}</option>;
const FallbackSelectTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackSelectValue: React.FC<any> = (props) => <span {...props} />;


const ActualButton = Button || FallbackButton;
const ActualTable = Table || FallbackTable;
const ActualTableBody = TableBody || FallbackTableBody;
const ActualTableCell = TableCell || FallbackTableCell;
const ActualTableHead = TableHead || FallbackTableHead;
const ActualTableHeader = TableHeader || FallbackTableHeader;
const ActualTableRow = TableRow || FallbackTableRow;
const ActualDialog = Dialog || FallbackDialog;
const ActualDialogContent = DialogContent || FallbackDialogContent;
const ActualDialogHeader = DialogHeader || FallbackDialogHeader;
const ActualDialogTitle = DialogTitle || FallbackDialogTitle;
const ActualDialogDescription = DialogDescription || FallbackDialogDescription;
// const ActualDialogTrigger = DialogTrigger || FallbackDialogTrigger;
const ActualDialogFooter = DialogFooter || FallbackDialogFooter;
const ActualDialogClose = DialogClose || FallbackDialogClose;
const ActualInput = Input || FallbackInput;
const ActualTextarea = Textarea || FallbackTextarea;
const ActualLabel = Label || FallbackLabel;
const ActualSelect = Select || FallbackSelect;
const ActualSelectContent = SelectContent || FallbackSelectContent;
const ActualSelectItem = SelectItem || FallbackSelectItem;
const ActualSelectTrigger = SelectTrigger || FallbackSelectTrigger;
const ActualSelectValue = SelectValue || FallbackSelectValue;

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


interface FileMetadataFormProps {
  file: FileMetadata;
  onSave: (fileId: string, data: FileMetadataUpdateData) => Promise<void>;
  onClose: () => void;
}

const FileMetadataForm: React.FC<FileMetadataFormProps> = ({ file, onSave, onClose }) => {
  const [title, setTitle] = useState(file.title || '');
  const [description, setDescription] = useState(file.description || '');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(file.id, { title: title || null, description: description || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <ActualLabel htmlFor="file-meta-title">Title</ActualLabel>
        <ActualInput id="file-meta-title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="file-meta-desc">Description</ActualLabel>
        <ActualTextarea id="file-meta-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" />
      </div>
      <ActualDialogFooter>
        <ActualDialogClose asChild><ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton></ActualDialogClose>
        <ActualButton type="submit">Save Metadata</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};


const AdminFilesListPage: React.FC = () => {
  const { files, totalFiles, loading, error, fetchFiles, deleteFile, updateFileMetadata } = useAdminFiles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileMetadata | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [filterUploaderId, setFilterUploaderId] = useState('');
  const [filterBucketName, setFilterBucketName] = useState('');
  const [filterEntityType, setFilterEntityType] = useState('');
  const [filterUploadStatus, setFilterUploadStatus] = useState('');


  useEffect(() => {
    fetchFiles(currentPage, itemsPerPage, { 
        uploaderUserId: filterUploaderId || undefined,
        bucketName: filterBucketName || undefined,
        entityType: filterEntityType || undefined,
        uploadStatus: filterUploadStatus || undefined,
    });
  }, [currentPage, filterUploaderId, filterBucketName, filterEntityType, filterUploadStatus, fetchFiles]);

  const handleEditMetadata = (file: FileMetadata) => {
    setEditingFile(file);
    setIsFormOpen(true);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file (from storage and database)?')) {
      const success = await deleteFile(fileId);
      toast[success ? 'success' : 'error'](success ? 'File deleted!' : 'Failed to delete file.');
    }
  };

  const handleSaveMetadata = async (fileId: string, data: FileMetadataUpdateData) => {
    const result = await updateFileMetadata(fileId, data);
    if (result) {
      toast.success('File metadata updated!');
      setIsFormOpen(false);
      setEditingFile(null);
    } else {
      toast.error('Failed to update metadata.');
    }
  };
  
  const totalPages = Math.ceil(totalFiles / itemsPerPage);

  // TODO: Fetch distinct uploader IDs, bucket names, entity types for filter dropdowns if desired
  // For simplicity, using text inputs for filters or pre-defined select options

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-semibold mb-6">Manage Files</h1>

      {/* Filter Section - Simplified */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <div>
            <ActualLabel htmlFor="filter-uploader">Uploader ID</ActualLabel>
            <ActualInput id="filter-uploader" value={filterUploaderId} onChange={(e) => setFilterUploaderId(e.target.value)} placeholder="Enter User ID (UUID)" className="mt-1"/>
        </div>
        <div>
            <ActualLabel htmlFor="filter-bucket">Bucket Name</ActualLabel>
             <ActualSelect value={filterBucketName} onValueChange={setFilterBucketName}>
                <ActualSelectTrigger id="filter-bucket" className="w-full mt-1"><ActualSelectValue placeholder="All Buckets" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">All Buckets</ActualSelectItem>
                    <ActualSelectItem value="avatars">Avatars</ActualSelectItem>
                    <ActualSelectItem value="gallery">Gallery</ActualSelectItem>
                    <ActualSelectItem value="track_layouts">Track Layouts</ActualSelectItem>
                    <ActualSelectItem value="general_uploads">General Uploads</ActualSelectItem>
                </ActualSelectContent>
            </ActualSelect>
        </div>
         <div>
            <ActualLabel htmlFor="filter-status">Upload Status</ActualLabel>
             <ActualSelect value={filterUploadStatus} onValueChange={setFilterUploadStatus}>
                <ActualSelectTrigger id="filter-status" className="w-full mt-1"><ActualSelectValue placeholder="All Statuses" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">All Statuses</ActualSelectItem>
                    <ActualSelectItem value="pending">Pending</ActualSelectItem>
                    <ActualSelectItem value="completed">Completed</ActualSelectItem>
                    <ActualSelectItem value="failed">Failed</ActualSelectItem>
                </ActualSelectContent>
            </ActualSelect>
        </div>
        {/* Add EntityType filter if needed, similar to Bucket Name */}
      </div>


      {editingFile && (
        <ActualDialog open={isFormOpen} onOpenChange={(open) => { if(!open) setEditingFile(null); setIsFormOpen(open);}}>
            <ActualDialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>Edit File Metadata</ActualDialogTitle>
                    <ActualDialogDescription>Update title and description for: {editingFile.file_name}</ActualDialogDescription>
                </ActualDialogHeader>
                <FileMetadataForm 
                    file={editingFile} 
                    onSave={handleSaveMetadata} 
                    onClose={() => { setIsFormOpen(false); setEditingFile(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      )}

      {loading && <p>Loading files...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Preview</ActualTableHead>
                <ActualTableHead>File Name</ActualTableHead>
                <ActualTableHead>Bucket</ActualTableHead>
                <ActualTableHead>Status</ActualTableHead>
                <ActualTableHead>Uploader ID</ActualTableHead>
                <ActualTableHead>Size</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {files.map((file) => (
                <ActualTableRow key={file.id}>
                  <ActualTableCell>
                    {file.mime_type?.startsWith('image/') ? (
                        <img src={file.public_url || `https://via.placeholder.com/50?text=NoPreview`} alt={file.title || file.file_name} className="w-12 h-12 object-cover rounded"/>
                    ) : (
                        <span className="text-xs p-1 bg-gray-200 rounded">{file.mime_type?.split('/')[1] || 'File'}</span>
                    )}
                  </ActualTableCell>
                  <ActualTableCell className="font-medium break-all">{file.file_name}</ActualTableCell>
                  <ActualTableCell>{file.storage_bucket}</ActualTableCell>
                  <ActualTableCell className="capitalize">{file.upload_status}</ActualTableCell>
                  <ActualTableCell className="text-xs break-all">{file.uploader_user_id}</ActualTableCell>
                  <ActualTableCell>{(file.size_bytes / 1024).toFixed(1)} KB</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEditMetadata(file)} className="mr-2 text-xs">Edit Meta</ActualButton>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDeleteFile(file.id)} className="text-xs">Delete</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalFiles === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFilesListPage;
