import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// 🔓 Auth Pages
import Login from "../pages/Login";
import Signup from "../pages/Signup";

// 👑 Admin Dashboard and Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddAppointment from "../pages/admin/AddAppointment";
import AdminAppointment from "../pages/admin/Appointment";
import DoctorDetails from "../pages/admin/DoctorDetails";
import DoctorList from "../pages/admin/DoctorList";
import PatientList from "../pages/admin/PatientList";
import PatientRegister from "../pages/admin/PatientRegister";
import Register from "../pages/admin/Register";
import ViewAppointments from "../pages/admin/ViewAppointments";
import ViewAppointmentsByDoctor from "../pages/admin/ViewAppointmentsByDoctor";

// 🧾 Registration Pages
import RegisterAdmin from "../pages/register/RegisterAdmin";
import RegisterDoctor from "../pages/register/RegisterDoctor";
import RegisterReception from "../pages/register/RegisterReception";
import RegisterStaff from "../pages/register/RegisterStaff";

// 🩺 Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import MyAppointments from "../pages/doctor/MyAppointments";

// 🧪 Patient Report Pages
import AddPatientReport from "../pages/patient report/AddPatientReport";
import PatientReport from "../pages/patient report/PatientReport";
import PatientReportView from "../pages/patient report/PatientReportView";
import ViewReportsPage from "../pages/patient report/ViewReportsPage";

// 💵 Billing Pages
import AddBill from "../pages/Billing/AddBill";
import BillingDetails from "../pages/BillingDetails";
import BillingHome from "../pages/Billing/BillingHome";
import BillingPayment from "../pages/BillingPayment";
import CreateBill from "../pages/CreateBill";
import Billing from "../pages/Billing";

// 🩸 Blood Bank Pages
import BloodAvailability from "../pages/BloodBank/BloodAvailability";
import BloodBankHome from "../pages/BloodBank/BloodBankHome";
import BloodStockList from "../pages/BloodBank/BloodStockList";
import RegisterBlood from "../pages/BloodBank/RegisterBlood";

// 🎧 Reception Dashboard
import ReceptionDashboard from "../pages/reception/ReceptionDashboard";

// 🔐 Protected Route Wrapper
const ProtectedRoute = ({ element, role }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/" replace />;
  const allowedRoles = Array.isArray(role) ? role : [role];
  return allowedRoles.includes(user.role) ? element : <Navigate to="/" replace />;
};

// 🚦 App Routes
const AppRoutes = () => {
  const adminRoutes = [
    { path: "/admin-dashboard", element: <AdminDashboard /> },
    { path: "/admin/register", element: <Register /> },
    { path: "/admin/patient-register", element: <PatientRegister /> },
    { path: "/admin/patient-list", element: <PatientList /> },
    { path: "/admin/appointment", element: <AdminAppointment /> },
    { path: "/admin/appointment/book", element: <AddAppointment /> },
    { path: "/admin/view-appointments", element: <ViewAppointments /> },
    { path: "/admin/appointment/by-doctor", element: <ViewAppointmentsByDoctor /> },

    { path: "/admin/doctor-list", element: <DoctorList /> },
    { path: "/admin/doctor-details/:id", element: <DoctorDetails /> },
    { path: "/admin/register-admin", element: <RegisterAdmin /> },
    { path: "/admin/register-reception", element: <RegisterReception /> },
    { path: "/admin/register-doctor", element: <RegisterDoctor /> },
    { path: "/admin/register-staff", element: <RegisterStaff /> },

    { path: "/admin/patient-report", element: <PatientReport /> },
    { path: "/admin/patientreport/add", element: <AddPatientReport /> },
    { path: "/admin/patientreport/view", element: <ViewReportsPage /> },
    { path: "/admin/patientreport/patients/list", element: <ViewReportsPage /> },
    { path: "/admin/patientreport/:patientId", element: <PatientReportView /> },

    { path: "/admin/billing", element: <BillingHome /> },
    { path: "/admin/billing/create", element: <AddBill /> },
    { path: "/admin/billing/pay/:billingId", element: <BillingPayment /> },
    { path: "/admin/billing/details/:billingId", element: <BillingDetails /> },

    { path: "/admin/bloodbank", element: <BloodBankHome /> },
    { path: "/admin/bloodbank/availability", element: <BloodAvailability /> },
    { path: "/admin/bloodbank/stock", element: <BloodStockList /> },
    { path: "/admin/bloodbank/register", element: <RegisterBlood /> },
  ];

  const receptionRoutes = [
    { path: "/reception-dashboard", element: <ReceptionDashboard /> },
    { path: "/reception/patient-register", element: <PatientRegister /> },
    { path: "/reception/patient-list", element: <PatientList /> },
    { path: "/reception/appointment", element: <AdminAppointment /> },
    { path: "/reception/appointment/book", element: <AddAppointment /> },
    { path: "/reception/view-appointments", element: <ViewAppointments /> },
    { path: "/reception/appointment/by-doctor", element: <ViewAppointmentsByDoctor /> },

    { path: "/reception/doctor-list", element: <DoctorList /> },
    { path: "/reception/doctor-details/:id", element: <DoctorDetails /> },

    { path: "/reception/patient-report", element: <PatientReport /> },

    { path: "/reception/billing", element: <Billing /> },
    { path: "/reception/billing/create", element: <CreateBill /> },
    { path: "/reception/billing/pay/:billingId", element: <BillingPayment /> },

    { path: "/reception/bloodbank", element: <BloodBankHome /> },
    { path: "/reception/bloodbank/availability", element: <BloodAvailability /> },
    { path: "/reception/bloodbank/stock", element: <BloodStockList /> },
    { path: "/reception/bloodbank/register", element: <RegisterBlood /> },

    { path: "/reception/patientreport/view", element: <ViewReportsPage /> },
    { path: "/reception/patientreport/patients/list", element: <ViewReportsPage /> },
    { path: "/reception/patientreport/:patientId", element: <PatientReportView /> },



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
        {adminRoutes.map((route, i) => (
          <Route
            key={`admin-${i}`}
            path={route.path}
            element={<ProtectedRoute element={route.element} role="admin" />}
          />
        ))}

        {/* 🎧 Reception Routes */}
        {receptionRoutes.map((route, i) => (
          <Route
            key={`reception-${i}`}
            path={route.path}
            element={<ProtectedRoute element={route.element} role="reception" />}
          />
        ))}

        {/* 🩺 Doctor Routes */}
        {doctorRoutes.map((route, i) => (
          <Route
            key={`doctor-${i}`}
            path={route.path}
            element={<ProtectedRoute element={route.element} role="doctor" />}
          />
        ))}

        {/* 🔄 Shared Route */}
        <Route
          path="/shared/patient-register"
          element={<ProtectedRoute element={<PatientRegister />} role={["admin", "reception"]} />}
        />

        {/* 🔍 Shared Doctor Detail Route */}
        <Route
          path="/doctors/:id"
          element={<ProtectedRoute element={<DoctorDetails />} role={["admin", "reception"]} />}
        />

        {/* ❌ Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
