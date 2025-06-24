import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { useUserRegistrations } from '../hooks/useUserRegistrations';
import type { RegistrationCreationData } from '../types/registration.ts';
import type { Team } from '../types/team.ts';
import type { Vehicle } from '../types/vehicle.ts';
import { useResults } from '../hooks/useResults';
import CommentsSection from '../components/comments/CommentsSection';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


interface RegistrationFormProps {
  entityType: 'championship' | 'event';
  entityId: number;
  userTeams: Team[];
  availableVehicles: Vehicle[];
  onRegister: (data: RegistrationCreationData) => Promise<void>;
  onClose: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ entityType, entityId, userTeams, availableVehicles, onRegister, onClose }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registrationData: RegistrationCreationData = {
      [entityType === 'championship' ? 'championship_id' : 'event_id']: entityId,
      team_id: selectedTeamId ? parseInt(selectedTeamId) : null,
      vehicle_id: selectedVehicleId ? parseInt(selectedVehicleId) : null,
    };
    await onRegister(registrationData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Team (Optional)</label>
        <select value={selectedTeamId} onChange={e => setSelectedTeamId(e.target.value)}>
          <option value="">No Team</option>
          {userTeams.map(team => <option key={team.id} value={team.id.toString()}>{team.name}</option>)}
        </select>
      </div>
      <div>
        <label>Vehicle (Optional)</label>
        <select value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)}>
          <option value="">No Specific Vehicle</option>
          {availableVehicles.map(vehicle => <option key={vehicle.id} value={vehicle.id.toString()}>{vehicle.name} ({vehicle.manufacturer})</option>)}
        </select>
      </div>
      <DialogFooter>
        <DialogClose><Button type="button" onClick={onClose}>Cancel</Button></DialogClose>
        <Button type="submit">Confirm Registration</Button>
      </DialogFooter>
    </form>
  );
};


const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventIdNum = parseInt(id || '0');
  const { event, loading: eventLoading, error: eventError } = useEvent(id);
  const { user } = useAuth();
  const {
    registrations: userRegistrations,
    createRegistration,
    cancelRegistration,
    userTeams,
    availableVehicles,
    fetchUserRelatedDataForRegistration,
    loading: regLoading
  } = useUserRegistrations();

  const { results, loading: resultsLoading, error: resultsError, fetchResults: fetchEventResults } = useResults(1, 50, { eventId: id }); // Fetch up to 50 results for this event

  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  useEffect(() => {
    if (user && isRegisterDialogOpen) {
      fetchUserRelatedDataForRegistration();
    }
  }, [user, isRegisterDialogOpen, fetchUserRelatedDataForRegistration]);

  useEffect(() => {
    if (id) {
        fetchEventResults(1, 50);
    }
  }, [id, fetchEventResults]);


  const existingRegistration = userRegistrations.find(reg => reg.event_id === eventIdNum && reg.status !== 'cancelled');

  const handleRegister = async (data: RegistrationCreationData) => {
    const result = await createRegistration(data);
    if (result) {
      toast.success(`Successfully registered for ${event?.name}!`);
      setIsRegisterDialogOpen(false);
    } else {
      toast.error('Failed to register. You might already be registered or an error occurred.');
    }
  };

  const handleCancelRegistration = async (registrationId: number) => {
     if(window.confirm("Are you sure you want to cancel your registration?")) {
        const success = await cancelRegistration(registrationId);
        if (success) {
            toast.success("Registration cancelled.");
        } else {
            toast.error("Failed to cancel registration.");
        }
    }
  };

  if (eventLoading) return <div className="text-center py-10">Loading event details...</div>;
  if (eventError) return <div className="text-center py-10 text-red-500">Error: {eventError.message}</div>;
  if (!event) return <div className="text-center py-10">Event not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-bold text-indigo-700">{event.name}</h1>
                <p className="text-gray-600 text-lg mt-1 mb-2">
                Date: <span className="font-medium text-gray-800">{new Date(event.event_date).toLocaleDateString()} at {new Date(event.event_date).toLocaleTimeString()}</span>
                </p>
                {event.location && (
                <p className="text-gray-600 text-lg mb-2">
                    Location: <span className="font-medium text-gray-800">{event.location}</span>
                </p>
                )}
                <p className="text-gray-600 text-lg mb-4">
                Status: <span className="font-medium capitalize text-gray-800">{event.status || 'Unknown'}</span>
                </p>
            </div>
            {user && (
                <div className="mt-4 md:mt-0">
                {existingRegistration ? (
                    <div className="text-right">
                        <p className="text-green-600 font-semibold">You are registered ({existingRegistration.status})</p>
                        {(existingRegistration.status === 'pending' || existingRegistration.status === 'confirmed') && (
                            <Button onClick={() => handleCancelRegistration(existingRegistration.id)} disabled={regLoading}>
                                {regLoading ? 'Cancelling...' : 'Cancel Registration'}
                            </Button>
                        )}
                    </div>
                ) : (
                    <Dialog>
                        <DialogTrigger>
                            <Button disabled={regLoading}>
                                {regLoading ? 'Processing...' : 'Register for Event'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Register for {event.name}</DialogTitle>
                                <DialogDescription>Select your team and vehicle if applicable.</DialogDescription>
                            </DialogHeader>
                             {regLoading && <p>Loading form data...</p>}
                            {!regLoading && (
                                <RegistrationForm
                                        entityType="event"
                                        entityId={eventIdNum}
                                        userTeams={userTeams}
                                        availableVehicles={availableVehicles}
                                        onRegister={handleRegister}
                                        onClose={() => setIsRegisterDialogOpen(false)}
                                    />
                            )}
                        </DialogContent>
                    </Dialog>
                )}
                </div>
            )}
        </div>

        {event.description && (
          <div className="mt-6 prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Event Description</h3>
            <p className="text-gray-700">{event.description}</p>
          </div>
        )}

        <div className="mt-8">
          <Link
            to={`/championships/${event.championship_id}`}
            className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
          >
            &larr; Back to Championship
          </Link>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Event Results</h2>
        {resultsLoading && <p>Loading results...</p>}
        {resultsError && <p className="text-red-500">Error loading results: {resultsError.message}</p>}
        {!resultsLoading && !resultsError && results && results.length > 0 ? (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pos</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Lap Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.sort((a, b) => a.position - b.position).map((result) => (
                        <TableRow key={result.id}>
                            <TableCell>{result.position}</TableCell>
                            <TableCell>{result.user?.username || 'N/A'}</TableCell>
                            <TableCell>{result.team?.name || 'N/A'}</TableCell>
                            <TableCell>{result.vehicle?.name || 'N/A'}</TableCell>
                            <TableCell>{result.points ?? 'N/A'}</TableCell>
                            <TableCell>{result.lap_time_ms ? `${(result.lap_time_ms / 1000).toFixed(3)}s` : 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
            !resultsLoading && <p className="text-gray-600">No results posted for this event yet.</p>
        )}
      </div>

      {/* Comments Section */}
      {id && <CommentsSection entityType="event" entityId={parseInt(id)} />}
    </div>
  );
};

export default EventDetailPage;
