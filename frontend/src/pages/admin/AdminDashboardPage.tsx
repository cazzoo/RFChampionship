import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="menu bg-base-100 w-56">
        <li><Link to="/admin/games">Manage Games</Link></li>
        <li><Link to="/admin/championships">Manage Championships</Link></li>
        {/* Add links to other admin pages here */}
      </ul>
    </div>
  );
};

export default AdminDashboardPage;
