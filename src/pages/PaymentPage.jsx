import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import DashboardLayout from "../components/DashboardLayout";

const PaymentPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Razorpay script dynamically
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Fetch bill details on component load
  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await axiosInstance.get(`/billing/${billId}`);
        setBill(res.data.billing);
      } catch (err) {
        toast.error("Failed to load billing details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [billId]);

  const loadRazorpay = async () => {
    if (!bill) return;

    const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!scriptLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("Razorpay Key:", razorpayKey);

    if (!razorpayKey) {
      toast.error("Razorpay key is missing. Check your .env file.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/payment/razorpay-order`, {
        billingId: bill._id,
      });

      const { order } = res.data;

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Hospital Payment",
        description: "Medical Billing Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axiosInstance.post(`/payment/verify`, {
              billingId: bill._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful!");
            navigate("/billing/view");
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: bill?.patient?.name || "",
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Load Error:", error);
      toast.error("Error initiating payment");
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-5">
        <h3 className="mb-4">Pay Your Bill</h3>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : bill ? (
          <div className="card p-4 shadow rounded-4">
            <h5 className="mb-3">
              Patient: <strong>{bill.patient?.name}</strong>
            </h5>
            <p>
              <strong>Details:</strong> {bill.details}
            </p>
            <p>
              <strong>Amount:</strong> ₹{bill.amount}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {bill.paymentStatus === "paid" ? "✅ Paid" : "❌ Not Paid"}
            </p>

            {bill.paymentStatus !== "paid" && (
              <button className="btn btn-success mt-3" onClick={loadRazorpay}>
                Pay Now
              </button>
            )}
          </div>
        ) : (
          <div className="alert alert-danger">Bill not found</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
