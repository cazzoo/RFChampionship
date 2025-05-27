import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent } from '../hooks/useEvents';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'; // For results
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
        fetchEventResults(1, 50, { eventId: id });
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
                 {event.track && (
                 <p className="text-gray-600 text-lg mb-2">
                    Track: <span className="font-medium text-gray-800">{event.track.name}</span>
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
                            <ActualButton onClick={() => handleCancelRegistration(existingRegistration.id)} variant="destructive" size="sm" className="mt-1" disabled={regLoading}>
                                {regLoading ? 'Cancelling...' : 'Cancel Registration'}
                            </ActualButton>
                        )}
                    </div>
                ) : (
                    <ActualDialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                        <ActualDialogTrigger asChild>
                            <ActualButton variant="default" size="lg" disabled={regLoading}>
                                {regLoading ? 'Processing...' : 'Register for Event'}
                            </ActualButton>
                        </ActualDialogTrigger>
                        <ActualDialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
                            <ActualDialogHeader>
                                <ActualDialogTitle>Register for {event.name}</ActualDialogTitle>
                                <ActualDialogDescription>Select your team and vehicle if applicable.</ActualDialogDescription>
                            </ActualDialogHeader>
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
                        </ActualDialogContent>
                    </ActualDialog>
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
            <ActualTable>
                <ActualTableHeader>
                    <ActualTableRow>
                        <ActualTableHead>Pos</ActualTableHead>
                        <ActualTableHead>User</ActualTableHead>
                        <ActualTableHead>Team</ActualTableHead>
                        <ActualTableHead>Vehicle</ActualTableHead>
                        <ActualTableHead>Points</ActualTableHead>
                        <ActualTableHead>Lap Time</ActualTableHead>
                    </ActualTableRow>
                </ActualTableHeader>
                <ActualTableBody>
                    {results.sort((a,b) => a.position - b.position).map((result: Result) => (
                        <ActualTableRow key={result.id}>
                            <ActualTableCell className="font-bold">{result.position}</ActualTableCell>
                            <ActualTableCell>{result.user?.username || result.user?.email || 'N/A'}</ActualTableCell>
                            <ActualTableCell>{result.team?.name || 'N/A'}</ActualTableCell>
                            <ActualTableCell>{result.vehicle?.name || 'N/A'}</ActualTableCell>
                            <ActualTableCell>{result.points ?? 'N/A'}</ActualTableCell>
                            <ActualTableCell>{result.lap_time_ms ? `${(result.lap_time_ms / 1000).toFixed(3)}s` : 'N/A'}</ActualTableCell>
                        </ActualTableRow>
                    ))}
                </ActualTableBody>
            </ActualTable>
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
