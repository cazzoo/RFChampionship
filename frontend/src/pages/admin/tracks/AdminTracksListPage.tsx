import React, { useState, useEffect } from 'react';
import { useAdminTracks } from '../../../hooks/useAdminTracks';
import { Track, TrackCreationData, TrackUpdateData } from '../../../types/track';
import { Button } from '../../../components/ui/button'; // Shadcn UI (conceptual)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'; // Shadcn UI (conceptual)
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog'; // Shadcn UI (conceptual)
import { Input } from '../../../components/ui/input'; // Shadcn UI (conceptual)
import { Textarea } from '../../../components/ui/textarea'; // Shadcn UI (conceptual)
import { Label } from '../../../components/ui/label'; // Shadcn UI (conceptual)
// import { toast } from 'sonner'; // Shadcn UI / Sonner (conceptual for notifications)
// For DropdownMenu (conceptual)
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/dropdown-menu';
// import { MoreHorizontal } from 'lucide-react';


// Placeholder for Shadcn UI components if not actually available
// These are just to make the code runnable and demonstrate structure
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackTable: React.FC<any> = ({ children, ...props }) => <table {...props}>{children}</table>;
const FallbackTableBody: React.FC<any> = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
const FallbackTableCell: React.FC<any> = ({ children, ...props }) => <td {...props}>{children}</td>;
const FallbackTableHead: React.FC<any> = ({ children, ...props }) => <th {...props}>{children}</th>;
const FallbackTableHeader: React.FC<any> = ({ children, ...props }) => <thead {...props}>{children}</thead>;
const FallbackTableRow: React.FC<any> = ({ children, ...props }) => <tr {...props}>{children}</tr>;
const FallbackDialog: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>; // Simplified
const FallbackDialogContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogHeader: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogTitle: React.FC<any> = ({ children, ...props }) => <h2 {...props}>{children}</h2>;
const FallbackDialogDescription: React.FC<any> = ({ children, ...props }) => <p {...props}>{children}</p>;
const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialogFooter: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogClose: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackInput: React.FC<any> = (props) => <input {...props} />;
const FallbackTextarea: React.FC<any> = (props) => <textarea {...props} />;
const FallbackLabel: React.FC<any> = ({ children, ...props }) => <label {...props}>{children}</label>;

// Use Shadcn components if available, otherwise fallbacks
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
const ActualDialogTrigger = DialogTrigger || FallbackDialogTrigger;
const ActualDialogFooter = DialogFooter || FallbackDialogFooter;
const ActualDialogClose = DialogClose || FallbackDialogClose;
const ActualInput = Input || FallbackInput;
const ActualTextarea = Textarea || FallbackTextarea;
const ActualLabel = Label || FallbackLabel;

// Toast placeholder
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


interface TrackFormProps {
  track?: Track | null;
  onSave: (data: TrackCreationData | TrackUpdateData) => Promise<void>;
  onClose: () => void;
}

const TrackForm: React.FC<TrackFormProps> = ({ track, onSave, onClose }) => {
  const [name, setName] = useState(track?.name || '');
  const [location, setLocation] = useState(track?.location || '');
  const [lengthKm, setLengthKm] = useState<string>(track?.length_km?.toString() || '');
  const [layoutImageUrl, setLayoutImageUrl] = useState(track?.layout_image_url || '');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Track name is required.");
      return;
    }
    const lengthKmNum = lengthKm ? parseFloat(lengthKm) : null;
    if (lengthKm && (isNaN(lengthKmNum!) || lengthKmNum! <= 0)) {
        setFormError("Length (km) must be a positive number if provided.");
        return;
    }

    const data: TrackCreationData | TrackUpdateData = {
      name: name.trim(),
      location: location.trim() || null,
      length_km: lengthKmNum,
      layout_image_url: layoutImageUrl.trim() || null,
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <ActualLabel htmlFor="track-name">Track Name</ActualLabel>
        <ActualInput id="track-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Silverstone Circuit" required className="mt-1 block w-full border-gray-300 shadow-sm" />
      </div>
      <div>
        <ActualLabel htmlFor="track-location">Location</ActualLabel>
        <ActualInput id="track-location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Towcester, UK" className="mt-1 block w-full" />
      </div>
      <div>
        <ActualLabel htmlFor="track-length">Length (km)</ActualLabel>
        <ActualInput id="track-length" type="number" step="0.001" value={lengthKm} onChange={(e) => setLengthKm(e.target.value)} placeholder="e.g., 5.891" className="mt-1 block w-full" />
      </div>
      <div>
        <ActualLabel htmlFor="track-layout-url">Layout Image URL</ActualLabel>
        <ActualInput id="track-layout-url" type="url" value={layoutImageUrl} onChange={(e) => setLayoutImageUrl(e.target.value)} placeholder="e.g., https://example.com/layout.png" className="mt-1 block w-full" />
      </div>
      <ActualDialogFooter>
        <ActualDialogClose asChild>
            <ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton>
        </ActualDialogClose>
        <ActualButton type="submit">Save Track</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};


const AdminTracksListPage: React.FC = () => {
  const { tracks, totalTracks, loading, error, fetchTracks, addTrack, updateTrack, deleteTrack } = useAdminTracks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 10;

  useEffect(() => {
    fetchTracks(currentPage, tracksPerPage);
  }, [currentPage, fetchTracks]); // Removed tracksPerPage from dep array as it's constant here

  const handleAddTrack = () => {
    setEditingTrack(null);
    setIsFormOpen(true);
  };

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track);
    setIsFormOpen(true);
  };

  const handleDeleteTrack = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      const success = await deleteTrack(id);
      if (success) {
        toast.success('Track deleted successfully!');
        // The list should refetch via the hook's deleteTrack method
      } else {
        toast.error('Failed to delete track.');
      }
    }
  };

  const handleSaveTrack = async (data: TrackCreationData | TrackUpdateData) => {
    let success = false;
    if (editingTrack) {
      const result = await updateTrack(editingTrack.id, data as TrackUpdateData);
      if (result) success = true;
    } else {
      const result = await addTrack(data as TrackCreationData);
      if (result) success = true;
    }

    if (success) {
      toast.success(`Track ${editingTrack ? 'updated' : 'added'} successfully!`);
      setIsFormOpen(false);
      setEditingTrack(null);
    } else {
      toast.error(`Failed to ${editingTrack ? 'update' : 'add'} track.`);
      // Keep form open for correction if desired, or close. For now, it stays open.
    }
  };
  
  const totalPages = Math.ceil(totalTracks / tracksPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Tracks</h1>
        <ActualDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <ActualDialogTrigger asChild>
                <ActualButton onClick={handleAddTrack}>Add New Track</ActualButton>
            </ActualDialogTrigger>
            <ActualDialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-xl"> {/* Shadcn styling */}
                <ActualDialogHeader>
                    <ActualDialogTitle>{editingTrack ? 'Edit Track' : 'Add New Track'}</ActualDialogTitle>
                    <ActualDialogDescription>
                        {editingTrack ? 'Update the details of this track.' : 'Fill in the details for the new track.'}
                    </ActualDialogDescription>
                </ActualDialogHeader>
                <TrackForm 
                    track={editingTrack} 
                    onSave={handleSaveTrack} 
                    onClose={() => { setIsFormOpen(false); setEditingTrack(null); }} 
                />
            </ActualDialogContent>
        </ActualDialog>
      </div>

      {loading && <p>Loading tracks...</p>}
      {error && <p className="text-red-500">Error loading tracks: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Name</ActualTableHead>
                <ActualTableHead>Location</ActualTableHead>
                <ActualTableHead>Length (km)</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {tracks.map((track) => (
                <ActualTableRow key={track.id}>
                  <ActualTableCell className="font-medium">{track.name}</ActualTableCell>
                  <ActualTableCell>{track.location || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{track.length_km || 'N/A'}</ActualTableCell>
                  <ActualTableCell>
                    {/* Using simple buttons instead of DropdownMenu for simplicity with fallbacks */}
                     <ActualButton variant="outline" size="sm" onClick={() => handleEditTrack(track)} className="mr-2">Edit</ActualButton>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDeleteTrack(track.id)}>Delete</ActualButton>
                    {/* Conceptual DropdownMenu:
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditTrack(track)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTrack(track.id)} className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    */}
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </ActualButton>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <ActualButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalTracks === 0}
            >
              Next
            </ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminTracksListPage;
