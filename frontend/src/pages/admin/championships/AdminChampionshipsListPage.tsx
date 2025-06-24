import React, { useState, useEffect } from 'react';
import { useAdminChampionships } from '../../../hooks/useAdminChampionships';
import type { Championship, ChampionshipCreationData, ChampionshipUpdateData } from '../../../types/championship';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };

interface ChampionshipFormProps {
  championship?: Championship | null;
  onSave: (data: ChampionshipCreationData | ChampionshipUpdateData) => Promise<void>;
  onClose: () => void;
}

const ChampionshipForm: React.FC<ChampionshipFormProps> = ({ championship, onSave, onClose }) => {
  const [name, setName] = useState(championship?.name || '');
  const [description, setDescription] = useState(championship?.description || '');
  const [startDate, setStartDate] = useState(championship?.start_date?.split('T')[0] || '');
  const [endDate, setEndDate] = useState(championship?.end_date?.split('T')[0] || '');
  const [rules, setRules] = useState(championship?.rules || '');
  const [prizePool, setPrizePool] = useState(championship?.prize_pool || '');
  const [status, setStatus] = useState<Championship['status']>(championship?.status || 'upcoming');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Championship name is required.");
      return;
    }
    const data: ChampionshipCreationData | ChampionshipUpdateData = {
      name: name.trim(),
      description: description?.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      rules: rules?.trim() || null,
      prize_pool: prizePool?.trim() || null,
      status: status,
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <Label htmlFor="champ-name">Name</Label>
        <Input id="champ-name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="champ-desc">Description</Label>
        <Textarea id="champ-desc" value={description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={3} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="champ-start">Start Date</Label>
          <Input id="champ-start" type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="champ-end">End Date</Label>
          <Input id="champ-end" type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="champ-rules">Rules</Label>
        <Textarea id="champ-rules" value={rules || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRules(e.target.value)} rows={3} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="champ-prize">Prize Pool</Label>
        <Input id="champ-prize" value={prizePool || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrizePool(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="champ-status">Status</Label>
        <select id="champ-status" value={status} onChange={(e) => setStatus(e.target.value as Championship['status'])} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <DialogFooter>
        <DialogClose asChild><Button type="button" onClick={onClose}>Cancel</Button></DialogClose>
        <Button type="submit">Save Championship</Button>
      </DialogFooter>
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
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild><Button onClick={handleAdd}>Add Championship</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingChampionship ? 'Edit Championship' : 'Add New Championship'}</DialogTitle>
              <DialogDescription>
                {editingChampionship ? 'Update championship details.' : 'Fill in new championship details.'}
              </DialogDescription>
            </DialogHeader>
            <ChampionshipForm
              championship={editingChampionship}
              onSave={handleSave}
              onClose={() => { setIsFormOpen(false); setEditingChampionship(null); }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {loading && <p>Loading championships...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {championships.map((champ) => (
                <TableRow key={champ.id}>
                  <TableCell className="font-medium">{champ.name}</TableCell>
                  <TableCell>{champ.start_date ? new Date(champ.start_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{champ.end_date ? new Date(champ.end_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="capitalize">{champ.status || 'N/A'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(champ)} className="mr-2">Edit</Button>
                    <Button onClick={() => handleDelete(champ.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalChampionships === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminChampionshipsListPage;
