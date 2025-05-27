import React, { useState, useEffect } from 'react';
import { useAdminUsers, AdminUserView } from '../../../hooks/useAdminUsers';

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
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
const FallbackDialogDescription: React.FC<any> = ({ children, ...props }) => <p {...props}>{children}</p>;
// const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>; // Not directly used in list, button triggers externally
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
const ActualDialogDescription = DialogDescription || FallbackDialogDescription;
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


interface UserRoleFormProps {
  user: AdminUserView;
  onSave: (userId: string, newRole: string) => Promise<void>;
  onClose: () => void;
}

const UserRoleForm: React.FC<UserRoleFormProps> = ({ user, onSave, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(user.role || 'user'); // Default to 'user' if role is undefined
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
        <p className="text-sm text-gray-600 mb-1">User: <span className="font-medium">{user.username || user.email}</span></p>
        <p className="text-sm text-gray-600 mb-2">Current Role: <span className="font-medium capitalize">{user.role || 'N/A'}</span></p>
        <ActualLabel htmlFor="user-role">New Role</ActualLabel>
        <ActualSelect value={selectedRole} onValueChange={setSelectedRole}>
            <ActualSelectTrigger id="user-role" className="w-full mt-1">
                <ActualSelectValue placeholder="Select a role" />
            </ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="user">User</ActualSelectItem>
                <ActualSelectItem value="admin">Admin</ActualSelectItem>
                {/* Add other roles if they exist, e.g., 'moderator' */}
            </ActualSelectContent>
        </ActualSelect>
      </div>
      <ActualDialogFooter>
        <ActualDialogClose asChild><ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton></ActualDialogClose>
        <ActualButton type="submit">Update Role</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};


const AdminUsersListPage: React.FC = () => {
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
    const result = await updateUserRole(userId, newRole);
    if (result) {
      toast.success(`User role updated for ${result.username || result.email}!`);
      setIsFormOpen(false);
      setEditingUser(null);
    } else {
      toast.error('Failed to update user role.');
    }
  };
  
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        {/* No "Add User" button as user creation is typically via public registration */}
      </div>

      {editingUser && (
        <ActualDialog open={isFormOpen} onOpenChange={(open) => { if(!open) setEditingUser(null); setIsFormOpen(open);}}>
            <ActualDialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>Edit User Role</ActualDialogTitle>
                    <ActualDialogDescription>
                        Modify the role for {editingUser.username || editingUser.email}.
                    </ActualDialogDescription>
                </ActualDialogHeader>
                <UserRoleForm 
                    user={editingUser} 
                    onSave={handleSaveRole} 
                    onClose={() => { setIsFormOpen(false); setEditingUser(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      )}

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Username</ActualTableHead>
                <ActualTableHead>Email</ActualTableHead>
                <ActualTableHead>Role</ActualTableHead>
                <ActualTableHead>Joined</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {users.map((user) => (
                <ActualTableRow key={user.id}>
                  <ActualTableCell className="font-medium">{user.username || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{user.email || 'N/A'}</ActualTableCell>
                  <ActualTableCell className="capitalize">{user.role || 'user'}</ActualTableCell>
                  <ActualTableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEditRole(user)}>Edit Role</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalUsers === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsersListPage;
