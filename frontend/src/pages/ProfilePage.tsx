import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    // No need to redirect here, the protected route will do it.
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button className="btn btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="mt-4">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
      </div>

      {/* The registered championships logic can be moved here from the old implementation */}
      {/* For now, I'll keep it simple */}
    </div>
  );
};

export default ProfilePage;
