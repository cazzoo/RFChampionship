import React, { useState, useEffect } from 'react';
import { useAdminEvents } from '../../../hooks/useAdminEvents';
import type { Event, EventCreationData, EventUpdateData } from '../../../types/event';
import type { Championship } from '../../../types/championship';
import type { Track } from '../../../types/track';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';

interface EventFormProps {
  event?: Event | null;
  championships: Championship[];
  tracks: Track[];
  onSave: (data: EventCreationData | EventUpdateData) => Promise<void>;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, championships, tracks, onSave, onClose }) => {
  const [name, setName] = useState(event?.name || '');
  const [description, setDescription] = useState(event?.description || '');
  const [eventDate, setEventDate] = useState(event?.event_date ? new Date(event.event_date).toISOString().substring(0, 16) : '');
  const [championshipId, setChampionshipId] = useState(event?.championship_id?.toString() || '');
  const [trackId, setTrackId] = useState(event?.track_id?.toString() || '');
  const [location, setLocation] = useState(event?.location || '');
  const [status, setStatus] = useState(event?.status || 'upcoming');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim() || !championshipId || !eventDate) {
      setFormError("Event name, championship, and event date are required.");
      return;
    }
    const data: EventCreationData | EventUpdateData = {
      name: name.trim(),
      description: description?.trim() || null,
      event_date: new Date(eventDate).toISOString(),
      championship_id: parseInt(championshipId),
      track_id: trackId ? parseInt(trackId) : null,
      location: trackId ? null : location?.trim() || null,
      status: status as Event['status'],
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <label htmlFor="event-name">Event Name</label>
        <Input id="event-name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="event-desc">Description</label>
        <textarea id="event-desc" value={description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={3} />
      </div>
      <div>
        <label htmlFor="event-date">Event Date & Time</label>
        <Input id="event-date" type="datetime-local" value={eventDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDate(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="event-championship">Championship</label>
        <select id="event-championship" value={championshipId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChampionshipId(e.target.value)} required>
          <option value="">Select Championship</option>
          {championships.map(champ => <option key={champ.id} value={champ.id.toString()}>{champ.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="event-track">Track (Optional)</label>
        <select id="event-track" value={trackId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTrackId(e.target.value)}>
          <option value="">No Specific Track (Use Location)</option>
          {tracks.map(track => <option key={track.id} value={track.id.toString()}>{track.name}</option>)}
        </select>
      </div>
      {!trackId && (
        <div>
          <label htmlFor="event-location">Custom Location (if no track selected)</label>
          <Input id="event-location" value={location || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
        </div>
      )}
      <div>
        <label htmlFor="event-status">Status</label>
        <select id="event-status" value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <button type="button" onClick={onClose}>Cancel</button>
        <Button type="submit">Save Event</Button>
      </div>
    </form>
  );
};

export default function AdminEventsListPage() {
  const { events, totalEvents, championships, tracks, loading, error, fetchEvents, addEvent, updateEvent, deleteEvent, fetchRelatedDataForForm } = useAdminEvents();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterChampionshipId, setFilterChampionshipId] = useState<string>('');

  useEffect(() => {
    fetchEvents(currentPage, itemsPerPage, filterChampionshipId || null);
  }, [currentPage, filterChampionshipId, fetchEvents]);

  useEffect(() => {
    if (isFormOpen) {
      fetchRelatedDataForForm();
    }
  }, [isFormOpen, fetchRelatedDataForForm]);

  const handleAdd = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
    }
  };

  const handleSave = async (data: EventCreationData | EventUpdateData) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data as EventUpdateData);
    } else {
      await addEvent(data as EventCreationData);
    }
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Events</h1>
        <button onClick={handleAdd}>Add Event</button>
        {isFormOpen && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              </DialogHeader>
              <EventForm
                event={editingEvent}
                championships={championships}
                tracks={tracks}
                onSave={handleSave}
                onClose={() => { setIsFormOpen(false); setEditingEvent(null); }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="filter-event-championship">Filter by Championship:</label>
        <select id="filter-event-championship" value={filterChampionshipId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterChampionshipId(e.target.value)}>
          <option value="">All Championships</option>
          {championships.map(champ => (
            <option key={champ.id} value={champ.id.toString()}>{champ.name}</option>
          ))}
        </select>
      </div>
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Championship</TableHead>
                <TableHead>Track/Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((evt) => (
                <TableRow key={evt.id}>
                  <TableCell>{evt.name}</TableCell>
                  <TableCell>{evt.championship_id}</TableCell>
                  <TableCell>{evt.location || 'N/A'}</TableCell>
                  <TableCell>{new Date(evt.event_date).toLocaleString()}</TableCell>
                  <TableCell>{evt.status || 'N/A'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(evt)}>Edit</Button>
                    <Button onClick={() => handleDelete(evt.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalEvents === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
