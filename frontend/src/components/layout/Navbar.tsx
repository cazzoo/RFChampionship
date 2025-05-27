import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

const Navbar: React.FC = () => {
  const { user, logout, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Redirect to home or login page after logout
    } catch (error) {
      console.error('Failed to logout:', error);
      // Handle logout error (e.g., show a notification)
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-indigo-400 transition-colors">GamePlatform</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/championships" className="hover:text-gray-300">Championships</Link>
          <Link to="/events" className="hover:text-gray-300">Events</Link>
          
          {loading ? (
            <span className="text-sm">Loading...</span>
          ) : user ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Profile</Link> 
              <Link to="/my-registrations" className="hover:text-gray-300">My Registrations</Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-yellow-400">Admin Panel</Link> 
              )}
              <button 
                onClick={handleLogout} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
