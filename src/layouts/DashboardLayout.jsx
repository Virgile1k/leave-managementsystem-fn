import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User, 
  ChevronDown,
  Clock,
  BarChart,
  Briefcase,
  Zap 
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Get user information from Redux store
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Role-based navigation items
  const getNavigationItems = () => {
    // Common navigation items for all roles
    const commonItems = [
      { name: 'Dashboard', icon: Home, href: '/dashboard', current: location.pathname === '/dashboard' },
      { name: 'Leave Calendar', icon: Calendar, href: '/leave-calendar', current: location.pathname === '/leave-calendar' },
      { name: 'My Applications', icon: FileText, href: '/my-applications', current: location.pathname === '/my-applications' },
    ];
    
    // Manager-specific items
    const managerItems = [
      { name: 'Team Overview', icon: Users, href: '/team-overview', current: location.pathname === '/team-overview' },
      { name: 'Approvals', icon: Zap, href: '/approvals', current: location.pathname === '/approvals' },
    ];
    
    // Admin-specific items
    const adminItems = [
      { name: 'User Management', icon: Users, href: '/user-management', current: location.pathname === '/user-management' },
      { name: 'Reports', icon: BarChart, href: '/reports', current: location.pathname === '/reports' },
      { name: 'Settings', icon: Settings, href: '/settings', current: location.pathname === '/settings' },
    ];
    
    // Return different navigation items based on user role
    if (user?.role === 'ADMIN') {
      return [...commonItems, ...managerItems, ...adminItems];
    } else if (user?.role === 'MANAGER') {
      return [...commonItems, ...managerItems];
    } else {
      return commonItems;
    }
  };
  
  const navigationItems = getNavigationItems();
  
  const notifications = [
    { id: 1, message: 'Your leave request has been approved', time: '5 minutes ago', isRead: false },
    { id: 2, message: 'You have 3 pending approvals', time: '1 hour ago', isRead: false },
    { id: 3, message: 'Welcome to AfriHR Leave Management System', time: '1 day ago', isRead: true },
  ];
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  const handleLogout = () => {
    // Handle logout functionality
    // dispatch(logout());
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 flex z-40">
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-br from-indigo-600 to-purple-700 transition-all transform ease-in-out duration-300">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button 
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="h-8 w-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="ml-2 text-xl font-bold text-white">AfriHR</span>
              </div>
              <nav className="mt-8 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                      item.current 
                        ? 'bg-indigo-800 text-white' 
                        : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white'}`} />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
              <button 
                className="flex-shrink-0 group block w-full text-left"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <div className="inline-block h-10 w-10 rounded-full bg-indigo-900 overflow-hidden">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-1 text-indigo-200" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-white">{user?.name || 'User Name'}</p>
                    <div className="flex items-center text-sm font-medium text-indigo-200 group-hover:text-white transition-colors duration-150">
                      <LogOut className="mr-1 h-4 w-4" />
                      Sign out
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div className="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className={`hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-64'}`}>
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="h-8 w-8 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="ml-2 text-xl font-bold text-white">AfriHR</span>
            </div>
            <nav className="mt-8 flex-1 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    item.current 
                      ? 'bg-indigo-800 text-white' 
                      : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
            <button 
              className="flex-shrink-0 group block w-full text-left"
              onClick={handleLogout}
            >
              <div className="flex items-center">
                <div className="inline-block h-10 w-10 rounded-full bg-indigo-900 overflow-hidden">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-1 text-indigo-200" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-white">{user?.name || 'User Name'}</p>
                  <div className="flex items-center text-sm font-medium text-indigo-200 group-hover:text-white transition-colors duration-150">
                    <LogOut className="mr-1 h-4 w-4" />
                    Sign out
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col md:pl-64 transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}>
        {/* Top navigation bar */}
        <div className="sticky top-0 z-10 bg-white shadow">
          <div className="flex justify-between h-16 px-4 md:px-6">
            <div className="flex items-center">
              <button
                type="button"
                className="inline-flex md:hidden items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="hidden md:inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={toggleSidebar}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="ml-4 flex items-center">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="ml-2 text-sm text-gray-500">
                  {formatDate(currentDateTime)} | {formatTime(currentDateTime)}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="relative p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="h-6 w-6" />
                  {notifications.some(n => !n.isRead) && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </button>
                
                {/* Notification dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                      <div className="mt-2 divide-y divide-gray-100">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div key={notification.id} className={`py-2 ${!notification.isRead ? 'bg-indigo-50' : ''}`}>
                              <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 py-2">No new notifications</p>
                        )}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          View all notifications
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white overflow-hidden">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user?.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden md:flex ml-2 text-sm font-medium text-gray-700">
                    {user?.name || 'User Name'}
                  </span>
                  <ChevronDown className="hidden md:block ml-1 h-4 w-4 text-gray-500" />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-700">{user?.name || 'User Name'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        <p className="text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          {user?.role || 'STAFF'}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;