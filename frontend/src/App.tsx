import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout'; // For public-facing pages
import AdminLayout from './components/admin/AdminLayout'; // For admin section
import HomePage from './pages/HomePage';
import ChampionshipsListPage from './pages/ChampionshipsListPage';
import ChampionshipDetailPage from './pages/ChampionshipDetailPage';
import EventsListPage from './pages/EventsListPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // User general dashboard
import MyRegistrationsPage from './pages/MyRegistrationsPage'; // User registrations page
import ProtectedRoute from './components/auth/ProtectedRoute'; 
import { AuthProvider } from './contexts/AuthContext'; 
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // Admin dashboard
import AdminRoute from './components/auth/AdminRoute';

// Admin CRUD pages
import AdminTracksListPage from './pages/admin/tracks/AdminTracksListPage';
import AdminVehiclesListPage from './pages/admin/vehicles/AdminVehiclesListPage';
import AdminRulesListPage from './pages/admin/rules/AdminRulesListPage';
import AdminChampionshipsListPage from './pages/admin/championships/AdminChampionshipsListPage';
import AdminEventsListPage from './pages/admin/events/AdminEventsListPage';
import AdminUsersListPage from './pages/admin/users/AdminUsersListPage';
import AdminRegistrationsListPage from './pages/admin/registrations/AdminRegistrationsListPage';
import AdminResultsListPage from './pages/admin/results/AdminResultsListPage';
import AdminFilesListPage from './pages/admin/files/AdminFilesListPage';
import AdminCommentsListPage from './pages/admin/comments/AdminCommentsListPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public facing routes with general Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/championships" element={<ChampionshipsListPage />} />
            <Route path="/championships/:id" element={<ChampionshipDetailPage />} />
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route 
              path="/dashboard" // General user dashboard
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-registrations" // Specific page for user's registrations
              element={
                <ProtectedRoute>
                  <MyRegistrationsPage />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Admin routes with AdminLayout */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} /> 
            <Route path="users" element={<AdminUsersListPage />} />
            <Route path="championships" element={<AdminChampionshipsListPage />} />
            <Route path="events" element={<AdminEventsListPage />} />
            <Route path="tracks" element={<AdminTracksListPage />} />
            <Route path="vehicles" element={<AdminVehiclesListPage />} />
            <Route path="rules" element={<AdminRulesListPage />} />
            <Route path="registrations" element={<AdminRegistrationsListPage />} />
            <Route path="results" element={<AdminResultsListPage />} />
            <Route path="files" element={<AdminFilesListPage />} />
            <Route path="comments" element={<AdminCommentsListPage />} />
            {/* Add more admin sub-routes here as they are built */}
          </Route>
          
          {/* Add other top-level routes or 404 page if needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
