import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllDepartments, 
  deleteDepartment,
  resetDepartmentState,
  selectDepartments
} from '../redux/features/departmentsSlice';
import { 
  Building as BuildingIcon, 
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash2 as TrashIcon,
  Users as UsersIcon,
  Search as SearchIcon,
  UserCheck as UserCheckIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import DepartmentFormModal from '../components/modals/DepartmentFormModal';
import { useNavigate } from 'react-router-dom';

const DepartmentsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departments, loading, error, success, message, isDeleting } = useSelector(selectDepartments);
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionPerformed, setActionPerformed] = useState(false);

  // Reset department state on component mount and unmount
  useEffect(() => {
    dispatch(resetDepartmentState());
    dispatch(fetchAllDepartments());

    return () => {
      dispatch(resetDepartmentState());
    };
  }, [dispatch]);

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

      // Reset the action flag and department state
      setActionPerformed(false);
      dispatch(resetDepartmentState());
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

      // Reset the action flag and department state
      setActionPerformed(false);
      dispatch(resetDepartmentState());
    }
  }, [success, error, message, dispatch, actionPerformed]);

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowFormModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      setActionPerformed(true);
      dispatch(deleteDepartment(id));
    }
  };

  const handleFormClose = () => {
    setShowFormModal(false);
    setEditingDepartment(null);
  };

  // Filter departments based on search query
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (dept.headName && dept.headName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading && departments.length === 0) {
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

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-700 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500 opacity-20 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500 opacity-20 rounded-full"></div>
            <div className="flex flex-col sm:flex-row justify-between items-center relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white">Departments</h2>
                <p className="text-indigo-100 mt-1">Manage company departments</p>
              </div>
              <button
                onClick={() => setShowFormModal(true)}
                className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-lg shadow hover:bg-indigo-50 transition-all text-sm font-medium"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Department</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search departments by name, description, or head"
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Departments List */}
          <div className="overflow-x-auto">
            {filteredDepartments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Head</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDepartments.map((dept) => (
                    <tr key={dept.id} className="hover:bg-indigo-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-lg">
                            <BuildingIcon className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">{dept.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dept.headName ? (
                          <div className="flex items-center">
                            <UserCheckIcon className="h-4 w-4 mr-2 text-indigo-500" />
                            <span className="text-sm text-gray-900">{dept.headName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className="text-sm text-gray-900">{dept.numberOfEmployees || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(dept)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                          >
                            <EditIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                            disabled={isDeleting}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <BuildingIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-500">No departments found</h3>
                {searchQuery ? (
                  <p className="text-gray-400 mt-2">Try adjusting your search query</p>
                ) : (
                  <p className="text-gray-400 mt-2">Create a new department to get started</p>
                )}
                {!searchQuery && (
                  <button
                    onClick={() => setShowFormModal(true)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all text-sm font-medium"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Add Department</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Department Form Modal */}
      {showFormModal && (
        <DepartmentFormModal
          isOpen={showFormModal}
          onClose={handleFormClose}
          department={editingDepartment}
          setActionPerformed={setActionPerformed}
        />
      )}
    </div>
  );
};

export default DepartmentsList;