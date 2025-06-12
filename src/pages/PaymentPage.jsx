// src/pages/BillingPayment.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const { billingId } = useParams();
  const navigate = useNavigate();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await axiosInstance.get(`/billing/${billingId}`);
        setBilling(res.data.billing);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, [billingId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      const res = await axiosInstance.post("/payment/order", {
        billingId,
      });

      const { order } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Hospital Billing",
        description: billing.details,
        order_id: order.id,
        handler: async (response) => {
          try {
            await axiosInstance.post("/payment/verify", {
              billingId,
              ...response,
            });

            toast.success("Payment successful!");
            navigate(`/billing/${billingId}`);
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment error");
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h4>Pay Bill</h4>
        {loading ? (
          <p>Loading billing details...</p>
        ) : billing ? (
          <div className="card p-3">
            <h5>Patient ID: {billing.patientId?.name || billing.patientId}</h5>
            <p>Amount: ₹{billing.amount}</p>
            <p>Details: {billing.details}</p>
            <button className="btn btn-success mt-3" onClick={handlePayment}>
              Pay Now
            </button>
          </div>
        ) : (
          <p>Billing not found</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
