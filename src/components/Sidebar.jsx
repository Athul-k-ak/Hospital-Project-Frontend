import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaHome, FaUserMd, FaNotesMedical, FaUserPlus,
  FaCalendarCheck, FaFileInvoiceDollar, FaBars,
  FaSignOutAlt, FaMoon, FaSun, FaTint, FaUsers
} from "react-icons/fa";
import { clearUser } from "../redux/authSlice";
import { toast } from "react-toastify";
import "../styles/sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.getAttribute("data-bs-theme") === "dark"
  );

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) return <div className="sidebar">Loading...</div>;

  const { role } = user;

  // Sidebar Links
  const adminLinks = [
    { path: "/admin-dashboard", label: "Home", icon: <FaHome /> },
    { path: "/admin/register", label: "Register", icon: <FaUserPlus /> },
    { path: "/admin/patient-register", label: "Patient Register", icon: <FaUserMd /> },
    { path: "/admin/patient-list", label: "Patient List", icon: <FaNotesMedical /> },
    { path: "/admin/doctor-list", label: "Doctor List", icon: <FaUserMd /> },
    { path: "/admin/patient-report", label: "Patient Report", icon: <FaFileInvoiceDollar /> },
    { path: "/admin/appointment", label: "Appointments", icon: <FaCalendarCheck /> },
    { path: "/admin/bloodbank", label: "Blood Bank", icon: <FaTint /> },
    { path: "/admin/staff/list", label: "Staff", icon: <FaUsers /> },
  ];

  const receptionLinks = [
    { path: "/reception-dashboard", label: "Home", icon: <FaHome /> },
    { path: "/reception/patient-register", label: "Patient Register", icon: <FaUserMd /> },
    { path: "/reception/patient-list", label: "Patient List", icon: <FaNotesMedical /> },
    { path: "/reception/doctor-list", label: "Doctor List", icon: <FaUserMd /> },
    { path: "/reception/appointment", label: "Appointments", icon: <FaCalendarCheck /> },
    { path: "/reception/patient-report", label: "Patient Report", icon: <FaFileInvoiceDollar /> },
    { path: "/reception/bloodbank", label: "Blood Bank", icon: <FaTint /> },
    { path: "/reception/staff/list", label: "Staff", icon: <FaUsers /> },
  ];

  const doctorLinks = [
    { path: "/doctor-dashboard", label: "Home", icon: <FaHome /> },
    { path: "/doctor/appointments", label: "My Appointments", icon: <FaCalendarCheck /> },
    { path: "/doctor/patient-reports", label: "Patient Reports", icon: <FaNotesMedical /> },
  ];

  const links = role === "admin" ? adminLinks : role === "reception" ? receptionLinks : doctorLinks;

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
      {/* Header */}
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </button>
      </div>

      {/* Links */}
      <div className="sidebar-scroll">
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
      </div>
    </div>
  );
};

export default Sidebar;
