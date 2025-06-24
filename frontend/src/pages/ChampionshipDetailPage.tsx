import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChampionship } from '../hooks/useChampionships';
import { useEvents } from '../hooks/useEvents';
import type { Event as EventType } from '../types/event.ts';
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


const ChampionshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const championshipIdNum = parseInt(id || '0');
  const { championship, loading: champLoading, error: champError } = useChampionship(id);
  const { events, loading: eventsLoading, error: eventsError } = useEvents(id); // Events for this championship
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

  // Fetch results for the entire championship
  const { results, loading: resultsLoading, error: resultsError, fetchResults: fetchChampionshipResults } = useResults(1, 100, { championshipId: id }); // Fetch up to 100 results

  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);

  useEffect(() => {
    if (user && isRegisterDialogOpen) {
      fetchUserRelatedDataForRegistration();
    }
  }, [user, isRegisterDialogOpen, fetchUserRelatedDataForRegistration]);

  useEffect(() => {
    if (id) {
        fetchChampionshipResults(1, 100);
    }
  }, [id, fetchChampionshipResults]);


  const existingRegistration = userRegistrations.find(reg => reg.championship_id === championshipIdNum && reg.status !== 'cancelled');

  const handleRegister = async (data: RegistrationCreationData) => {
    const result = await createRegistration(data);
    if (result) {
      toast.success(`Successfully registered for ${championship?.name}!`);
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


  if (champLoading) return <div className="text-center py-10">Loading championship details...</div>;
  if (champError) return <div className="text-center py-10 text-red-500">Error: {champError.message}</div>;
  if (!championship) return <div className="text-center py-10">Championship not found.</div>;

  // Aggregate results by user for a simple leaderboard
  const leaderboard = results.reduce((acc, result) => {
    const userId = result.user?.id || 'unknown';
    if (!acc[userId]) {
      acc[userId] = {
        user: result.user,
        totalPoints: 0,
        resultsCount: 0,
      };
    }
    acc[userId].totalPoints += result.points || 0;
    acc[userId].resultsCount += 1;
    return acc;
  }, {} as Record<string, { user?: { id?: string; username?: string; email?: string }, totalPoints: number, resultsCount: number }> );

  const sortedLeaderboard = Object.values(leaderboard).sort((a, b) => b.totalPoints - a.totalPoints);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div>
                <h1 className="text-3xl font-bold text-indigo-700">{championship.name}</h1>
                <p className="text-gray-600 text-sm mt-1">
                Dates: {championship.start_date ? new Date(championship.start_date).toLocaleDateString() : 'TBA'} - {championship.end_date ? new Date(championship.end_date).toLocaleDateString() : 'TBA'}
                </p>
                <p className="text-gray-600 text-sm">
                Status: <span className="font-medium capitalize">{championship.status || 'Unknown'}</span>
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
                                {regLoading ? 'Processing...' : 'Register for Championship'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Register for {championship.name}</DialogTitle>
                                <DialogDescription>Select your team and vehicle if applicable.</DialogDescription>
                            </DialogHeader>
                            {regLoading && <p>Loading form data...</p>}
                            {!regLoading && (
                               <RegistrationForm
                                    entityType="championship"
                                    entityId={championshipIdNum}
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

        {championship.description && <p className="text-gray-700 mb-4">{championship.description}</p>}
         {championship.rules && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Rules</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{championship.rules}</p>
          </div>
        )}
        {championship.prize_pool && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Prize Pool</h3>
            <p className="text-gray-600">{championship.prize_pool}</p>
          </div>
        )}
      </div>

      {/* Events List Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Events in this Championship</h2>
        {eventsLoading && <p>Loading events...</p>}
        {eventsError && <p className="text-red-500">Error loading events: {eventsError.message}</p>}
        {!eventsLoading && !eventsError && events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: EventType) => (
              <div key={event.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">{event.name}</h3>
                <p className="text-gray-600 text-sm">Date: {new Date(event.event_date).toLocaleDateString()}</p>
                {event.location && <p className="text-gray-600 text-sm">Location: {event.location}</p>}
                <p className="text-gray-600 text-sm capitalize">Status: {event.status || 'Unknown'}</p>
                <Link
                  to={`/events/${event.id}`}
                  className="mt-3 inline-block text-indigo-500 hover:text-indigo-700 font-medium"
                >
                  View Event Details &rarr;
                </Link>
              </div>
            ))}
          </div>
        ) : (
          !eventsLoading && !eventsError && <p className="text-gray-600">No events scheduled for this championship yet.</p>
        )}
      </div>

      {/* Championship Leaderboard/Results Summary Section */}
      <div className="mt-8 bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Championship Leaderboard</h2>
        {resultsLoading && <p>Loading leaderboard...</p>}
        {resultsError && <p className="text-red-500">Error loading results: {resultsError.message}</p>}
        {!resultsLoading && !resultsError && sortedLeaderboard && sortedLeaderboard.length > 0 ? (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Total Points</TableHead>
                        <TableHead>Events Played</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedLeaderboard.map((entry, index) => (
                        <TableRow key={entry.user?.id || index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{entry.user?.username || entry.user?.email || 'N/A'}</TableCell>
                            <TableCell>{entry.totalPoints}</TableCell>
                            <TableCell>{entry.resultsCount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ) : (
            !resultsLoading && <p className="text-gray-600">No results available to display leaderboard.</p>
        )}
      </div>

      {/* Comments Section */}
      {id && <CommentsSection entityType="championship" entityId={id} />}
    </div>
  );
};

export default ChampionshipDetailPage;
