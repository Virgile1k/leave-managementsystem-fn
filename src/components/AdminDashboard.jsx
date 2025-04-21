 // src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { useNavigate, Link, Routes, Route } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage.jsx';

// Dashboard Home Content Component
const DashboardHome = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>
    <p className="text-gray-600">Welcome to your AfriHR dashboard. You are successfully logged in!</p>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeLink, setActiveLink] = useState('dashboard');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigation = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">AfriHR</span>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4">
              <p className="text-sm text-gray-600">Welcome, {user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md text-sm hover:bg-indigo-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-sm">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link 
                  to="/dashboard"
                  onClick={() => handleNavigation('dashboard')}
                  className={`block px-4 py-2 rounded-md ${activeLink === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard/profile"
                  onClick={() => handleNavigation('profile')}
                  className={`block px-4 py-2 rounded-md ${activeLink === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  Profile
                </Link>
              </li>
              {/* Add more navigation items as needed */}
            </ul>
          </nav>
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;