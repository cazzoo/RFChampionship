import React, { useState, useEffect } from 'react';
import { useAdminTracks } from '../../../hooks/useAdminTracks';
import type { Track, TrackCreationData, TrackUpdateData } from '../../../types/track';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Track name is required.");
      return;
    }
    const lengthKmNum = lengthKm ? parseFloat(lengthKm) : undefined;
    if (lengthKm && (isNaN(lengthKmNum!) || lengthKmNum! <= 0)) {
      setFormError("Length (km) must be a positive number if provided.");
      return;
    }
    const data: TrackCreationData | TrackUpdateData = {
      name: name.trim(),
      location: location.trim() || undefined,
      length_km: lengthKmNum,
      layout_image_url: layoutImageUrl.trim() || undefined,
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <label htmlFor="track-name">Track Name</label>
        <Input id="track-name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="track-location">Location</label>
        <Input id="track-location" value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
      </div>
      <div>
        <label htmlFor="track-length">Length (km)</label>
        <Input id="track-length" type="number" step="0.001" value={lengthKm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLengthKm(e.target.value)} />
      </div>
      <div>
        <label htmlFor="track-layout-url">Layout Image URL</label>
        <Input id="track-layout-url" type="url" value={layoutImageUrl} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLayoutImageUrl(e.target.value)} />
      </div>
      <div>
        <button type="button" onClick={onClose}>Cancel</button>
        <Button type="submit">Save Track</Button>
      </div>
    </form>
  );
};

export default function AdminTracksListPage() {
  const { tracks, totalTracks, loading, error, fetchTracks, addTrack, updateTrack, deleteTrack } = useAdminTracks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tracksPerPage = 10;

  useEffect(() => {
    fetchTracks(currentPage, tracksPerPage);
  }, [currentPage, fetchTracks]);

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
      await deleteTrack(id);
    }
  };

  const handleSaveTrack = async (data: TrackCreationData | TrackUpdateData) => {
    if (editingTrack) {
      await updateTrack(editingTrack.id, data as TrackUpdateData);
    } else {
      await addTrack(data as TrackCreationData);
    }
    setIsFormOpen(false);
    setEditingTrack(null);
  };

  const totalPages = Math.ceil(totalTracks / tracksPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Tracks</h1>
        <button onClick={handleAddTrack}>Add New Track</button>
        {isFormOpen && (
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTrack ? 'Edit Track' : 'Add New Track'}</DialogTitle>
              </DialogHeader>
              <TrackForm
                track={editingTrack}
                onSave={handleSaveTrack}
                onClose={() => { setIsFormOpen(false); setEditingTrack(null); }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {loading && <p>Loading tracks...</p>}
      {error && <p className="text-red-500">Error loading tracks: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Length (km)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>{track.name}</TableCell>
                  <TableCell>{track.location || 'N/A'}</TableCell>
                  <TableCell>{track.length_km || 'N/A'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditTrack(track)}>Edit</Button>
                    <Button onClick={() => handleDeleteTrack(track.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalTracks === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
