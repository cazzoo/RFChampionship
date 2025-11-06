import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, isLoading } = useAuth();

  return (
    <div>
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">//RF//Championship</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/games">Games</Link></li>
            <li><Link to="/championships">Championships</Link></li>
            {isLoading ? (
              <li><p>Loading...</p></li>
            ) : user ? (
              <>
                {user.roles.includes('ROLE_ADMIN') && (
                  <li><Link to="/admin">Admin</Link></li>
                )}
                <li>
                  <details>
                    <summary>
                      Profile
                    </summary>
                    <ul className="p-2 bg-base-100 rounded-t-none">
                      <li><Link to="/profile">My Profile</Link></li>
                      {/* Logout is on profile page, but could be here too */}
                    </ul>
                  </details>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
