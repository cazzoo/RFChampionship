import React from 'react';
// AdminLayout will be the parent, so no need to import it here directly for rendering
// import { useAuth } from '../../contexts/AuthContext'; // If specific auth details are needed on dashboard

const AdminDashboardPage: React.FC = () => {
  // const { user, profile } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Stats Cards - These would ideally fetch data */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">123</p> {/* Placeholder */}
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Active Championships</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">5</p> {/* Placeholder */}
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">Pending Registrations</h2>
          <p className="text-3xl font-bold text-indigo-600 mt-2">12</p> {/* Placeholder */}
        </div>
      </div>
      <div className="mt-8 bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        {/* Placeholder for recent activity log or list */}
        <ul className="space-y-2">
          <li className="text-sm text-gray-600">User 'john.doe' registered for 'Summer Sprint'.</li>
          <li className="text-sm text-gray-600">Championship 'Winter League' was updated.</li>
          <li className="text-sm text-gray-600">New track 'Mountain Pass' added.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
