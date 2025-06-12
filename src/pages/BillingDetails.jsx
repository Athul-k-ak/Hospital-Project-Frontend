import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BillingDetails = () => {
  const { billingId } = useParams();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendBaseURL = "http://localhost:5000"; // Use your global config if available

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const { data } = await axios.get(`${backendBaseURL}/api/billing/${billingId}`, {
          withCredentials: true,
        });
        setBilling(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load billing details");
        setLoading(false);
      }
    };
    fetchBilling();
  }, [billingId]);

  if (loading) return <div className="text-center mt-5">Loading billing details...</div>;
  if (!billing) return <div className="text-center mt-5">No billing record found.</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Billing Details</h2>
      <div className="card shadow p-4">
        <h5 className="mb-3">Patient: {billing.patientName || billing.patientId?.name}</h5>
        <p><strong>Patient ID:</strong> {billing.patientId?._id}</p>
        <p><strong>Billing Date:</strong> {new Date(billing.billingDate).toLocaleString()}</p>
        <p><strong>Details:</strong> {billing.details}</p>
        <p><strong>Amount:</strong> ₹{billing.amount.toFixed(2)}</p>
        <p><strong>Status:</strong> 
          <span className={`ms-2 badge ${billing.paymentStatus === "paid" ? "bg-success" : "bg-warning text-dark"}`}>
            {billing.paymentStatus.toUpperCase()}
          </span>
        </p>
        <p><strong>Appointment ID:</strong> {billing.appointmentId || "N/A"}</p>

        <div className="mt-4">
          <Link to="/billing" className="btn btn-outline-primary">Back to Billing</Link>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
