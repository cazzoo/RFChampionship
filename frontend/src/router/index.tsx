import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import GamesPage from '../pages/GamesPage';
import ChampionshipsPage from '../pages/ChampionshipsPage';
import ChampionshipDetailPage from '../pages/ChampionshipDetailPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import ManageGamesPage from '../pages/admin/ManageGamesPage';
import App from '../App'; // Assuming App is the home page content

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'games',
        element: <GamesPage />,
      },
      {
        path: 'championships',
        element: <ChampionshipsPage />,
      },
      {
        path: 'championships/:id',
        element: <ChampionshipDetailPage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        ),
      },
      {
        path: 'admin/games',
        element: (
          <AdminRoute>
            <ManageGamesPage />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

export default router;
