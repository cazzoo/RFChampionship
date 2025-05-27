import React, { useState, useEffect } from 'react';
import { useAdminResults } from '../../../hooks/useAdminResults';
import { Result, ResultCreationData, ResultUpdateData } from '../../../types/result';
import { Event } from '../../../types/event';
import { Profile } from '../../../types/profile';
import { Team } from '../../../types/team';
import { Vehicle } from '../../../types/vehicle';

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea'; // For notes
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

interface ResultFormProps {
  result?: Result | null;
  allEvents: Event[];
  allUsers: Profile[]; // Or simplified User type
  allTeams: Team[];
  allVehicles: Vehicle[];
  onSave: (data: ResultCreationData | ResultUpdateData) => Promise<void>;
  onClose: () => void;
}

const ResultForm: React.FC<ResultFormProps> = ({ result, allEvents, allUsers, allTeams, allVehicles, onSave, onClose }) => {
  const [eventId, setEventId] = useState(result?.event_id?.toString() || '');
  const [userId, setUserId] = useState(result?.user_id || '');
  const [position, setPosition] = useState<string>(result?.position?.toString() || '');
  const [points, setPoints] = useState<string>(result?.points?.toString() || '');
  const [teamId, setTeamId] = useState(result?.team_id?.toString() || '');
  const [vehicleId, setVehicleId] = useState(result?.vehicle_id?.toString() || '');
  const [lapTimeMs, setLapTimeMs] = useState<string>(result?.lap_time_ms?.toString() || '');
  const [notes, setNotes] = useState(result?.notes || '');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!eventId || !userId || !position) {
      setFormError("Event, User, and Position are required.");
      return;
    }
    const posNum = parseInt(position);
    if (isNaN(posNum) || posNum <= 0) {
        setFormError("Position must be a positive number.");
        return;
    }
    
    const data: ResultCreationData | ResultUpdateData = {
      event_id: parseInt(eventId),
      user_id: userId,
      position: posNum,
      points: points ? parseFloat(points) : null,
      team_id: teamId ? parseInt(teamId) : null,
      vehicle_id: vehicleId ? parseInt(vehicleId) : null,
      lap_time_ms: lapTimeMs ? parseInt(lapTimeMs) : null,
      notes: notes || null,
    };
    // For updates, we might not want to send event_id and user_id if they are not changeable
    // This depends on backend PUT logic for /api/results/:id
    if (result) { // If updating
        delete (data as any).event_id; // Assuming event_id is not updatable for an existing result
        delete (data as any).user_id;  // Assuming user_id is not updatable
    }

    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {formError && <p className="text-red-500 text-sm mb-2">{formError}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
            <ActualLabel htmlFor="res-event">Event</ActualLabel>
            <ActualSelect value={eventId} onValueChange={setEventId} required disabled={!!result}>
                <ActualSelectTrigger id="res-event" className="w-full mt-1"><ActualSelectValue placeholder="Select Event" /></ActualSelectTrigger>
                <ActualSelectContent>{allEvents.map(evt => <ActualSelectItem key={evt.id} value={evt.id.toString()}>{evt.name}</ActualSelectItem>)}</ActualSelectContent>
            </ActualSelect>
        </div>
        <div>
            <ActualLabel htmlFor="res-user">User (Participant)</ActualLabel>
            <ActualSelect value={userId} onValueChange={setUserId} required disabled={!!result}>
                <ActualSelectTrigger id="res-user" className="w-full mt-1"><ActualSelectValue placeholder="Select User" /></ActualSelectTrigger>
                <ActualSelectContent>{allUsers.map(usr => <ActualSelectItem key={usr.id} value={usr.id}>{usr.username || usr.email}</ActualSelectItem>)}</ActualSelectContent>
            </ActualSelect>
        </div>
        <div>
            <ActualLabel htmlFor="res-position">Position</ActualLabel>
            <ActualInput id="res-position" type="number" value={position} onChange={(e) => setPosition(e.target.value)} required className="mt-1" />
        </div>
        <div>
            <ActualLabel htmlFor="res-points">Points</ActualLabel>
            <ActualInput id="res-points" type="number" step="0.5" value={points} onChange={(e) => setPoints(e.target.value)} className="mt-1" />
        </div>
        <div>
            <ActualLabel htmlFor="res-team">Team (Optional)</ActualLabel>
            <ActualSelect value={teamId} onValueChange={setTeamId}>
                <ActualSelectTrigger id="res-team" className="w-full mt-1"><ActualSelectValue placeholder="Select Team" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">No Team</ActualSelectItem>
                    {allTeams.map(t => <ActualSelectItem key={t.id} value={t.id.toString()}>{t.name}</ActualSelectItem>)}
                </ActualSelectContent>
            </ActualSelect>
        </div>
        <div>
            <ActualLabel htmlFor="res-vehicle">Vehicle (Optional)</ActualLabel>
            <ActualSelect value={vehicleId} onValueChange={setVehicleId}>
                <ActualSelectTrigger id="res-vehicle" className="w-full mt-1"><ActualSelectValue placeholder="Select Vehicle" /></ActualSelectTrigger>
                <ActualSelectContent>
                     <ActualSelectItem value="">No Vehicle</ActualSelectItem>
                    {allVehicles.map(v => <ActualSelectItem key={v.id} value={v.id.toString()}>{v.name}</ActualSelectItem>)}
                </ActualSelectContent>
            </ActualSelect>
        </div>
        <div>
            <ActualLabel htmlFor="res-laptime">Lap Time (ms)</ActualLabel>
            <ActualInput id="res-laptime" type="number" value={lapTimeMs} onChange={(e) => setLapTimeMs(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <ActualLabel htmlFor="res-notes">Notes (Optional)</ActualLabel>
        <ActualTextarea id="res-notes" value={notes || ''} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1" />
      </div>
      <ActualDialogFooter className="pt-3">
        <ActualDialogClose asChild><ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton></ActualDialogClose>
        <ActualButton type="submit">Save Result</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};


const AdminResultsListPage: React.FC = () => {
  const { 
    results, totalResults, loading, error, fetchResults, 
    addResult, updateResult, deleteResult,
    allEvents, allUsers, allTeams, allVehicles, fetchRelatedDataForForm
  } = useAdminResults();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [filterEventId, setFilterEventId] = useState('');
  // Add other filters if needed (championship, user, team)

  useEffect(() => {
    fetchResults(currentPage, itemsPerPage, { eventId: filterEventId || undefined });
  }, [currentPage, filterEventId, fetchResults]);

  useEffect(() => {
    if(isFormOpen) {
        fetchRelatedDataForForm(); // Fetch data for form dropdowns when form is opened
    }
  }, [isFormOpen, fetchRelatedDataForForm]);

  const handleAdd = () => {
    setEditingResult(null);
    setIsFormOpen(true);
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      const success = await deleteResult(id);
      toast[success ? 'success' : 'error'](success ? 'Result deleted!' : 'Failed to delete result.');
    }
  };

  const handleSave = async (data: ResultCreationData | ResultUpdateData) => {
    const result = editingResult
      ? await updateResult(editingResult.id, data as ResultUpdateData)
      : await addResult(data as ResultCreationData);
    
    if (result) {
      toast.success(`Result ${editingResult ? 'updated' : 'added'}!`);
      setIsFormOpen(false);
      setEditingResult(null);
    } else {
      toast.error(`Failed to ${editingResult ? 'update' : 'add'} result.`);
    }
  };
  
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Results</h1>
        <ActualDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <ActualDialogTrigger asChild><ActualButton onClick={handleAdd}>Add New Result</ActualButton></ActualDialogTrigger>
            <ActualDialogContent className="sm:max-w-lg bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>{editingResult ? 'Edit Result' : 'Add New Result'}</ActualDialogTitle>
                </ActualDialogHeader>
                <ResultForm 
                    result={editingResult} 
                    allEvents={allEvents}
                    allUsers={allUsers}
                    allTeams={allTeams}
                    allVehicles={allVehicles}
                    onSave={handleSave} 
                    onClose={() => { setIsFormOpen(false); setEditingResult(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      </div>

      <div className="mb-4">
        <ActualLabel htmlFor="filter-res-event">Filter by Event:</ActualLabel>
        <ActualSelect value={filterEventId} onValueChange={setFilterEventId}>
            <ActualSelectTrigger id="filter-res-event" className="w-full md:w-1/2 mt-1">
                <ActualSelectValue placeholder="All Events" />
            </ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="">All Events</ActualSelectItem>
                {allEvents.map(evt => <ActualSelectItem key={evt.id} value={evt.id.toString()}>{evt.name}</ActualSelectItem>)}
            </ActualSelectContent>
        </ActualSelect>
      </div>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Event</ActualTableHead>
                <ActualTableHead>User</ActualTableHead>
                <ActualTableHead>Position</ActualTableHead>
                <ActualTableHead>Points</ActualTableHead>
                <ActualTableHead>Team</ActualTableHead>
                <ActualTableHead>Vehicle</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {results.map((res) => (
                <ActualTableRow key={res.id}>
                  <ActualTableCell className="font-medium">{res.event?.name || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{res.user?.username || res.user?.email || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{res.position}</ActualTableCell>
                  <ActualTableCell>{res.points ?? 'N/A'}</ActualTableCell>
                  <ActualTableCell>{res.team?.name || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{res.vehicle?.name || 'N/A'}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEdit(res)} className="mr-2">Edit</ActualButton>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDelete(res.id)}>Delete</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalResults === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminResultsListPage;
