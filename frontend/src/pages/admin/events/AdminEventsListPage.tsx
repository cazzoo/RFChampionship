import React, { useState, useEffect } from 'react';
import { useAdminEvents } from '../../../hooks/useAdminEvents';
import { Event, EventCreationData, EventUpdateData } from '../../../types/event';
import { Championship } from '../../../types/championship';
import { Track } from '../../../types/track';

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
// import { toast } from 'sonner';

// Fallback components for conceptual UI
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
const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
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
const ActualDialogTrigger = DialogTrigger || FallbackDialogTrigger;
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
  const [eventDate, setEventDate] = useState(event?.event_date ? new Date(event.event_date).toISOString().substring(0, 16) : ''); // For datetime-local
  const [championshipId, setChampionshipId] = useState(event?.championship_id?.toString() || '');
  const [trackId, setTrackId] = useState(event?.track_id?.toString() || ''); // Assuming track_id is part of Event type
  const [location, setLocation] = useState(event?.location || ''); // If not using track_id or for custom locations
  const [status, setStatus] = useState(event?.status || 'upcoming');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
      location: trackId ? null : location?.trim() || null, // Location only if no track
      status: status as Event['status'],
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <ActualLabel htmlFor="event-name">Event Name</ActualLabel>
        <ActualInput id="event-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="event-desc">Description</ActualLabel>
        <ActualTextarea id="event-desc" value={description || ''} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="event-date">Event Date & Time</ActualLabel>
        <ActualInput id="event-date" type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="event-championship">Championship</ActualLabel>
        <ActualSelect value={championshipId} onValueChange={setChampionshipId} required>
            <ActualSelectTrigger id="event-championship" className="w-full mt-1"><ActualSelectValue placeholder="Select Championship" /></ActualSelectTrigger>
            <ActualSelectContent>
                {championships.map(champ => <ActualSelectItem key={champ.id} value={champ.id.toString()}>{champ.name}</ActualSelectItem>)}
            </ActualSelectContent>
        </ActualSelect>
      </div>
       <div>
        <ActualLabel htmlFor="event-track">Track (Optional)</ActualLabel>
        <ActualSelect value={trackId} onValueChange={setTrackId}>
            <ActualSelectTrigger id="event-track" className="w-full mt-1"><ActualSelectValue placeholder="Select Track (if applicable)" /></ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="">No Specific Track (Use Location)</ActualSelectItem>
                {tracks.map(track => <ActualSelectItem key={track.id} value={track.id.toString()}>{track.name}</ActualSelectItem>)}
            </ActualSelectContent>
        </ActualSelect>
      </div>
       {!trackId && ( // Only show custom location if no track is selected
        <div>
            <ActualLabel htmlFor="event-location">Custom Location (if no track selected)</ActualLabel>
            <ActualInput id="event-location" value={location || ''} onChange={(e) => setLocation(e.target.value)} className="mt-1" />
        </div>
       )}
      <div>
        <ActualLabel htmlFor="event-status">Status</ActualLabel>
        <ActualSelect value={status} onValueChange={setStatus}>
            <ActualSelectTrigger id="event-status" className="w-full mt-1"><ActualSelectValue placeholder="Select Status" /></ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="upcoming">Upcoming</ActualSelectItem>
                <ActualSelectItem value="ongoing">Ongoing</ActualSelectItem>
                <ActualSelectItem value="completed">Completed</ActualSelectItem>
                <ActualSelectItem value="cancelled">Cancelled</ActualSelectItem>
            </ActualSelectContent>
        </ActualSelect>
      </div>
      <ActualDialogFooter>
         <ActualDialogClose asChild><ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton></ActualDialogClose>
        <ActualButton type="submit">Save Event</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};


const AdminEventsListPage: React.FC = () => {
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
    if(isFormOpen) { // Fetch related data only when form is about to open
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
      const success = await deleteEvent(id);
      toast[success ? 'success' : 'error'](success ? 'Event deleted!' : 'Failed to delete event.');
    }
  };

  const handleSave = async (data: EventCreationData | EventUpdateData) => {
    const result = editingEvent
      ? await updateEvent(editingEvent.id, data as EventUpdateData)
      : await addEvent(data as EventCreationData);
    
    if (result) {
      toast.success(`Event ${editingEvent ? 'updated' : 'added'}!`);
      setIsFormOpen(false);
      setEditingEvent(null);
    } else {
      toast.error(`Failed to ${editingEvent ? 'update' : 'add'} event.`);
    }
  };
  
  const totalPages = Math.ceil(totalEvents / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Events</h1>
        <ActualDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <ActualDialogTrigger asChild><ActualButton onClick={handleAdd}>Add Event</ActualButton></ActualDialogTrigger>
            <ActualDialogContent className="sm:max-w-lg bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</ActualDialogTitle>
                </ActualDialogHeader>
                <EventForm 
                    event={editingEvent} 
                    championships={championships}
                    tracks={tracks}
                    onSave={handleSave} 
                    onClose={() => { setIsFormOpen(false); setEditingEvent(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      </div>

      <div className="mb-4">
        <ActualLabel htmlFor="filter-event-championship">Filter by Championship:</ActualLabel>
        <ActualSelect value={filterChampionshipId} onValueChange={setFilterChampionshipId}>
            <ActualSelectTrigger className="w-full md:w-1/3 mt-1">
                <ActualSelectValue placeholder="All Championships" />
            </ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="">All Championships</ActualSelectItem>
                {championships.map(champ => ( // Assuming championships for filter are also loaded via fetchRelatedDataForForm or separate fetch
                    <ActualSelectItem key={champ.id} value={champ.id.toString()}>
                        {champ.name}
                    </ActualSelectItem>
                ))}
            </ActualSelectContent>
        </ActualSelect>
      </div>

      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Name</ActualTableHead>
                <ActualTableHead>Championship</ActualTableHead>
                <ActualTableHead>Track/Location</ActualTableHead>
                <ActualTableHead>Date</ActualTableHead>
                <ActualTableHead>Status</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {events.map((evt) => (
                <ActualTableRow key={evt.id}>
                  <ActualTableCell className="font-medium">{evt.name}</ActualTableCell>
                  <ActualTableCell>{evt.championship?.name || 'N/A'}</ActualTableCell> {/* Assumes championship is populated */}
                  <ActualTableCell>{evt.track?.name || evt.location || 'N/A'}</ActualTableCell> {/* Assumes track is populated */}
                  <ActualTableCell>{new Date(evt.event_date).toLocaleString()}</ActualTableCell>
                  <ActualTableCell className="capitalize">{evt.status || 'N/A'}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEdit(evt)} className="mr-2">Edit</ActualButton>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDelete(evt.id)}>Delete</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalEvents === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEventsListPage;
