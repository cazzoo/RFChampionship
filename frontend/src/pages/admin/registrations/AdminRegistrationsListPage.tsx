import React, { useState, useEffect } from 'react';
import { useAdminRegistrations } from '../../../hooks/useAdminRegistrations';
import type { Registration, RegistrationStatus } from '../../../types/registration';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

const REGISTRATION_STATUSES: RegistrationStatus[] = ['pending', 'confirmed', 'cancelled', 'waitlisted'];

interface RegistrationStatusFormProps {
  registration: Registration;
  onSave: (registrationId: number, newStatus: RegistrationStatus) => Promise<void>;
  onClose: () => void;
}

const RegistrationStatusForm: React.FC<RegistrationStatusFormProps> = ({ registration, onSave, onClose }) => {
  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        <p className="text-sm">User: {registration.user?.username || (registration.user && typeof registration.user === 'object' && 'email' in registration.user ? (registration.user as { email?: string }).email : 'N/A')}</p>
        <p className="text-sm">
          Registered for: {registration.event?.name || registration.championship?.name || 'N/A'}
        </p>
      </div>
      <div>
        <label htmlFor="reg-status">New Status</label>
        <select id="reg-status" value={status} onChange={e => setStatus(e.target.value as RegistrationStatus)}>
          {REGISTRATION_STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <button type="button" onClick={onClose}>Cancel</button>
        <Button type="submit">Update Status</Button>
      </div>
    </form>
  );
};

export default function AdminRegistrationsListPage() {
  const {
    registrations, totalRegistrations, loading, error,
    fetchRegistrations, updateRegistrationStatus,
    allChampionships, allEvents, allUsers
  } = useAdminRegistrations();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
    await updateRegistrationStatus(registrationId, newStatus);
    setIsFormOpen(false);
    setEditingRegistration(null);
  };

  const totalPages = Math.ceil(totalRegistrations / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-semibold mb-6">Manage Registrations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <div>
          <label htmlFor="filter-user">User</label>
          <select id="filter-user" value={filterUserId} onChange={e => setFilterUserId(e.target.value)}>
            <option value="">All Users</option>
            {allUsers.map(user => <option key={user.id} value={user.id}>{user.username || (typeof user === 'object' && 'email' in user ? (user as { email?: string }).email : '')}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-championship">Championship</label>
          <select id="filter-championship" value={filterChampionshipId} onChange={e => setFilterChampionshipId(e.target.value)}>
            <option value="">All Championships</option>
            {allChampionships.map(champ => <option key={champ.id} value={champ.id.toString()}>{champ.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-event">Event</label>
          <select id="filter-event" value={filterEventId} onChange={e => setFilterEventId(e.target.value)}>
            <option value="">All Events</option>
            {allEvents.map(evt => <option key={evt.id} value={evt.id.toString()}>{evt.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="filter-status">Status</label>
          <select id="filter-status" value={filterStatus} onChange={e => setFilterStatus(e.target.value as RegistrationStatus | '')}>
            <option value="">All Statuses</option>
            {REGISTRATION_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      {editingRegistration && isFormOpen && (
        <div>
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Registration Status</DialogTitle>
              </DialogHeader>
              <RegistrationStatusForm
                registration={editingRegistration}
                onSave={handleSaveStatus}
                onClose={() => { setIsFormOpen(false); setEditingRegistration(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
      {loading && <p>Loading registrations...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Registered For</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell>{reg.user?.username || (reg.user && typeof reg.user === 'object' && 'email' in reg.user ? (reg.user as { email?: string }).email : 'N/A')}</TableCell>
                  <TableCell>{reg.event?.name || reg.championship?.name || 'N/A'}</TableCell>
                  <TableCell>{reg.team?.name || 'N/A'}</TableCell>
                  <TableCell>{reg.vehicle?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(reg.registration_date).toLocaleDateString()}</TableCell>
                  <TableCell>{reg.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditStatus(reg)}>Edit Status</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalRegistrations === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
