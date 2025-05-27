import React, { useState, useEffect } from 'react';
import { useAdminRules } from '../../../hooks/useAdminRules';
import { Rule, RuleCreationData, RuleUpdateData } from '../../../types/rule';
import { Championship } from '../../../types/championship'; // For select dropdown in form

// Conceptual Shadcn UI imports
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'; // Shadcn Select
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
const FallbackDialogTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackDialogFooter: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackDialogClose: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackInput: React.FC<any> = (props) => <input {...props} />;
const FallbackTextarea: React.FC<any> = (props) => <textarea {...props} />;
const FallbackLabel: React.FC<any> = ({ children, ...props }) => <label {...props}>{children}</label>;
const FallbackSelect: React.FC<any> = ({ children, ...props }) => <select {...props}>{children}</select>;
const FallbackSelectContent: React.FC<any> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackSelectItem: React.FC<any> = ({ children, ...props }) => <option {...props}>{children}</option>;
const FallbackSelectTrigger: React.FC<any> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackSelectValue: React.FC<any> = (props) => <span {...props} />;


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
const ActualSelect = Select || FallbackSelect;
const ActualSelectContent = SelectContent || FallbackSelectContent;
const ActualSelectItem = SelectItem || FallbackSelectItem;
const ActualSelectTrigger = SelectTrigger || FallbackSelectTrigger;
const ActualSelectValue = SelectValue || FallbackSelectValue;


const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };

interface RuleFormProps {
  rule?: Rule | null;
  championships: Championship[]; // For the select dropdown
  onSave: (data: RuleCreationData | RuleUpdateData) => Promise<void>;
  onClose: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ rule, championships, onSave, onClose }) => {
  const [title, setTitle] = useState(rule?.title || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [championshipId, setChampionshipId] = useState<string>(rule?.championship_id?.toString() || ''); // Store as string for Select
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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
        <ActualLabel htmlFor="rule-title">Rule Title</ActualLabel>
        <ActualInput id="rule-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Track Limits" required className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="rule-description">Description</ActualLabel>
        <ActualTextarea id="rule-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed explanation of the rule..." required rows={5} className="mt-1" />
      </div>
      <div>
        <ActualLabel htmlFor="rule-championship">Championship (Optional)</ActualLabel>
        <ActualSelect value={championshipId} onValueChange={setChampionshipId}>
            <ActualSelectTrigger className="w-full mt-1">
                <ActualSelectValue placeholder="Select a championship (or leave for global rule)" />
            </ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="">Global Rule (No Championship)</ActualSelectItem>
                {championships.map(champ => (
                    <ActualSelectItem key={champ.id} value={champ.id.toString()}>
                        {champ.name}
                    </ActualSelectItem>
                ))}
            </ActualSelectContent>
        </ActualSelect>
      </div>
      <ActualDialogFooter>
        <ActualDialogClose asChild>
            <ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton>
        </ActualDialogClose>
        <ActualButton type="submit">Save Rule</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};


const AdminRulesListPage: React.FC = () => {
  const { rules, totalRules, championships, loading, error, fetchRules, addRule, updateRule, deleteRule } = useAdminRules();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rulesPerPage = 10;
  const [filterChampionshipId, setFilterChampionshipId] = useState<string>(''); // For filter dropdown

  useEffect(() => {
    // Parse filterChampionshipId to number or null for the hook
    let champIdFilter: number | null | undefined = undefined;
    if (filterChampionshipId === "null") { // Special value for global rules
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
      const success = await deleteRule(id);
      toast[success ? 'success' : 'error'](success ? 'Rule deleted!' : 'Failed to delete rule.');
    }
  };

  const handleSaveRule = async (data: RuleCreationData | RuleUpdateData) => {
    const result = editingRule 
      ? await updateRule(editingRule.id, data as RuleUpdateData)
      : await addRule(data as RuleCreationData);
    
    if (result) {
      toast.success(`Rule ${editingRule ? 'updated' : 'added'}!`);
      setIsFormOpen(false);
      setEditingRule(null);
    } else {
      toast.error(`Failed to ${editingRule ? 'update' : 'add'} rule.`);
    }
  };

  const totalPages = Math.ceil(totalRules / rulesPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Rules</h1>
        <ActualDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <ActualDialogTrigger asChild>
                <ActualButton onClick={handleAddRule}>Add New Rule</ActualButton>
            </ActualDialogTrigger>
            <ActualDialogContent className="sm:max-w-lg bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>{editingRule ? 'Edit Rule' : 'Add New Rule'}</ActualDialogTitle>
                    <ActualDialogDescription>
                        {editingRule ? 'Update rule details.' : 'Fill in new rule details.'}
                    </ActualDialogDescription>
                </ActualDialogHeader>
                <RuleForm 
                    rule={editingRule} 
                    championships={championships}
                    onSave={handleSaveRule} 
                    onClose={() => { setIsFormOpen(false); setEditingRule(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      </div>
      
      <div className="mb-4">
        <ActualLabel htmlFor="filter-championship">Filter by Championship:</ActualLabel>
        <ActualSelect value={filterChampionshipId} onValueChange={setFilterChampionshipId}>
            <ActualSelectTrigger className="w-full md:w-1/3 mt-1">
                <ActualSelectValue placeholder="All Rules" />
            </ActualSelectTrigger>
            <ActualSelectContent>
                <ActualSelectItem value="">All Rules</ActualSelectItem>
                <ActualSelectItem value="null">Global Rules (No Championship)</ActualSelectItem>
                {championships.map(champ => (
                    <ActualSelectItem key={champ.id} value={champ.id.toString()}>
                        {champ.name}
                    </ActualSelectItem>
                ))}
            </ActualSelectContent>
        </ActualSelect>
      </div>

      {loading && <p>Loading rules...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Title</ActualTableHead>
                <ActualTableHead>Championship</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {rules.map((rule) => (
                <ActualTableRow key={rule.id}>
                  <ActualTableCell className="font-medium">{rule.title}</ActualTableCell>
                  <ActualTableCell>{rule.championship?.name || (rule.championship_id === null ? <em>Global Rule</em> : 'N/A')}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEditRule(rule)} className="mr-2">Edit</ActualButton>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDeleteRule(rule.id)}>Delete</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalRules === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminRulesListPage;
