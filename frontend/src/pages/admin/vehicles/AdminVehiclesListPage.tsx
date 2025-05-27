import React, { useState, useEffect } from 'react';
import { useAdminVehicles } from '../../../hooks/useAdminVehicles';
import { Vehicle, VehicleCreationData, VehicleUpdateData } from '../../../types/vehicle';
// Conceptual Shadcn UI imports (actual paths might differ based on user's setup)
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
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
const ActualLabel = Label || FallbackLabel;

const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSave: (data: VehicleCreationData | VehicleUpdateData) => Promise<void>;
  onClose: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, onSave, onClose }) => {
  const [name, setName] = useState(vehicle?.name || '');
  const [type, setType] = useState(vehicle?.type || '');
  const [manufacturer, setManufacturer] = useState(vehicle?.manufacturer || '');
  const [performanceRating, setPerformanceRating] = useState<string>(vehicle?.performance_rating?.toString() || '');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Vehicle name is required.");
      return;
    }
    const ratingNum = performanceRating ? parseFloat(performanceRating) : null;
    if (performanceRating && (isNaN(ratingNum!) || ratingNum! < 0 || ratingNum! > 10)) {
        setFormError("Performance rating must be a number between 0 and 10 if provided.");
        return;
    }

    const data: VehicleCreationData | VehicleUpdateData = {
      name: name.trim(),
      type: type?.trim() || null,
      manufacturer: manufacturer?.trim() || null,
      performance_rating: ratingNum,
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <ActualLabel htmlFor="vehicle-name">Vehicle Name</ActualLabel>
        <ActualInput id="vehicle-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Porsche 911 GT3 R" required className="mt-1"/>
      </div>
      <div>
        <ActualLabel htmlFor="vehicle-type">Type/Class</ActualLabel>
        <ActualInput id="vehicle-type" value={type || ''} onChange={(e) => setType(e.target.value)} placeholder="e.g., GT3" className="mt-1"/>
      </div>
      <div>
        <ActualLabel htmlFor="vehicle-manufacturer">Manufacturer</ActualLabel>
        <ActualInput id="vehicle-manufacturer" value={manufacturer || ''} onChange={(e) => setManufacturer(e.target.value)} placeholder="e.g., Porsche" className="mt-1"/>
      </div>
      <div>
        <ActualLabel htmlFor="vehicle-rating">Performance Rating (0-10)</ActualLabel>
        <ActualInput id="vehicle-rating" type="number" step="0.1" min="0" max="10" value={performanceRating} onChange={(e) => setPerformanceRating(e.target.value)} placeholder="e.g., 7.5" className="mt-1"/>
      </div>
      <ActualDialogFooter>
         <ActualDialogClose asChild>
            <ActualButton type="button" variant="outline" onClick={onClose}>Cancel</ActualButton>
        </ActualDialogClose>
        <ActualButton type="submit">Save Vehicle</ActualButton>
      </ActualDialogFooter>
    </form>
  );
};

const AdminVehiclesListPage: React.FC = () => {
  const { vehicles, totalVehicles, loading, error, fetchVehicles, addVehicle, updateVehicle, deleteVehicle } = useAdminVehicles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 10;

  useEffect(() => {
    fetchVehicles(currentPage, vehiclesPerPage);
  }, [currentPage, fetchVehicles]);

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDeleteVehicle = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      const success = await deleteVehicle(id);
      toast[success ? 'success' : 'error'](success ? 'Vehicle deleted!' : 'Failed to delete vehicle.');
    }
  };

  const handleSaveVehicle = async (data: VehicleCreationData | VehicleUpdateData) => {
    const result = editingVehicle 
      ? await updateVehicle(editingVehicle.id, data as VehicleUpdateData)
      : await addVehicle(data as VehicleCreationData);
    
    if (result) {
      toast.success(`Vehicle ${editingVehicle ? 'updated' : 'added'}!`);
      setIsFormOpen(false);
      setEditingVehicle(null);
    } else {
      toast.error(`Failed to ${editingVehicle ? 'update' : 'add'} vehicle.`);
    }
  };

  const totalPages = Math.ceil(totalVehicles / vehiclesPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
        <ActualDialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <ActualDialogTrigger asChild>
                <ActualButton onClick={handleAddVehicle}>Add New Vehicle</ActualButton>
            </ActualDialogTrigger>
            <ActualDialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-xl">
                <ActualDialogHeader>
                    <ActualDialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</ActualDialogTitle>
                    <ActualDialogDescription>
                        {editingVehicle ? 'Update vehicle details.' : 'Fill in new vehicle details.'}
                    </ActualDialogDescription>
                </ActualDialogHeader>
                <VehicleForm 
                    vehicle={editingVehicle} 
                    onSave={handleSaveVehicle} 
                    onClose={() => { setIsFormOpen(false); setEditingVehicle(null); }}
                />
            </ActualDialogContent>
        </ActualDialog>
      </div>

      {loading && <p>Loading vehicles...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      
      {!loading && !error && (
        <>
          <ActualTable className="bg-white shadow rounded-lg">
            <ActualTableHeader>
              <ActualTableRow>
                <ActualTableHead>Name</ActualTableHead>
                <ActualTableHead>Type/Class</ActualTableHead>
                <ActualTableHead>Manufacturer</ActualTableHead>
                <ActualTableHead>Rating</ActualTableHead>
                <ActualTableHead>Actions</ActualTableHead>
              </ActualTableRow>
            </ActualTableHeader>
            <ActualTableBody>
              {vehicles.map((vehicle) => (
                <ActualTableRow key={vehicle.id}>
                  <ActualTableCell className="font-medium">{vehicle.name}</ActualTableCell>
                  <ActualTableCell>{vehicle.type || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{vehicle.manufacturer || 'N/A'}</ActualTableCell>
                  <ActualTableCell>{vehicle.performance_rating?.toFixed(1) || 'N/A'}</ActualTableCell>
                  <ActualTableCell>
                     <ActualButton variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)} className="mr-2">Edit</ActualButton>
                     <ActualButton variant="destructive" size="sm" onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</ActualButton>
                  </ActualTableCell>
                </ActualTableRow>
              ))}
            </ActualTableBody>
          </ActualTable>
          <div className="flex items-center justify-end space-x-2 py-4">
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</ActualButton>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <ActualButton variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalVehicles === 0}>Next</ActualButton>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminVehiclesListPage;
