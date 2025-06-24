import React, { useState, useEffect } from 'react';
import { useAdminRules } from '../../../hooks/useAdminRules';
import type { Rule, RuleCreationData, RuleUpdateData } from '../../../types/rule';
import type { Championship } from '../../../types/championship';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface RuleFormProps {
  rule?: Rule | null;
  championships: Championship[];
  onSave: (data: RuleCreationData | RuleUpdateData) => Promise<void>;
  onClose: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ rule, championships, onSave, onClose }) => {
  const [title, setTitle] = useState(rule?.title || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [championshipId, setChampionshipId] = useState<string>(rule?.championship_id?.toString() || '');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim() || !description.trim()) {
      setFormError("Rule title and description are required.");
      return;
    }
    const data: RuleCreationData | RuleUpdateData = {
      title: title.trim(),
      description: description.trim(),
      championship_id: championshipId ? parseInt(championshipId) : null,
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <label htmlFor="rule-title">Rule Title</label>
        <input id="rule-title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="e.g., Track Limits" required />
      </div>
      <div>
        <label htmlFor="rule-description">Description</label>
        <textarea id="rule-description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Detailed explanation of the rule..." required rows={5} />
      </div>
      <div>
        <label htmlFor="rule-championship">Championship (Optional)</label>
        <select id="rule-championship" value={championshipId} onChange={e => setChampionshipId(e.target.value)}>
          <option value="">Global Rule (No Championship)</option>
          {championships.map(champ => (
            <option key={champ.id} value={champ.id.toString()}>{champ.name}</option>
          ))}
        </select>
      </div>
      <div>
        <button type="button" onClick={onClose}>Cancel</button>
        <Button type="submit">Save Rule</Button>
      </div>
    </form>
  );
};

export default function AdminRulesListPage() {
  const { rules, totalRules, championships, loading, error, fetchRules, addRule, updateRule, deleteRule } = useAdminRules();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rulesPerPage = 10;
  const [filterChampionshipId, setFilterChampionshipId] = useState<string>('');

  useEffect(() => {
    let champIdFilter: number | null | undefined = undefined;
    if (filterChampionshipId === "null") {
      champIdFilter = null;
    } else if (filterChampionshipId) {
      champIdFilter = parseInt(filterChampionshipId);
    }
    fetchRules(currentPage, rulesPerPage, champIdFilter);
  }, [currentPage, filterChampionshipId, fetchRules]);

  const handleAddRule = () => {
    setEditingRule(null);
    setIsFormOpen(true);
  };

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleDeleteRule = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      await deleteRule(id);
    }
  };

  const handleSaveRule = async (data: RuleCreationData | RuleUpdateData) => {
    if (editingRule) {
      await updateRule(editingRule.id, data as RuleUpdateData);
    } else {
      await addRule(data as RuleCreationData);
    }
    setIsFormOpen(false);
    setEditingRule(null);
  };

  const totalPages = Math.ceil(totalRules / rulesPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Rules</h1>
        <button onClick={handleAddRule}>Add New Rule</button>
        {isFormOpen && (
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
              </DialogHeader>
              <RuleForm
                rule={editingRule}
                championships={championships}
                onSave={handleSaveRule}
                onClose={() => { setIsFormOpen(false); setEditingRule(null); }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="filter-championship">Filter by Championship:</label>
        <select id="filter-championship" value={filterChampionshipId} onChange={e => setFilterChampionshipId(e.target.value)}>
          <option value="">All Rules</option>
          <option value="null">Global Rules (No Championship)</option>
          {championships.map(champ => (
            <option key={champ.id} value={champ.id.toString()}>{champ.name}</option>
          ))}
        </select>
      </div>
      {loading && <p>Loading rules...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Championship</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.title}</TableCell>
                  <TableCell>{rule.championship?.name || (rule.championship_id === null ? <em>Global Rule</em> : 'N/A')}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditRule(rule)}>Edit</Button>
                    <Button onClick={() => handleDeleteRule(rule.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalRules === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
