 // src/routes/index.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import Dashboard from "../components/AdminDashboard.jsx"; // You'll need to create this
import ProtectedRoute from "./ProtectedRoute.jsx";
import MicrosoftCallback from "../components/MicrosoftCallback.jsx"
import ProfilePage from "../pages/ProfilePage.jsx"
import DepartmentsList from "../components/DepartmentsList.jsx";
import UsersPage from "../pages/UsersPage.jsx"

const AllRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
    
      <Route path="/login" element={<LoginPage />} />
      <Route path="/userprofile" element={<ProfilePage/>} />
      <Route path="/departments" element={<DepartmentsList />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/api/v1/auth/microsoft/callback" element={<MicrosoftCallback />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback Route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AllRoutes;