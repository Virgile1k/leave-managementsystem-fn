import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
  deleteProfileImage,
  resetProfileState,
  selectProfile
} from '../redux/features/profileSlice';
import Avatar from '../components/Avatar';
import toast, { Toaster } from 'react-hot-toast';
import {
  Upload as FiUpload,
  Trash2 as FiTrash2,
  Save as FiSave,
  UserCheck as FiUserCheck,
  Lock
} from 'lucide-react';
import PasswordChangeModal from '../components/modals/PasswordChangeModal';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userData, loading, error, success, message, imageUploading } = useSelector(selectProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  // Track whether an action was performed
  const [actionPerformed, setActionPerformed] = useState(false);

  // Reset profile state on component mount and unmount
  useEffect(() => {
    dispatch(resetProfileState());
    dispatch(fetchUserProfile());

    return () => {
      dispatch(resetProfileState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  // Handle success and error messages only if an action was performed
  useEffect(() => {
    if (actionPerformed && success && message) {
      toast.success(message, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: 'linear-gradient(to right, #4f46e5, #7e22ce)',
          color: '#fff',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        icon: '✅',
      });

      if (isEditing) {
        setIsEditing(false);
      }

      // Reset the action flag and profile state
      setActionPerformed(false);
      dispatch(resetProfileState());
    }

    if (actionPerformed && error) {
      toast.error(error, {
        duration: 4000,
        position: 'top-center',
        style: {
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      });

      // Reset the action flag and profile state
      setActionPerformed(false);
      dispatch(resetProfileState());
    }
  }, [success, error, message, isEditing, dispatch, actionPerformed]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setActionPerformed(true);
    dispatch(updateUserProfile(formData));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setActionPerformed(true);
      dispatch(uploadProfileImage(file));
    }
  };

  const handleImageDelete = () => {
    if (window.confirm('Are you sure you want to remove your profile image?')) {
      setActionPerformed(true);
      dispatch(deleteProfileImage());
    }
  };

  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-8 px-4">
      {/* Toast Component */}
      <Toaster />

      {/* Rest of the component remains the same */}
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-700 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500 opacity-20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 opacity-20 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white text-center relative z-10">My Profile</h2>
            <p className="text-indigo-100 text-center mt-2 relative z-10">Manage your personal information</p>
          </div>

          <div className="p-8">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <Avatar
                  src={userData?.profilePicUrl}
                  name={userData?.fullName}
                  size={120}
                  className="border-4 border-gray-200 rounded-full"
                />

                {imageUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              <div className="flex mt-4 space-x-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-sm cursor-pointer transition-all text-sm font-medium">
                  <FiUpload className="h-4 w-4" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                </label>

                {userData?.profilePicUrl && (
                  <button
                    className="flex items-center gap-2 px-4 py-2 border border-red-400 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all"
                    onClick={handleImageDelete}
                    disabled={imageUploading}
                  >
                    <FiTrash2 className="h-4 w-4" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Details Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all"
                    placeholder="Full Name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true} // Email is not editable
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    placeholder="Email Address"
                  />
                </div>
                {/* Add this block after the email input section */}
                <div className="space-y-2">
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    id="department"
                    type="text"
                    value={userData?.departmentName || 'Not Assigned'}
                    disabled={true}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>

                {userData?.departmentName && (
                  <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      id="department"
                      type="text"
                      value={userData.departmentName}
                      disabled={true}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                )}

                {userData?.manager && (
                  <div className="space-y-2">
                    <label htmlFor="manager" className="block text-sm font-medium text-gray-700">Manager</label>
                    <input
                      id="manager"
                      type="text"
                      value={userData.manager.fullName}
                      disabled={true}
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    id="role"
                    type="text"
                    value={userData?.role}
                    disabled={true}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              </div>

              <div className="pt-5 flex flex-wrap gap-3 justify-center">
                {!isEditing ? (
                  <>

                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg shadow-sm text-sm font-medium transition-all"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <Lock className="h-4 w-4" />
                      <span>Change Password</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-sm transition-all text-sm font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      className="px-4 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg shadow-sm text-sm font-medium transition-all"
                      onClick={() => {
                        setIsEditing(false);
                        if (userData) {
                          setFormData({
                            fullName: userData.fullName || '',
                            email: userData.email || '',
                          });
                        }
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default ProfilePage;