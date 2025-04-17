import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../pages/LoginPage.jsx"

const AllRoutes = () => {
  return (
    <Routes>
      {/* Only Landing Page Route */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Fallback Route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AllRoutes;