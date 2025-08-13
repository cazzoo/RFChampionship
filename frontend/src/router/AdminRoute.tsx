import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/" replace />; // Or to an "unauthorized" page
  }

  return children;
};

export default AdminRoute;
