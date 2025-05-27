import React from 'react';
// import { useAuth } from '../contexts/AuthContext'; // If you need user/profile info here

const AdminPage: React.FC = () => {
  // const { user, profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-700">Welcome to the Admin Dashboard.</p>
        <p className="mt-4">This area is restricted to users with administrative privileges.</p>
        <p className="mt-2">Here you can manage championships, events, users, and other platform settings.</p>
        
        {/* Placeholder for admin functionalities */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Quick Actions:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><button className="text-indigo-600 hover:text-indigo-800">Manage Users</button></li>
            <li><button className="text-indigo-600 hover:text-indigo-800">Create New Championship</button></li>
            <li><button className="text-indigo-600 hover:text-indigo-800">View System Logs</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
