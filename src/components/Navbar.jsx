import React, { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { clearUser } from "../redux/authSlice";
import "../styles/Navbar.css";

const Navbar = ({ darkMode, setDarkMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(clearUser());
    navigate("/login");
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    document.documentElement.setAttribute("data-bs-theme", newMode ? "dark" : "light");
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="brand-name">KRL Health Care</h2>
      </div>

      <div className="navbar-right">
        <FaBell className="nav-icon" title="Notifications" />

        <div className="profile-container" ref={dropdownRef}>
          <div
            className="nav-icon profile-icon-wrapper"
            onClick={() => setShowDropdown(!showDropdown)}
            title="Profile"
          >
           {user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="profile-pic" />
            ) : (
              <FaUserCircle className="profile-pic-icon" />
            )}
          </div>

          {showDropdown && (
            <div className="dropdown-card animate-dropdown">
              <div className="profile-info">
              {user?.profilePic ? (
                  <img src={user.profilePic} alt="Profile" className="profile-pic-large" />
                ) : (
                  <FaUserCircle className="profile-pic-icon-large" />
                )}

                <div>
                  <h5>{user?.name || "User Name"}</h5>
                  <small>{user?.role}</small>
                </div>
              </div>

              <div className="dropdown-option" onClick={toggleTheme}>
                {darkMode ? <FaSun /> : <FaMoon />}
                <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
              </div>

              <div className="dropdown-option" onClick={handleLogout}>
                <FaSignOutAlt />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
