import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clearUser } from "../redux/authSlice"; // Adjust path if needed
import "../styles/Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="brand-name">KRL Health Care</h2>
      </div>
      <div className="navbar-right">
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        <FaBell className="nav-icon" />
        <FaUserCircle className="nav-icon" />
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
