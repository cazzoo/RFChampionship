import React, { useState, useEffect } from 'react';
import { useAdminUsers } from '../../../hooks/useAdminUsers';
import type { AdminUserView } from '../../../hooks/useAdminUsers';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface UserRoleFormProps {
  user: AdminUserView;
  onSave: (userId: string, newRole: string) => Promise<void>;
  onClose: () => void;
}

const UserRoleForm: React.FC<UserRoleFormProps> = ({ user, onSave, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(user.role || 'user');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedRole) {
      setFormError("A role must be selected.");
      return;
    }
    await onSave(user.id, selectedRole);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <p className="text-sm text-gray-600 mb-1">User: <span className="font-medium">{user.username || (typeof user === 'object' && 'email' in user ? (user as { email?: string }).email : '')}</span></p>
        <p className="text-sm text-gray-600 mb-2">Current Role: <span className="font-medium capitalize">{user.role || 'N/A'}</span></p>
        <label htmlFor="user-role">New Role</label>
        <select id="user-role" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <button type="button" onClick={onClose}>Cancel</button>
        <Button type="submit">Update Role</Button>
      </div>
    </form>
  );
};

export default function AdminUsersListPage() {
  const { users, totalUsers, loading, error, fetchUsers, updateUserRole } = useAdminUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserView | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage);
  }, [currentPage, fetchUsers]);

  const handleEditRole = (user: AdminUserView) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSaveRole = async (userId: string, newRole: string) => {
    await updateUserRole(userId, newRole);
    setIsFormOpen(false);
    setEditingUser(null);
  };

  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
      </div>
      {editingUser && isFormOpen && (
        <div>
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User Role</DialogTitle>
              </DialogHeader>
              <UserRoleForm
                user={editingUser}
                onSave={handleSaveRole}
                onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>{(typeof user === 'object' && 'email' in user ? (user as { email?: string }).email : 'N/A')}</TableCell>
                  <TableCell>{user.role || 'user'}</TableCell>
                  <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditRole(user)}>Edit Role</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalUsers === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
