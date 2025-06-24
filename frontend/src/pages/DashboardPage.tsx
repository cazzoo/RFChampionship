import React from 'react'; // Removed useState as it's no longer needed
import { useAuth } from '../contexts/AuthContext';
import FileUploadDialog from '../components/files/FileUploadDialog'; // Import FileUploadDialog
import type { FileMetadata } from '../types/file.ts'; // Import FileMetadata type
import apiClient from '../lib/apiClient'; // For updating profile
// import { toast } from 'sonner'; // Conceptual

// Conceptual Shadcn UI imports
import { Button } from '../components/ui/button';
const toast = { success: (msg: string) => alert(msg), error: (msg: string) => alert(msg) };


const DashboardPage: React.FC = () => {
  const { user, profile, loading, isAdmin } = useAuth(); // Removed fetchUserProfile and isAvatarUploadOpen
  // const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false); // Removed state

  const handleAvatarUploadSuccess = async (uploadedFile: FileMetadata) => {
    if (!user || !profile) return;

    // Construct the public URL. This might vary based on your Supabase setup.
    // Usually, it's SUPABASE_URL/storage/v1/object/public/BUCKET_NAME/FILE_PATH
    // The `uploadedFile.public_url` might already be correct if returned by backend GET /files
    // Or, if you just got storage_path and bucket, construct it:
    // const avatarUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${uploadedFile.storage_bucket}/${uploadedFile.storage_path}`;

    // For simplicity, assuming the backend /files GET endpoint (if used by FileUploadDialog on success) or the upload-complete
    // response already provides a usable public_url or helps construct it.
    // If uploadedFile.public_url isn't populated by your flow, you need to construct it here.
    // Let's assume `uploadedFile.public_url` is correctly populated by the backend or can be derived.
    // A common pattern is for the backend to return the full public URL after confirming upload.

    // For this example, let's assume uploadedFile.public_url is already the direct URL or is formed correctly by the component/hook.
    // If not, you might need to construct it.
    // const newAvatarUrl = uploadedFile.public_url; // This should be the final, accessible URL.

    // Re-construct a public URL if not directly available and assuming standard Supabase structure
    let newAvatarUrl = uploadedFile.public_url;
    if (!newAvatarUrl) {
        // This is a fallback and assumes your Supabase URL and bucket policies are set for public access like this
        newAvatarUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${uploadedFile.storage_bucket}/${uploadedFile.storage_path}`;
    }


    try {
      // Update the user's profile with the new avatar URL
      // This uses the general /api/users/me PUT endpoint from previous tasks
      await apiClient.put(`/api/users/me`, { avatar_url: newAvatarUrl });
      toast.success('Avatar updated successfully!');
      // Removed fetchUserProfile call
    } catch (error: unknown) {
      let message = 'Failed to update avatar.';
      if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: string }).message === 'string') {
        message = (error as { message: string }).message;
      }
      toast.error(`Failed to update avatar: ${message}`);
    }
  };


  if (loading && !profile) { // Show loading if profile isn't available yet
    return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
  }

  if (!user) {
    return <p className="text-center text-red-500">You are not authorized to view this page.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">User Profile</h1>

      <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg p-6 mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || user.email || 'U')}&background=random&color=fff`}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
          />
          <div>
            <h2 className="text-2xl font-semibold text-indigo-700">
              {profile?.username || user.email || 'User'}
            </h2>
            <FileUploadDialog
                triggerButtonText="Change Avatar"
                dialogTitle="Upload New Avatar"
                dialogDescription="Select an image file for your new avatar."
                bucketName="avatars"
                allowedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                maxFileSizeMB={2}
                entityType="user_profile"
                entityIdUuid={user.id}
                onUploadSuccess={handleAvatarUploadSuccess}
            />
          </div>
        </div>
        {isAdmin && (
          <p className="mt-2 p-2 bg-yellow-100 text-yellow-700 rounded-md text-sm">
            You have <span className="font-bold">Admin</span> privileges.
          </p>
        )}
      </div>

      {profile ? (
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Profile Information:</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900">{profile.username || 'Not set'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{profile.role || 'user'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900 break-all">{user.id}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {profile.website ? (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                    {profile.website}
                  </a>
                ) : 'Not set'}
              </dd>
            </div>
            {/* Avatar is now displayed above */}
          </dl>
           <div className="mt-6 text-right">
                <Button onClick={() => alert("Edit Profile functionality to be implemented!")}>
                    Edit Profile Details
                </Button>
            </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg p-6">
          <p className="text-gray-600">Profile information not yet available or fully set up.</p>
          <p className="text-gray-600 mt-2">You might need to complete your profile.</p>
        </div>
      )}
      {/* Placeholder for user-specific actions or content */}
      {/* <div className="mt-8 p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Teams & Championships</h3>
            <p className="text-gray-600">Future sections for managing your teams, registered championships, etc.</p>
      </div> */}
    </div>
  );
};

export default DashboardPage;
