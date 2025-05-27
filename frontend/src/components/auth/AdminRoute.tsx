import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as necessary

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading user data...</div>;
  }

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Logged in but not an admin, redirect to dashboard or a "not authorized" page
    // For simplicity, redirecting to dashboard.
    // You could create a specific NotAuthorizedPage component.
    alert("Access Denied: You do not have admin privileges."); // Simple alert
    return <Navigate to="/dashboard" replace />; 
  }

  return <>{children}</>;
};

export default AdminRoute;
