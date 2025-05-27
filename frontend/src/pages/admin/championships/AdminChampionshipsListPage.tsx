import React, { useState, useEffect } from 'react';
import { useAdminChampionships } from '../../../hooks/useAdminChampionships';
import { Championship, ChampionshipCreationData, ChampionshipUpdateData } from '../../../types/championship';

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
// import { toast } from 'sonner';

// Fallback components for conceptual UI
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

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };

interface ChampionshipFormProps {
  championship?: Championship | null;
  onSave: (data: ChampionshipCreationData | ChampionshipUpdateData) => Promise<void>;
  onClose: () => void;
}

const ChampionshipForm: React.FC<ChampionshipFormProps> = ({ championship, onSave, onClose }) => {
  const [name, setName] = useState(championship?.name || '');
  const [description, setDescription] = useState(championship?.description || '');
  const [startDate, setStartDate] = useState(championship?.start_date?.split('T')[0] || ''); // Format for date input
  const [endDate, setEndDate] = useState(championship?.end_date?.split('T')[0] || '');
  const [rules, setRules] = useState(championship?.rules || '');
  const [prizePool, setPrizePool] = useState(championship?.prize_pool || '');
  const [status, setStatus] = useState(championship?.status || 'upcoming');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Championship name is required.");
      return;
    }
    // Add more validation as needed

    const data: ChampionshipCreationData | ChampionshipUpdateData = {
      name: name.trim(),
      description: description?.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      rules: rules?.trim() || null,
      prize_pool: prizePool?.trim() || null,
      status: status as Championship['status'], // Ensure status matches type
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <ActualLabel htmlFor="champ-name">Name</ActualLabel>
        <ActualInput id="champ-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="champ-desc">Description</ActualLabel>
        <ActualTextarea id="champ-desc" value={description || ''} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <ActualLabel htmlFor="champ-start">Start Date</ActualLabel>
          <ActualInput id="champ-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1" />
        </div>
        <div>
          <ActualLabel htmlFor="champ-end">End Date</ActualLabel>
          <ActualInput id="champ-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-1" />
        </div>
      </div>
       <div>
        <ActualLabel htmlFor="champ-rules">Rules</ActualLabel>
        <ActualTextarea id="champ-rules" value={rules || ''} onChange={(e) => setRules(e.target.value)} rows={3} className="mt-1" />
      </div>
       <div>
        <ActualLabel htmlFor="champ-prize">Prize Pool</ActualLabel>
        <ActualInput id="champ-prize" value={prizePool || ''} onChange={(e) => setPrizePool(e.target.value)} className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="champ-status">Status</ActualLabel>
        {/* Conceptual Select for status */}
        <select id="champ-status" value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
        </select>
      </div>
      <ActualDialogFooter>
        <ActualDialogClose asChild><ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton></ActualDialogClose>
        <ActualButton type="submit">Save Championship</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};


const AdminChampionshipsListPage: React.FC = () => {
  const { championships, totalChampionships, loading, error, fetchChampionships, addChampionship, updateChampionship, deleteChampionship } = useAdminChampionships();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchChampionships(currentPage, itemsPerPage);
  }, [currentPage, fetchChampionships]);

  const handleAdd = () => {
    setEditingChampionship(null);
    setIsFormOpen(true);
  };

  const handleEdit = (championship: Championship) => {
    setEditingChampionship(championship);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this championship? This might also affect related events and registrations.')) {
      const success = await deleteChampionship(id);
      toast[success ? 'success' : 'error'](success ? 'Championship deleted!' : 'Failed to delete championship.');
    }
  };

  const handleSave = async (data: ChampionshipCreationData | ChampionshipUpdateData) => {
    const result = editingChampionship
      ? await updateChampionship(editingChampionship.id, data as ChampionshipUpdateData)
      : await addChampionship(data as ChampionshipCreationData);
    
    if (result) {
      toast.success(`Championship ${editingChampionship ? 'updated' : 'added'}!`);
      setIsFormOpen(false);
      setEditingChampionship(null);
    } else {
      toast.error(`Failed to ${editingChampionship ? 'update' : 'add'} championship.`);
    }
  };
  
  const totalPages = Math.ceil(totalChampionships / itemsPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Championships</h1>
        <ActualDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <ActualDialogTrigger asChild><ActualButton onClick={handleAdd}>Add Championship</ActualButton></ActualDialogTrigger>
            <ActualDialogContent className="sm:max-w-lg bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>{editingChampionship ? 'Edit Championship' : 'Add New Championship'}</ActualDialogTitle>
                    <ActualDialogDescription>
                        {editingChampionship ? 'Update championship details.' : 'Fill in new championship details.'}
                    </ActualDialogDescription>
                </ActualDialogHeader>
                <ChampionshipForm 
                    championship={editingChampionship} 
                    onSave={handleSave} 
                    onClose={() => { setIsFormOpen(false); setEditingChampionship(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      </div>

      {loading && <p>Loading championships...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Name</ActualTableHead>
                <ActualTableHead>Start Date</ActualTableHead>
                <ActualTableHead>End Date</ActualTableHead>
                <ActualTableHead>Status</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {championships.map((champ) => (
                <ActualTableRow key={champ.id}>
                  <ActualTableCell className="font-medium">{champ.name}</ActualTableCell>
                  <ActualTableCell>{champ.start_date ? new Date(champ.start_date).toLocaleDateString() : 'N/A'}</ActualTableCell>
                  <ActualTableCell>{champ.end_date ? new Date(champ.end_date).toLocaleDateString() : 'N/A'}</ActualTableCell>
                  <ActualTableCell className="capitalize">{champ.status || 'N/A'}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEdit(champ)} className="mr-2">Edit</ActualButton>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDelete(champ.id)}>Delete</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalChampionships === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminChampionshipsListPage;
