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
import PatientList from "../pages/admin/PatientList";
import PatientRegister from "../pages/admin/PatientRegister";
import AdminAppointment from "../pages/admin/Appointment";
import AddAppointment from "../pages/admin/AddAppointment";
import ViewAppointments from "../pages/admin/ViewAppointments";

// 🧑‍💼 Admin Pages
import Register from "../pages/admin/Register";
import DoctorList from "../pages/admin/DoctorList";
import DoctorDetails from "../pages/admin/DoctorDetails";
import RegisterAdmin from "../pages/register/RegisterAdmin";
import RegisterReception from "../pages/register/RegisterReception";
import RegisterDoctor from "../pages/register/RegisterDoctor";
import RegisterStaff from "../pages/register/RegisterStaff";
import ViewAppointmentsByDoctor from "../pages/admin/ViewAppointmentsByDoctor";

// 🩺 Doctor Pages
import MyAppointments from "../pages/doctor/MyAppointments";
import PatientReport from "../pages/patient report/PatientReport";
import AddPatientReport from "../pages/patient report/AddPatientReport";
import ViewReportsPage from "../pages/patient report/ViewReportsPage";
import PatientReportView from "../pages/patient report/PatientReportView";

// 💵 Billing Pages
import Billing from "../pages/Billing";
import AddBilling from "../pages/AddBilling";
import PaymentPage from "../pages/PaymentPage"; // 👈 new page

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
    { path: "/admin/patient-report", element: <PatientReport /> },
    { path: "/admin/patientreport/add", element: <AddPatientReport /> },
    { path: "/admin/patientreport/view", element: <ViewReportsPage /> },
    { path: "/admin/patientreport/patients/list", element: <ViewReportsPage /> },
    { path: "/admin/patientreport/:patientId", element: <PatientReportView /> },
    { path: "/admin/billing", element: <Billing /> },
    { path: "/admin/billing/create", element: <AddBilling /> },
    { path: "/admin/billing/payment/:id", element: <PaymentPage /> }, // 👈 Payment route
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
    { path: "/reception/patient-report", element: <PatientReport /> },
    { path: "/reception/billing", element: <Billing /> },
    { path: "/reception/billing/create", element: <AddBilling /> },
    { path: "/reception/billing/:id", element: <PaymentPage /> }, // 👈 Payment route
  ];

  const doctorRoutes = [
    { path: "/doctor-dashboard", element: <DoctorDashboard /> },
    { path: "/doctor/appointments", element: <MyAppointments /> },
    { path: "/doctor/patient-reports", element: <PatientReport /> },
    { path: "/doctor/patientreport/add", element: <AddPatientReport /> },
    { path: "/doctor/patientreport/patients/list", element: <ViewReportsPage /> },
    { path: "/doctor/patientreport/:patientId", element: <PatientReportView /> },
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

        {/* 🩺 Doctor Routes */}
        {doctorRoutes.map((route, index) => (
          <Route
            key={`doctor-${index}`}
            path={route.path}
            element={<ProtectedRoute element={route.element} role="doctor" />}
          />
        ))}

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
