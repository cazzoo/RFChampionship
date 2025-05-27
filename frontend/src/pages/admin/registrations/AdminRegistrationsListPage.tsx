import React, { useState, useEffect } from 'react';
import { useAdminRegistrations } from '../../../hooks/useAdminRegistrations';
import { Registration, RegistrationStatus } from '../../../types/registration';
import { Championship } from '../../../types/championship';
import { Event } from '../../../types/event';
import { Profile } from '../../../types/profile';

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
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
// const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialogFooter: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogClose: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackSelect: React.FC<any> = ({ children, ...props }) => <select {...props}>{children}</select>;
const FallbackSelectContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackSelectItem: React.FC<any> = ({ children, ...props }) => <option {...props}>{children}</option>;
const FallbackSelectTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackSelectValue: React.FC<any> = (props) => <span {...props} />;
const FallbackLabel: React.FC<any> = ({ children, ...props }) => <label {...props}>{children}</label>;

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
// const ActualDialogTrigger = DialogTrigger || FallbackDialogTrigger;
const ActualDialogFooter = DialogFooter || FallbackDialogFooter;
const ActualDialogClose = DialogClose || FallbackDialogClose;
const ActualSelect = Select || FallbackSelect;
const ActualSelectContent = SelectContent || FallbackSelectContent;
const ActualSelectItem = SelectItem || FallbackSelectItem;
const ActualSelectTrigger = SelectTrigger || FallbackSelectTrigger;
const ActualSelectValue = SelectValue || FallbackSelectValue;
const ActualLabel = Label || FallbackLabel;

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };

const REGISTRATION_STATUSES: RegistrationStatus[] = ['pending', 'confirmed', 'cancelled', 'waitlisted'];

interface RegistrationStatusFormProps {
  registration: Registration;
  onSave: (registrationId: number, newStatus: RegistrationStatus) => Promise<void>;
  onClose: () => void;
}

const RegistrationStatusForm: React.FC<RegistrationStatusFormProps> = ({ registration, onSave, onClose }) => {
  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!status) {
      setFormError("Status is required.");
      return;
    }
    await onSave(registration.id, status);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <p className="text-sm">Updating status for registration ID: {registration.id}</p>
        <p className="text-sm">User: {registration.user?.username || registration.user?.email || 'N/A'}</p>
        <p className="text-sm">
          Registered for: {registration.event?.name || registration.championship?.name || 'N/A'}
        </p>
      </div>
      <div>
        <ActualLabel htmlFor="reg-status">New Status</ActualLabel>
        <ActualSelect value={status} onValueChange={(value) => setStatus(value as RegistrationStatus)}>
            <ActualSelectTrigger id="reg-status" className="w-full mt-1">
                <ActualSelectValue placeholder="Select status" />
            </ActualSelectTrigger>
            <ActualSelectContent>
                {REGISTRATION_STATUSES.map(s => (
                    <ActualSelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</ActualSelectItem>
                ))}
            </ActualSelectContent>
        </ActualSelect>
      </div>
      <ActualDialogFooter>
        <ActualDialogClose asChild><ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton></ActualDialogClose>
        <ActualButton type="submit">Update Status</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};

const AdminRegistrationsListPage: React.FC = () => {
  const { 
    registrations, totalRegistrations, loading, error, 
    fetchRegistrations, updateRegistrationStatus,
    allChampionships, allEvents, allUsers // For filters
  } = useAdminRegistrations();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [filterUserId, setFilterUserId] = useState('');
  const [filterEventId, setFilterEventId] = useState('');
  const [filterChampionshipId, setFilterChampionshipId] = useState('');
  const [filterStatus, setFilterStatus] = useState<RegistrationStatus | ''>('');

  useEffect(() => {
    fetchRegistrations(currentPage, itemsPerPage, {
        userId: filterUserId || undefined,
        eventId: filterEventId || undefined,
        championshipId: filterChampionshipId || undefined,
        status: filterStatus || undefined,
    });
  }, [currentPage, filterUserId, filterEventId, filterChampionshipId, filterStatus, fetchRegistrations]);


  const handleEditStatus = (registration: Registration) => {
    setEditingRegistration(registration);
    setIsFormOpen(true);
  };

  const handleSaveStatus = async (registrationId: number, newStatus: RegistrationStatus) => {
    const result = await updateRegistrationStatus(registrationId, newStatus);
    if (result) {
      toast.success('Registration status updated!');
      setIsFormOpen(false);
      setEditingRegistration(null);
    } else {
      toast.error('Failed to update status.');
    }
  };
  
  const totalPages = Math.ceil(totalRegistrations / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-semibold mb-6">Manage Registrations</h1>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <div>
            <ActualLabel htmlFor="filter-user">User</ActualLabel>
            <ActualSelect value={filterUserId} onValueChange={setFilterUserId}>
                <ActualSelectTrigger id="filter-user" className="w-full mt-1"><ActualSelectValue placeholder="All Users" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">All Users</ActualSelectItem>
                    {allUsers.map(user => <ActualSelectItem key={user.id} value={user.id}>{user.username || user.email}</ActualSelectItem>)}
                </ActualSelectContent>
            </ActualSelect>
        </div>
         <div>
            <ActualLabel htmlFor="filter-championship">Championship</ActualLabel>
            <ActualSelect value={filterChampionshipId} onValueChange={setFilterChampionshipId}>
                <ActualSelectTrigger id="filter-championship" className="w-full mt-1"><ActualSelectValue placeholder="All Championships" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">All Championships</ActualSelectItem>
                    {allChampionships.map(champ => <ActualSelectItem key={champ.id} value={champ.id.toString()}>{champ.name}</ActualSelectItem>)}
                </ActualSelectContent>
            </ActualSelect>
        </div>
        <div>
            <ActualLabel htmlFor="filter-event">Event</ActualLabel>
            <ActualSelect value={filterEventId} onValueChange={setFilterEventId}>
                <ActualSelectTrigger id="filter-event" className="w-full mt-1"><ActualSelectValue placeholder="All Events" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">All Events</ActualSelectItem>
                    {allEvents.map(evt => <ActualSelectItem key={evt.id} value={evt.id.toString()}>{evt.name}</ActualSelectItem>)}
                </ActualSelectContent>
            </ActualSelect>
        </div>
        <div>
            <ActualLabel htmlFor="filter-status">Status</ActualLabel>
            <ActualSelect value={filterStatus} onValueChange={(value) => setFilterStatus(value as RegistrationStatus | '')}>
                <ActualSelectTrigger id="filter-status" className="w-full mt-1"><ActualSelectValue placeholder="All Statuses" /></ActualSelectTrigger>
                <ActualSelectContent>
                    <ActualSelectItem value="">All Statuses</ActualSelectItem>
                    {REGISTRATION_STATUSES.map(s => <ActualSelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</ActualSelectItem>)}
                </ActualSelectContent>
            </ActualSelect>
        </div>
      </div>


      {editingRegistration && (
        <ActualDialog open={isFormOpen} onOpenChange={(open) => { if(!open) setEditingRegistration(null); setIsFormOpen(open);}}>
            <ActualDialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>Edit Registration Status</ActualDialogTitle>
                </ActualDialogHeader>
                <RegistrationStatusForm 
                    registration={editingRegistration} 
                    onSave={handleSaveStatus} 
                    onClose={() => { setIsFormOpen(false); setEditingRegistration(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      )}

      {loading && <p>Loading registrations...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>User</ActualTableHead>
                <ActualTableHead>Registered For</ActualTableHead>
                <ActualTableHead>Team</ActualTableHead>
                <ActualTableHead>Vehicle</ActualTableHead>
                <ActualTableHead>Date</ActualTableHead>
                <ActualTableHead>Status</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {registrations.map((reg) => (
                <ActualTableRow key={reg.id}>
                  <ActualTableCell className="font-medium">{reg.user?.username || reg.user?.email || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{reg.event?.name || reg.championship?.name || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{reg.team?.name || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{reg.vehicle?.name || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{new Date(reg.registration_date).toLocaleDateString()}</ActualTableCell>
                  <ActualTableCell className="capitalize">{reg.status}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEditStatus(reg)}>Edit Status</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalRegistrations === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminRegistrationsListPage;
