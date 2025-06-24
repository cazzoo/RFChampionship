import React, { useState, useEffect } from 'react';
import { useAdminResults } from '../../../hooks/useAdminResults';
import type { Result, ResultCreationData, ResultUpdateData } from '../../../types/result.ts';
import type { Event } from '../../../types/event.ts';
import type { Profile } from '../../../types/profile.ts';
import type { Team } from '../../../types/team.ts';
import type { Vehicle } from '../../../types/vehicle.ts';

// Use only the actual UI components, remove Fallbacks and all Actual* indirection
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { toast } from 'sonner';

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
        await onSave(data);
        return;
    }

    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {formError && <p className="text-red-500 text-sm mb-2">{formError}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
            <Label htmlFor="res-event">Event</Label>
            <Select value={eventId} onValueChange={setEventId} required disabled={!!result}>
                <SelectTrigger id="res-event" className="w-full mt-1"><SelectValue placeholder="Select Event" /></SelectTrigger>
                <SelectContent>{allEvents.map(evt => <SelectItem key={evt.id} value={evt.id.toString()}>{evt.name}</SelectItem>)}</SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="res-user">User (Participant)</Label>
            <Select value={userId} onValueChange={setUserId} required disabled={!!result}>
                <SelectTrigger id="res-user" className="w-full mt-1"><SelectValue placeholder="Select User" /></SelectTrigger>
                <SelectContent>{allUsers.map(usr => <SelectItem key={usr.id} value={usr.id}>{usr.username}</SelectItem>)}</SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="res-position">Position</Label>
            <Input id="res-position" type="number" value={position} onChange={(e) => setPosition(e.target.value)} required className="mt-1" />
        </div>
        <div>
            <Label htmlFor="res-points">Points</Label>
            <Input id="res-points" type="number" step="0.5" value={points} onChange={(e) => setPoints(e.target.value)} className="mt-1" />
        </div>
        <div>
            <Label htmlFor="res-team">Team (Optional)</Label>
            <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger id="res-team" className="w-full mt-1"><SelectValue placeholder="Select Team" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="">No Team</SelectItem>
                    {allTeams.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="res-vehicle">Vehicle (Optional)</Label>
            <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger id="res-vehicle" className="w-full mt-1"><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
                <SelectContent>
                     <SelectItem value="">No Vehicle</SelectItem>
                    {allVehicles.map(v => <SelectItem key={v.id} value={v.id.toString()}>{v.name}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="res-laptime">Lap Time (ms)</Label>
            <Input id="res-laptime" type="number" value={lapTimeMs} onChange={(e) => setLapTimeMs(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="res-notes">Notes (Optional)</Label>
        <Textarea id="res-notes" value={notes || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)} rows={3} />
      </div>
      <DialogFooter>
        <DialogClose><Button type="button" onClick={onClose}>Cancel</Button></DialogClose>
        <Button type="submit">Save</Button>
      </DialogFooter>
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
        <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingResult ? 'Edit Result' : 'Add New Result'}</DialogTitle>
                </DialogHeader>
                <ResultForm
                    result={editingResult}
                    allEvents={allEvents}
                    allUsers={allUsers}
                    allTeams={allTeams}
                    allVehicles={allVehicles}
                    onSave={handleSave}
                    onClose={() => { setIsFormOpen(false); setEditingResult(null); }}
                />
            </DialogContent>
      </div>

      <div className="mb-4">
        <Label htmlFor="filter-res-event">Filter by Event:</Label>
        <Select value={filterEventId} onValueChange={setFilterEventId}>
            <SelectTrigger id="filter-res-event" className="w-full md:w-1/2 mt-1">
                <SelectValue placeholder="All Events" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="">All Events</SelectItem>
                {allEvents.map(evt => <SelectItem key={evt.id} value={evt.id.toString()}>{evt.name}</SelectItem>)}
            </SelectContent>
        </Select>
      </div>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((res) => (
                <TableRow key={res.id}>
                  <TableCell>{res.event?.name || 'N/A'}</TableCell>
                  <TableCell>{res.user?.username || 'N/A'}</TableCell>
                  <TableCell>{res.position}</TableCell>
                  <TableCell>{res.points ?? 'N/A'}</TableCell>
                  <TableCell>{res.team?.name || 'N/A'}</TableCell>
                  <TableCell>{res.vehicle?.name || 'N/A'}</TableCell>
                  <TableCell>
                     <Button onClick={() => handleEdit(res)} className="mr-2">Edit</Button>
                     <Button onClick={() => handleDelete(res.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalResults === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminResultsListPage;
