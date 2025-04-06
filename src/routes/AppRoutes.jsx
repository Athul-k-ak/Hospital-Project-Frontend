import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";

// Dashboards
import AdminDashboard from "../pages/admin/AdminDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ReceptionDashboard from "../pages/reception/ReceptionDashboard";
import PatientList from "../pages/PatientList";
import AdminAppointment from "../pages/Appointment"
// Register Pages
import Register from "../pages/admin/Register";
import PatientRegister from "../pages/PatientRegister";
// import RegisterAdmin from "../pages/admin/RegisterAdmin";
// import RegisterDoctor from "../pages/doctor/RegisterDoctor";
// import RegisterReception from "../pages/reception/RegisterReception";
// import RegisterStaff from "../pages/staff/RegisterStaff";

// 🔐 Protected Route Component
const ProtectedRoute = ({ element, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/" replace />;

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (role && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return element;
};

// 🔁 All App Routes
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboards */}
        {/* Admin */}

        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} role="admin" />}
        />
         <Route 
          path="admin/patient-register"
          element={<ProtectedRoute element={<PatientRegister />} role="admin" />}
         />
         <Route
          path="/admin/patient-list"
          element={<ProtectedRoute element={<PatientList />} role="admin" />}
        />
        <Route
          path="admin/appointment"
          element={<ProtectedRoute element={<AdminAppointment />} role="admin" />}
        />

        {/* Doctor */}
         <Route
          path="/doctor-dashboard"
          element={<ProtectedRoute element={<DoctorDashboard />} role="doctor" />}
        />

        {/* Reception */}
        <Route
          path="/reception-dashboard"
          element={<ProtectedRoute element={<ReceptionDashboard />} role="reception" />}
        />
          <Route 
          path="reception/patient-register"
          element={<ProtectedRoute element={<PatientRegister />} role="reception" />}
         />
         <Route
          path="/reception/patient-list"
          element={<ProtectedRoute element={<PatientList />} role="reception" />}
        />

        {/* Register Pages */}
        <Route
          path="/admin/register"
          element={<ProtectedRoute element={<Register />} role="admin" />}
        />
        <Route
          path="admin/patient-register"
          element={<ProtectedRoute element={<PatientRegister />} role={["admin", "reception"]} />}
        />

        {/* Optional Future Routes */}
        {/* <Route path="/admin/register-admin" element={<ProtectedRoute element={<RegisterAdmin />} role="admin" />} />
        <Route path="/register-doctor" element={<ProtectedRoute element={<RegisterDoctor />} role="admin" />} />
        <Route path="/register-reception" element={<ProtectedRoute element={<RegisterReception />} role="admin" />} />
        <Route path="/register-staff" element={<ProtectedRoute element={<RegisterStaff />} role="admin" />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
