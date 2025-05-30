import React, { useState } from 'react';
// Assuming Shadcn/ui components are available and an apiClient for API calls
// Also assuming a toast notification system (e.g., react-hot-toast or custom)
// For example: import { useToast } from '@/components/ui/use-toast'; (if using Shadcn's toast)

// Placeholder for apiClient - replace with your actual implementation
const apiClient = {
  post: async (url: string, data?: any, config?: any) => {
    // Simulate API call
    console.log(`API POST request to ${url} with data:`, data, config);
    // Simulate success for now, or specific responses based on URL
    if (url.startsWith('/api/admin/seed-data')) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      // Simulate potential error for testing
      // if (url.includes("overwrite=true")) return Promise.reject({ response: { data: { message: "Simulated overwrite error!"}}});
      return Promise.resolve({ data: { message: 'Mock data seeded successfully from placeholder.', details: `Overwrite was ${url.includes("overwrite=true")}` } });
    }
    return Promise.reject({ response: { data: { message: 'Unknown API endpoint' } } });
  },
};

// Placeholder for Shadcn/ui components - replace with actual imports
const Button = ({ children, onClick, disabled, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button onClick={onClick} disabled={disabled} {...props} style={{ margin: '5px', padding: '10px', backgroundColor: disabled ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
    {children}
  </button>
);

const Checkbox = ({ id, checked, onChange, children }: { id: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, children: React.ReactNode }) => (
  <div style={{ margin: '10px 0' }}>
    <input type="checkbox" id={id} checked={checked} onChange={onChange} style={{ marginRight: '5px' }} />
    <label htmlFor={id}>{children}</label>
  </div>
);

// Simple Dialog placeholder
const AlertDialog = ({ isOpen, onClose, onConfirm, title, description }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, description: string }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <Button onClick={onConfirm} style={{ marginRight: '10px', backgroundColor: 'red'}}>Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
};

// Simple Toast placeholder - in a real app, use a toast library like react-hot-toast
const toast = {
  success: (message: string) => console.log(`Toast Success: ${message}`),
  error: (message: string) => console.error(`Toast Error: ${message}`),
  loading: (message: string) => console.log(`Toast Loading: ${message}`),
};


const AdminDashboardPage: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [overwriteData, setOverwriteData] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  // const { toast } = useToast(); // Example if using Shadcn's toast

  const handleSeedData = async () => {
    if (overwriteData) {
      setShowConfirmationDialog(true);
    } else {
      await performSeeding();
    }
  };

  const performSeeding = async () => {
    setShowConfirmationDialog(false); // Close dialog if it was open
    setIsSeeding(true);
    toast.loading('Seeding process started...');

    try {
      let url = '/api/admin/seed-data';
      if (overwriteData) {
        url += '?overwrite=true';
      }

      // Assuming apiClient handles auth headers internally
      const response = await apiClient.post(url);
      toast.success(response.data.message || 'Mock data seeded successfully!');
      console.log('Seeding response details:', response.data.details);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred during seeding.';
      toast.error(`Error seeding data: ${errorMessage}`);
      console.error('Seeding error:', err);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleConfirmOverwrite = () => {
    performSeeding();
  };

  const handleCancelOverwrite = () => {
    setShowConfirmationDialog(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin area. Here you can manage various aspects of the application.</p>

      {/* Other admin sections can go here */}

      <section style={{ marginTop: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h2>Developer Tools</h2>

        <div style={{ marginTop: '10px' }}>
          <h3>Data Management</h3>
          <p>Use the button below to populate the database with mock data. This is useful for development and testing.</p>

          <Checkbox
            id="overwrite-data"
            checked={overwriteData}
            onChange={(e) => setOverwriteData(e.target.checked)}
          >
            Overwrite existing data? (Warning: This can be destructive)
          </Checkbox>

          <Button onClick={handleSeedData} disabled={isSeeding}>
            {isSeeding ? 'Seeding...' : 'Seed Mock Data'}
          </Button>
        </div>
      </section>

      <AlertDialog
        isOpen={showConfirmationDialog}
        onClose={handleCancelOverwrite}
        onConfirm={handleConfirmOverwrite}
        title="Confirm Overwrite"
        description="Are you sure you want to overwrite existing data? This action may delete current records and cannot be undone."
      />
    </div>
  );
};

export default AdminDashboardPage;
