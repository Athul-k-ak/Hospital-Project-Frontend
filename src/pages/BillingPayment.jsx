import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const BillingPayment = () => {
  const { billingId } = useParams();
  const navigate = useNavigate();

  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendBaseURL = "http://localhost:5000"; // Update to your env config

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const { data } = await axios.get(`${backendBaseURL}/api/billing/${billingId}`, {
          withCredentials: true,
        });
        setBillingData(data.billing);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load billing data");
        setLoading(false);
      }
    };
    fetchBill();
  }, [billingId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load.");
      return;
    }

    try {
      const { data: order } = await axios.post(
        `${backendBaseURL}/api/billing/payment/create/${billingId}`,
        {},
        { withCredentials: true }
      );

      const options = {
        key: order.razorpayKey,
        amount: order.amount,
        currency: "INR",
        name: "Hospital Billing",
        description: `Payment for bill ${billingId}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${backendBaseURL}/api/billing/payment/verify`,
              {
                billingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );
            toast.success("Payment Successful");
            navigate(`/billing/details/${billingId}`);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: billingData.patientName,
          email: "patient@example.com",
          contact: billingData.phone || "9999999999",
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment initiation failed");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading billing data...</div>;

  return (
    <div className="container mt-4">
      <h2>Billing Payment</h2>
      <div className="card p-4 shadow mt-3">
        <h5>Patient: {billingData.patientName}</h5>
        <p><strong>Total Amount:</strong> ₹{billingData.totalAmount}</p>
        <p><strong>Status:</strong> {billingData.isPaid ? "Paid" : "Pending"}</p>
        {!billingData.isPaid && (
          <button className="btn btn-primary mt-3" onClick={handlePayment}>
            Pay Now
          </button>
        )}
        {billingData.isPaid && (
          <button className="btn btn-success mt-3" disabled>
            Already Paid
          </button>
        )}
      </div>
    </div>
  );
};

export default BillingPayment;
