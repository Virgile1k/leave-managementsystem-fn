import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createUser, 
  updateUser,
  selectUsers,
  getAllManagers
} from '../../redux/features/usersSlice';
import { X as XIcon } from 'lucide-react';
import { fetchAllDepartments } from '../../redux/features/departmentsSlice';

const UserFormModal = ({ isOpen, onClose, user = null, setActionPerformed }) => {
  const dispatch = useDispatch();
  const { loading, managers } = useSelector(selectUsers);
  const { departments } = useSelector(state => state.departments);
  
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    role: 'EMPLOYEE',
    profilePicUrl: '',
    managerId: '',
    departmentId: ''
  });
  
  // Fetch managers and departments when modal is opened
  useEffect(() => {
    if (isOpen) {
      dispatch(getAllManagers());
      dispatch(fetchAllDepartments());
    }
  }, [isOpen, dispatch]);
  
  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        fullName: user.fullName || '',
        password: '', // Don't populate password field when editing
        role: user.role || 'EMPLOYEE',
        profilePicUrl: user.profilePicUrl || '',
        managerId: user.manager?.id || '',
        departmentId: user.departmentId || ''
      });
    } else {
      // Reset form when creating a new user
      setFormData({
        email: '',
        fullName: '',
        password: '',
        role: 'EMPLOYEE',
        profilePicUrl: '',
        managerId: '',
        departmentId: ''
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare payload - Exclude empty values and password if not provided
    const payload = {
      email: formData.email,
      fullName: formData.fullName,
      role: formData.role
    };
    
    // Include password only if provided (required for new users)
    if (formData.password) {
      payload.password = formData.password;
    }
    
    // Include optional fields only if they have values
    if (formData.profilePicUrl) {
      payload.profilePicUrl = formData.profilePicUrl;
    }
    
    if (formData.managerId) {
      payload.managerId = formData.managerId;
    }
    
    if (formData.departmentId) {
      payload.departmentId = formData.departmentId;
    }

    setActionPerformed(true);
    
    if (user) {
      // Update existing user
      dispatch(updateUser({ id: user.id, userData: payload }));
    } else {
      // Create new user
      dispatch(createUser(payload));
    }
    
    onClose();
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Center modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Modal header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-white">
              {user ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-200 transition-colors focus:outline-none"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Modal body */}
          <div className="bg-white px-6 py-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter email address"
                  disabled={user !== null} // Email can't be changed for existing users
                />
              </div>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password {user ? '(Leave empty to keep current password)' : '*'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!user} // Password is required only for new users
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={user ? "Leave empty to keep current password" : "Enter password"}
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="profilePicUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  id="profilePicUrl"
                  name="profilePicUrl"
                  value={formData.profilePicUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter profile picture URL (optional)"
                />
              </div>
              
              <div>
                <label htmlFor="managerId" className="block text-sm font-medium text-gray-700 mb-1">
                  Manager
                </label>
                <select
                  id="managerId"
                  name="managerId"
                  value={formData.managerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No Manager</option>
                  {managers.map(manager => (
                    <option key={manager.id} value={manager.id}>
                      {manager.fullName} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No Department</option>
                  {departments?.map(department => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {user ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{user ? 'Update User' : 'Create User'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;