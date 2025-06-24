import React, { useEffect, useState } from 'react';
import { useUserRegistrations } from '../hooks/useUserRegistrations';
import type { Registration } from '../types/registration.ts';
import { Link } from 'react-router-dom';

// Conceptual Shadcn UI imports
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
// import { toast } from 'sonner';

// Fallbacks for conceptual UI
const FallbackButton: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ...props }) => <button {...props}>{children}</button>;
const FallbackCard: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackCardContent: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackCardHeader: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ...props }) => <div {...props}>{children}</div>;
const FallbackCardTitle: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ...props }) => <h3 {...props}>{children}</h3>;
const FallbackCardDescription: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({ children, ...props }) => <p {...props}>{children}</p>;

const ActualButton = Button || FallbackButton;
const ActualCard = Card || FallbackCard;
const ActualCardContent = CardContent || FallbackCardContent;
const ActualCardHeader = CardHeader || FallbackCardHeader;
const ActualCardTitle = CardTitle || FallbackCardTitle;
const ActualCardDescription = CardDescription || FallbackCardDescription;
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


const MyRegistrationsPage: React.FC = () => {
  const {
    registrations,
    totalRegistrations,
    loading,
    error,
    fetchRegistrations,
    cancelRegistration
  } = useUserRegistrations();

  const [currentPage, setCurrentPage] = useState(1);
  const registrationsPerPage = 10;

  useEffect(() => {
    fetchRegistrations(currentPage, registrationsPerPage);
  }, [currentPage, fetchRegistrations]);

  const handleCancel = async (registrationId: number) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      const success = await cancelRegistration(registrationId);
      if (success) {
        toast.success('Registration cancelled successfully.');
        // The list will update via the hook's state management (optimistic or refetch)
      } else {
        toast.error('Failed to cancel registration.');
      }
    }
  };

  const totalPages = Math.ceil(totalRegistrations / registrationsPerPage);

  if (loading && registrations.length === 0) { // Show loading only on initial fetch or if data is empty
    return <div className="text-center py-10">Loading your registrations...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading registrations: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Registrations</h1>

      {registrations.length === 0 && !loading ? (
        <p className="text-center text-gray-600">You have no registrations yet.</p>
      ) : (
        <div className="space-y-6">
          {registrations.map((reg: Registration) => (
            <ActualCard key={reg.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <ActualCardHeader>
                <ActualCardTitle className="text-xl text-indigo-700">
                  {reg.event ? (
                    <Link to={`/events/${reg.event_id}`} className="hover:underline">
                      Event: {reg.event.name}
                    </Link>
                  ) : reg.championship ? (
                     <Link to={`/championships/${reg.championship_id}`} className="hover:underline">
                       Championship: {reg.championship.name}
                    </Link>
                  ) : (
                    'Unknown Registration'
                  )}
                </ActualCardTitle>
                <ActualCardDescription className="text-sm text-gray-500">
                  Registered on: {new Date(reg.registration_date).toLocaleDateString()}
                </ActualCardDescription>
              </ActualCardHeader>
              <ActualCardContent>
                <p className="text-gray-700 mb-1">
                  Status: <span className={`font-semibold capitalize px-2 py-0.5 rounded-full text-xs ${
                    reg.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    reg.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    reg.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{reg.status}</span>
                </p>
                {reg.team && <p className="text-sm text-gray-600">Team: {reg.team.name}</p>}
                {reg.vehicle && <p className="text-sm text-gray-600">Vehicle: {reg.vehicle.name}</p>}

                {(reg.status === 'pending' || reg.status === 'confirmed') && (
                  <div className="mt-4">
                    <ActualButton
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(reg.id)}
                      disabled={loading} // Disable button while any registration operation is loading
                    >
                      {loading && reg.id === (registrations.find(r => r.status === 'cancelling_placeholder')?.id) ? 'Cancelling...' : 'Cancel Registration'}
                    </ActualButton>
                  </div>
                )}
              </ActualCardContent>
            </ActualCard>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalRegistrations > 0 && totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4 mt-8">
            <ActualButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </ActualButton>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <ActualButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </ActualButton>
          </div>
        )}
    </div>
  );
};

export default MyRegistrationsPage;
