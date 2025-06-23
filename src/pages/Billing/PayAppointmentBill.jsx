import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Spinner, Button } from "react-bootstrap";
import DashboardLayout from "../../components/DashboardLayout";

const PayAppointmentBill = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const bookingFee = 300; // Customize

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axiosInstance.get(`/appointment/${appointmentId}`);
        setAppointment(res.data);
      } catch (err) {
        console.error("Failed to load appointment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handlePayment = async () => {
    try {
      const res = await axiosInstance.post("/payment/razorpay", {
        amount: bookingFee * 100, // in paisa
        appointmentId,
      });

      const { order } = res.data;

      const options = {
        key: "RAZORPAY_KEY_ID", // Replace with your Razorpay Key
        amount: order.amount,
        currency: "INR",
        name: "Hospital Booking Fee",
        description: "Doctor Appointment",
        order_id: order.id,
        handler: async (response) => {
          try {
            await axiosInstance.post("/payment/verify", {
              ...response,
              appointmentId,
            });

            navigate(`/appointment/op-sheet/${appointmentId}`);
          } catch (err) {
            console.error("Payment verification failed:", err);
          }
        },
        prefill: {
          name: appointment?.patientName || "Patient",
        },
        theme: { color: "#0d6efd" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">Confirm Payment</h3>
        <p><strong>Doctor:</strong> {appointment?.doctorName}</p>
        <p><strong>Patient:</strong> {appointment?.patientName}</p>
        <p><strong>Date:</strong> {new Date(appointment?.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {appointment?.time}</p>
        <p><strong>Amount:</strong> ₹{bookingFee}</p>
        <Button onClick={handlePayment} variant="success">Pay & Continue</Button>
      </div>
    </DashboardLayout>
  );
};

export default PayAppointmentBill;
