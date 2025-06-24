import React, { useState, useEffect } from 'react';
import { useAdminVehicles } from '../../../hooks/useAdminVehicles';
import type { Vehicle, VehicleCreationData, VehicleUpdateData } from '../../../types/vehicle';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError("Vehicle name is required.");
      return;
    }
    const ratingNum = performanceRating ? parseFloat(performanceRating) : undefined;
    if (performanceRating && (isNaN(ratingNum!) || ratingNum! < 0 || ratingNum! > 10)) {
      setFormError("Performance rating must be a number between 0 and 10 if provided.");
      return;
    }
    const data: VehicleCreationData | VehicleUpdateData = {
      name: name.trim(),
      type: type?.trim() || undefined,
      manufacturer: manufacturer?.trim() || undefined,
      performance_rating: ratingNum,
    };
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      <div>
        <label htmlFor="vehicle-name">Vehicle Name</label>
        <Input id="vehicle-name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="vehicle-type">Type/Class</label>
        <Input id="vehicle-type" value={type || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value)} />
      </div>
      <div>
        <label htmlFor="vehicle-manufacturer">Manufacturer</label>
        <Input id="vehicle-manufacturer" value={manufacturer || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManufacturer(e.target.value)} />
      </div>
      <div>
        <label htmlFor="vehicle-rating">Performance Rating (0-10)</label>
        <Input id="vehicle-rating" type="number" step="0.1" min="0" max="10" value={performanceRating} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPerformanceRating(e.target.value)} />
      </div>
      <div>
        <button type="button" onClick={onClose}>Cancel</button>
        <Button type="submit">Save Vehicle</Button>
      </div>
    </form>
  );
};

export default function AdminVehiclesListPage() {
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
      await deleteVehicle(id);
    }
  };

  const handleSaveVehicle = async (data: VehicleCreationData | VehicleUpdateData) => {
    if (editingVehicle) {
      await updateVehicle(editingVehicle.id, data as VehicleUpdateData);
    } else {
      await addVehicle(data as VehicleCreationData);
    }
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const totalPages = Math.ceil(totalVehicles / vehiclesPerPage);

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Vehicles</h1>
        <button onClick={handleAddVehicle}>Add New Vehicle</button>
        {isFormOpen && (
          <Dialog>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
              </DialogHeader>
              <VehicleForm
                vehicle={editingVehicle}
                onSave={handleSaveVehicle}
                onClose={() => { setIsFormOpen(false); setEditingVehicle(null); }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      {loading && <p>Loading vehicles...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type/Class</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.type || 'N/A'}</TableCell>
                  <TableCell>{vehicle.manufacturer || 'N/A'}</TableCell>
                  <TableCell>{vehicle.performance_rating?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditVehicle(vehicle)}>Edit</Button>
                    <Button onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages || totalVehicles === 0}>Next</Button>
          </div>
        </>
      )}
    </div>
  );
}
