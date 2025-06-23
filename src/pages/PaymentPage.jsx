import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";

const PaymentPage = () => {
  const { appointmentId } = useParams();
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/payment/${appointmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAppointment(res.data.appointment))
    .catch(err => {
      toast.error("Failed to fetch appointment");
      console.error(err);
    });
  }, [appointmentId, token]);

  const loadRazorpay = () => new Promise(res => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => res(true);
    script.onerror = () => res(false);
    document.body.appendChild(script);
  });

 const handlePayment = async () => {
  if (!appointment) return;
  const ok = await loadRazorpay();
  if (!ok) return toast.error("Failed to load Razorpay SDK");

  setLoading(true);
  try {
    const { data } = await axiosInstance.post(
      "/payment/create-order",
      { appointmentId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: "Hospital Booking",
      description: `Fee for Dr. ${appointment.doctor.name}`,
      order_id: data.orderId,
      
     handler: async response => {
      try {
        const result = await axiosInstance.post("/payment/verify-payment", {
          appointmentId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }, { headers: { Authorization: `Bearer ${token}` } });

        toast.success("Payment completed");
        navigate(`/admin/billing/details/${result.data.billingId}`);
      } catch (err) {
        toast.error("Payment verification failed");
        console.error("Payment verification error:", err);
      }
    },

      prefill: {
        name: appointment.patient.name,
        contact: appointment.patient.phone,
      },
      theme: { color: "#0d6efd" },
      modal: {
        ondismiss: () => {
          window.location.reload(); // ✅ Refresh auth state if modal is dismissed
        },
      },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    toast.error("Payment initiation failed");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <DashboardLayout>
      <div className="container py-5">
        <h3>Pay Appointment Fee</h3>
        {!appointment ? (
          <p>Loading appointment...</p>
        ) : (
          <div className="card p-4 mx-auto shadow" style={{ maxWidth: 600 }}>
            <h5>Doctor: {appointment?.doctor?.name || "N/A"}</h5>
            <p>Specialty: {appointment?.doctor?.specialty || "Not available"}</p>
            <p>Date: {appointment.date} | Time: {appointment.time}</p>
            <h4 className="mt-4">Amount: ₹{appointment.fee || appointment?.doctor?.fee || "Not set"}</h4>

            <button
              disabled={loading || appointment.paymentStatus === "Paid"}
              onClick={handlePayment}
              className="btn btn-success mt-3"
            >
              {appointment.paymentStatus === "Paid" ? "Paid" : (loading ? "Processing..." : "Pay Now")}
            </button>
          </div>

        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentPage;
