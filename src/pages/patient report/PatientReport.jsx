import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";


const PatientReport = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role;

  // Redirect base route based on role
  const baseRoute =
    role === "admin" ? "/admin" :
    role === "doctor" ? "/doctor" :
    role === "reception" ? "/reception" :
    "/";

  // Define cards conditionally
  const cards = [];

  // Add Report — only for Admin & Doctor
  if (role === "admin" || role === "doctor") {
    cards.push({
      title: "Add Patient Report",
      desc: "Create a medical report for a patient with diagnosis and treatment.",
      btnText: "Add Report",
      route: `${baseRoute}/patientreport/add`,
      color: "primary",
    });
  }

  // View Report — for Admin, Doctor, Reception
  if (["admin", "doctor", "reception"].includes(role)) {
    cards.push({
      title: "View Patient Reports",
      desc: "View existing patient reports with filters and search.",
      btnText: "View Reports",
      route: `${baseRoute}/patientreport/patients/list`,
      color: "success",
    });
  }

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">Patient Report Management</h3>
        <div className="row g-4">
          {cards.map((card, index) => (
            <div className="col-md-6" key={index}>
              <div className={`card border-${card.color} h-100 shadow-sm`}>
                <div className={`card-body text-${card.color}`}>
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text">{card.desc}</p>
                  <button
                    className={`btn btn-${card.color} mt-2`}
                    onClick={() => navigate(card.route)}
                  >
                    {card.btnText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientReport;
