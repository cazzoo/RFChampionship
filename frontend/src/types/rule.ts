// Based on backend/src/routes/ruleRoutes.ts and potential DB schema
export interface Rule {
  id: number; // Assuming integer ID
  title: string;
  description: string;
  championship_id?: number | null; // Foreign key to championships table
  created_at: string;  // ISO date string
  updated_at: string;  // ISO date string

  // Optional: If you join championship details in the backend API response
  championship?: { id: number; name: string; };
}

// Type for creating rules
export type RuleCreationData = Omit<Rule, 'id' | 'created_at' | 'updated_at' | 'championship'>;

// Type for updating rules
export type RuleUpdateData = Partial<RuleCreationData>;
