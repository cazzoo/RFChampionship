import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChampionship } from '../hooks/useChampionships';
import { useEvents } from '../hooks/useEvents';
import { Event as EventType } from '../types/event'; // Renamed to avoid conflict with React.Event
import { useAuth } from '../contexts/AuthContext';
import { useUserRegistrations } from '../hooks/useUserRegistrations';
import { RegistrationCreationData } from '../types/registration';
import { Team } from '../types/team';
import { Vehicle } from '../types/vehicle';
import { useResults } from '../hooks/useResults'; // Import useResults hook
import { Result } from '../types/result'; // Import Result type
import CommentsSection from '../components/comments/CommentsSection'; // Import CommentsSection

// Conceptual Shadcn UI imports
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'; // For results table
// import { toast } from 'sonner';

// Fallbacks for conceptual UI
const FallbackButton: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialog: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogHeader: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogTitle: React.FC<any> = ({ children, ...props }) => <h2 {...props}>{children}</h2>;
const FallbackDialogDescription: React.FC<any> = ({ children, ...props }) => <p {...props}>{children}</p>;
const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialogFooter: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogClose: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackSelect: React.FC<any> = ({ children, ...props }) => <select {...props}>{children}</select>;
const FallbackSelectContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackSelectItem: React.FC<any> = ({ children, ...props }) => <option {...props}>{children}</option>;
const FallbackSelectTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackSelectValue: React.FC<any> = (props) => <span {...props} />;
const FallbackLabel: React.FC<any> = ({ children, ...props }) => <label {...props}>{children}</label>;
const FallbackTable: React.FC<any> = ({ children, ...props }) => <table {...props}>{children}</table>;
const FallbackTableBody: React.FC<any> = ({ children, ...props }) => <tbody {...props}>{children}</tbody>;
const FallbackTableCell: React.FC<any> = ({ children, ...props }) => <td {...props}>{children}</td>;
const FallbackTableHead: React.FC<any> = ({ children, ...props }) => <th {...props}>{children}</th>;
const FallbackTableHeader: React.FC<any> = ({ children, ...props }) => <thead {...props}>{children}</thead>;
const FallbackTableRow: React.FC<any> = ({ children, ...props }) => <tr {...props}>{children}</tr>;


const ActualButton = Button || FallbackButton;
const ActualDialog = Dialog || FallbackDialog;
const ActualDialogContent = DialogContent || FallbackDialogContent;
const ActualDialogHeader = DialogHeader || FallbackDialogHeader;
const ActualDialogTitle = DialogTitle || FallbackDialogTitle;
const ActualDialogDescription = DialogDescription || FallbackDialogDescription;
const ActualDialogTrigger = DialogTrigger || FallbackDialogTrigger;
const ActualDialogFooter = DialogFooter || FallbackDialogFooter;
const ActualDialogClose = DialogClose || FallbackDialogClose;
const ActualSelect = Select || FallbackSelect;
const ActualSelectContent = SelectContent || FallbackSelectContent;
const ActualSelectItem = SelectItem || FallbackSelectItem;
const ActualSelectTrigger = SelectTrigger || FallbackSelectTrigger;
const ActualSelectValue = SelectValue || FallbackSelectValue;
const ActualLabel = Label || FallbackLabel;
const ActualTable = Table || FallbackTable;
const ActualTableBody = TableBody || FallbackTableBody;
const ActualTableCell = TableCell || FallbackTableCell;
const ActualTableHead = TableHead || FallbackTableHead;
const ActualTableHeader = TableHeader || FallbackTableHeader;
const ActualTableRow = TableRow || FallbackTableRow;
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
        <ActualLabel htmlFor="reg-team">Team (Optional)</ActualLabel>
        <ActualSelect value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <ActualSelectTrigger id="reg-team" className="w-full mt-1"><ActualSelectValue placeholder="Select a team" /></ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="">No Team</ActualSelectItem>
                {userTeams.map(team => <ActualSelectItem key={team.id} value={team.id.toString()}>{team.name}</ActualSelectItem>)}
            </ActualSelectContent>
        </ActualSelect>
      </div>
      <div>
        <ActualLabel htmlFor="reg-vehicle">Vehicle (Optional)</ActualLabel>
        <ActualSelect value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <ActualSelectTrigger id="reg-vehicle" className="w-full mt-1"><ActualSelectValue placeholder="Select a vehicle" /></ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="">No Specific Vehicle</ActualSelectItem>
                {availableVehicles.map(vehicle => <ActualSelectItem key={vehicle.id} value={vehicle.id.toString()}>{vehicle.name} ({vehicle.manufacturer})</ActualSelectItem>)}
            </ActualSelectContent>
        </ActualSelect>
      </div>
      <ActualDialogFooter>
        <ActualDialogClose asChild><ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton></ActualDialogClose>
        <ActualButton type="submit">Confirm Registration</ActualButton>
      </ActualDialogFooter>
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
        fetchChampionshipResults(1, 100, { championshipId: id });
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
        // Could add bestPosition, wins etc.
      };
    }
    acc[userId].totalPoints += result.points || 0;
    acc[userId].resultsCount += 1;
    return acc;
  }, {} as Record<string, { user?: Partial<any>, totalPoints: number, resultsCount: number }> );

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
                             <ActualButton onClick={() => handleCancelRegistration(existingRegistration.id)} variant="destructive" size="sm" className="mt-1" disabled={regLoading}>
                                {regLoading ? 'Cancelling...' : 'Cancel Registration'}
                            </ActualButton>
                        )}
                    </div>
                ) : (
                    <ActualDialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                        <ActualDialogTrigger asChild>
                            <ActualButton variant="default" size="lg" disabled={regLoading}>
                                {regLoading ? 'Processing...' : 'Register for Championship'}
                            </ActualButton>
                        </ActualDialogTrigger>
                        <ActualDialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
                            <ActualDialogHeader>
                                <ActualDialogTitle>Register for {championship.name}</ActualDialogTitle>
                                <ActualDialogDescription>Select your team and vehicle if applicable.</ActualDialogDescription>
                            </ActualDialogHeader>
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
                        </ActualDialogContent>
                    </ActualDialog>
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
             <ActualTable>
                <ActualTableHeader>
                    <ActualTableRow>
                        <ActualTableHead>Rank</ActualTableHead>
                        <ActualTableHead>User</ActualTableHead>
                        <ActualTableHead>Total Points</ActualTableHead>
                        <ActualTableHead>Events Played</ActualTableHead>
                    </ActualTableRow>
                </ActualTableHeader>
                <ActualTableBody>
                    {sortedLeaderboard.map((entry, index) => (
                        <ActualTableRow key={entry.user?.id || index}>
                            <ActualTableCell className="font-bold">{index + 1}</ActualTableCell>
                            <ActualTableCell>{entry.user?.username || entry.user?.email || 'N/A'}</ActualTableCell>
                            <ActualTableCell>{entry.totalPoints}</ActualTableCell>
                            <ActualTableCell>{entry.resultsCount}</ActualTableCell>
                        </ActualTableRow>
                    ))}
                </ActualTableBody>
            </ActualTable>
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
