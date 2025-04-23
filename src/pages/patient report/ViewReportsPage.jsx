import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/DashboardLayout";

const ViewReportsPage = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role;

  // Redirect if user is not allowed
  if (!["admin", "doctor", "reception"].includes(role)) {
    navigate("/");
    return null;
  }

  // Determine base route
  const baseRoute =
    role === "admin"
      ? "/admin"
      : role === "doctor"
      ? "/doctor"
      : role === "reception"
      ? "/reception"
      : "";

  useEffect(() => {
    const fetchPatientsWithReports = async () => {
      try {
        const res = await axiosInstance.get("/patientreport/patients/list");
        setPatients(res.data.patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatientsWithReports();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h3 className="mb-3">Patients With Reports</h3>
        <ul className="list-group">
          {patients.map((patient) => (
            <li
              key={patient._id}
              className="list-group-item list-group-item-action"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`${baseRoute}/patientreport/${patient._id}`)} // 🧠 Role-based route
            >
              {patient.name}
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default ViewReportsPage;
