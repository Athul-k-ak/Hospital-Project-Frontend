import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/admin/AdminDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ReceptionDashboard from "../pages/reception/ReceptionDashboard";

const ProtectedRoute = ({ element, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/" replace />; // Redirect if not logged in
  if (role && user.role !== role) return <Navigate to="/" replace />; // Redirect if role mismatch

  return element;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} role="admin" />}
        />
        <Route
          path="/doctor-dashboard"
          element={<ProtectedRoute element={<DoctorDashboard />} role="doctor" />}
        />
        <Route
          path="/reception-dashboard"
          element={<ProtectedRoute element={<ReceptionDashboard />} role="reception" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
