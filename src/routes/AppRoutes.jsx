import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// 🔓 Auth Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";

// 🧭 Dashboards
import AdminDashboard from "../pages/admin/AdminDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ReceptionDashboard from "../pages/reception/ReceptionDashboard";

// 📝 Common Pages
import PatientList from "../pages/PatientList";
import PatientRegister from "../pages/PatientRegister";
import AdminAppointment from "../pages/Appointment";
import AddAppointment from "../pages/AddAppointment";
import ViewAppointments from "../pages/ViewAppointments";


// 🧑‍💼 Admin Pages
import Register from "../pages/admin/Register";
import DoctorList from "../pages/DoctorList";
import DoctorDetails from "../pages/DoctorDetails";
import RegisterAdmin from "../pages/register/RegisterAdmin";
import RegisterReception from "../pages/register/RegisterReception";
import RegisterDoctor from "../pages/register/RegisterDoctor";
import RegisterStaff from "../pages/register/RegisterStaff";
import ViewAppointmentsByDoctor from "../pages/ViewAppointmentsByDoctor";

// 🔐 Protected Route Wrapper
const ProtectedRoute = ({ element, role }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/" replace />;
  const allowedRoles = Array.isArray(role) ? role : [role];
  return allowedRoles.includes(user.role) ? element : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const adminRoutes = [
    { path: "/admin-dashboard", element: <AdminDashboard /> },
    { path: "/admin/register", element: <Register /> },
    { path: "/admin/patient-register", element: <PatientRegister /> },
    { path: "/admin/patient-list", element: <PatientList /> },
    { path: "/admin/appointment", element: <AdminAppointment /> },
    { path: "/admin/appointment/book", element: <AddAppointment /> },
    { path: "/admin/doctor-list", element: <DoctorList /> },
    { path: "/admin/doctor-details/:id", element: <DoctorDetails /> },
    { path: "/admin/register-admin", element: <RegisterAdmin /> },
    { path: "/admin/register-reception", element: <RegisterReception /> },
    { path: "/admin/register-doctor", element: <RegisterDoctor /> },
    { path: "/admin/register-staff", element: <RegisterStaff /> },
    { path: "/admin/view-appointments", element: <ViewAppointments /> },
    { path: "/admin/appointment/by-doctor", element: <ViewAppointmentsByDoctor /> },

  ];

  const receptionRoutes = [
    { path: "/reception-dashboard", element: <ReceptionDashboard /> },
    { path: "/reception/patient-register", element: <PatientRegister /> },
    { path: "/reception/patient-list", element: <PatientList /> },
    { path: "/reception/appointment", element: <AdminAppointment /> },
    { path: "/reception/appointment/book", element: <AddAppointment /> },
    { path: "/reception/doctor-list", element: <DoctorList /> },
    { path: "/reception/doctor-details/:id", element: <DoctorDetails /> },
    { path: "/reception/view-appointments", element: <ViewAppointments /> },
  ];

  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 👑 Admin Routes */}
        {adminRoutes.map((route, index) => (
          <Route
            key={`admin-${index}`}
            path={route.path}
            element={<ProtectedRoute element={route.element} role="admin" />}
          />
        ))}

        {/* 🧾 Reception Routes */}
        {receptionRoutes.map((route, index) => (
          <Route
            key={`reception-${index}`}
            path={route.path}
            element={<ProtectedRoute element={route.element} role="reception" />}
          />
        ))}

        {/* 🩺 Doctor Route */}
        <Route
          path="/doctor-dashboard"
          element={<ProtectedRoute element={<DoctorDashboard />} role="doctor" />}
        />

        {/* ✅ Shared Route (Admin + Reception) */}
        <Route
          path="/shared/patient-register"
          element={<ProtectedRoute element={<PatientRegister />} role={["admin", "reception"]} />}
        />

        {/* 🔍 Shared Doctor Details Route (optional fallback) */}
        <Route
          path="/doctors/:id"
          element={<ProtectedRoute element={<DoctorDetails />} role={["admin", "reception"]} />}
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
