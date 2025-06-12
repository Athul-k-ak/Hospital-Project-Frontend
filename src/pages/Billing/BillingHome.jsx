import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";

const BillingHome = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <DashboardLayout>
        <div className="container py-4">
          <h4>Loading...</h4>
        </div>
      </DashboardLayout>
    );
  }

  const role = user.role;
  const baseRoute =
    role === "admin" ? "/admin" :
    role === "reception" ? "/reception" :
    "/";

  const cards = [];

  if (role === "admin" || role === "reception") {
    cards.push({
      title: "Create New Bill",
      desc: "Generate billing records for patients and appointments.",
      btnText: "Create Bill",
      route: `${baseRoute}/billing/create`,
      color: "primary",
    });

    cards.push({
      title: "View Billing Records",
      desc: "Check and manage all patient billing history.",
      btnText: "View Bills",
      route: `${baseRoute}/billing/records`,
      color: "success",
    });
  }

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">Billing Management</h3>
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

export default BillingHome;
