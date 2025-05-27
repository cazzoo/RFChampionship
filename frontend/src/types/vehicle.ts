// Based on backend/src/routes/vehicleRoutes.ts and potential DB schema
export interface Vehicle {
  id: number; // Assuming integer ID
  name: string;
  type?: string | null; // e.g., 'GT3', 'Formula', 'Kart'
  manufacturer?: string | null;
  performance_rating?: number | null; // e.g., 0-10 or a specific system
  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string
}

// Type for creating vehicles
export type VehicleCreationData = Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>;

// Type for updating vehicles
export type VehicleUpdateData = Partial<VehicleCreationData>;
