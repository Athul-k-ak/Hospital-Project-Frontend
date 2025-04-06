import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaHome, FaUserMd, FaNotesMedical, FaUserPlus,
  FaCalendarCheck, FaFileInvoiceDollar, FaBars,
  FaSignOutAlt, FaMoon, FaSun,
} from "react-icons/fa";
import { clearUser } from "../redux/authSlice";
import "../styles/sidebar.css";
import { toast } from "react-toastify";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.getAttribute("data-bs-theme") === "dark"
  );

  // Collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return <div className="sidebar">Loading...</div>;

  const { role } = user;

  const adminLinks = [
    { path: "/admin-dashboard", label: "Home", icon: <FaHome /> },
    { path: "/admin/register", label: "Register", icon: <FaUserPlus /> },
    { path: "/admin/patient-register", label: "Patient Register", icon: <FaUserMd /> },
    { path: "/admin/patient-list", label: "Patient List", icon: <FaNotesMedical /> },
    { path: "/admin/patient-report", label: "Patient Report", icon: <FaFileInvoiceDollar /> },
    { path: "/admin/appointment", label: "Appointments", icon: <FaCalendarCheck /> },
    { path: "/admin/billing", label: "Billing", icon: <FaFileInvoiceDollar /> },
  ];

  const receptionLinks = [
    { path: "/reception-dashboard", label: "Home", icon: <FaHome /> },
    { path: "/reception/patient-register", label: "Patient Register", icon: <FaUserMd /> },
    { path: "/reception/patient-list", label: "Patient List", icon: <FaNotesMedical /> },
    { path: "/reception/appointment", label: "Appointments", icon: <FaCalendarCheck /> },
    { path: "/reception/billing", label: "Billing", icon: <FaFileInvoiceDollar /> },
  ];

  const doctorLinks = [
    { path: "/doctor-dashboard", label: "Home", icon: <FaHome /> },
    { path: "/doctor/appointment", label: "Appointments", icon: <FaCalendarCheck /> },
    { path: "/doctor/patient-reports", label: "Patient Reports", icon: <FaNotesMedical /> },
  ];

  const links =
    role === "admin" ? adminLinks :
    role === "reception" ? receptionLinks :
    doctorLinks;

  const handleLogout = () => {
    dispatch(clearUser());
    toast.success("Logout successful!");
    navigate("/login");
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    setDarkMode(!darkMode);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Header with toggle */}
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>

      {/* Main Links */}
      <div className="sidebar-content">
        <ul className="sidebar-links">
          {links.map((link, index) => (
            <li key={index} className={location.pathname === link.path ? "active" : ""}>
              <Link to={link.path}>
                {link.icon}
                <span className="link-text">{!collapsed && link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Buttons */}
     
    </div>
  );
};

export default Sidebar;
