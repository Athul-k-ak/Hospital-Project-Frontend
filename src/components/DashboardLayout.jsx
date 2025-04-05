import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/dashboard.css";

const DashboardLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="dashboard-layout">
      {/* Top Full Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="layout-body">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Shifted Main Content */}
        <div className="main-content">
          <div className="content-wrapper">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
