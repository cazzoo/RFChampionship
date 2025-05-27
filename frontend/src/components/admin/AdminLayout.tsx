import React, { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
// Using a subset of lucide-react icons for brevity, add others as needed
import { 
    Home, Shield, Trophy, CalendarDays, Car, Scale, Users, ListOrdered, 
    BarChart3, Settings, UploadCloud, MessageSquare // Added UploadCloud, MessageSquare
} from 'lucide-react'; 

interface AdminLayoutProps {
  children?: ReactNode; 
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  // Updated navItems to match implemented pages
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/championships', label: 'Championships', icon: Trophy },
    { href: '/admin/events', label: 'Events', icon: CalendarDays },
    { href: '/admin/tracks', label: 'Tracks', icon: Car }, 
    { href: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { href: '/admin/rules', label: 'Rules', icon: Scale },
    { href: '/admin/registrations', label: 'Registrations', icon: ListOrdered },
    { href: '/admin/results', label: 'Results', icon: BarChart3 },
    { href: '/admin/files', label: 'Files', icon: UploadCloud },
    { href: '/admin/comments', label: 'Comments', icon: MessageSquare },
    // { href: '/admin/settings', label: 'Settings', icon: Settings }, // Future item
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-2 flex flex-col">
        <div>
            <h2 className="text-2xl font-semibold mb-6 px-2">Admin Panel</h2>
            <nav>
            <ul>
                {navItems.map((item) => (
                <li key={item.href}>
                    <Link
                    to={item.href}
                    className={`flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors ${
                        // Check for active link, including sub-routes for parent items if desired
                        (location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href))) 
                        ? 'bg-gray-900 font-semibold' 
                        : ''
                    }`}
                    >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.label}</span>
                    </Link>
                </li>
                ))}
            </ul>
            </nav>
        </div>
        <div className="mt-auto pt-4 border-t border-gray-700">
             <Link to="/" className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 transition-colors">
                <Shield className="h-5 w-5 flex-shrink-0" />
                <span>Back to Main Site</span>
            </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children || <Outlet />} 
      </main>
    </div>
  );
};

export default AdminLayout;
