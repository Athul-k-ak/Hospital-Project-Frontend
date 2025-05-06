import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const AddBilling = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentId: "",
    amount: "",
    details: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, appointmentRes] = await Promise.all([
          axiosInstance.get("/patient"),
          axiosInstance.get("/appointment"),
        ]);

        // Log raw response
        console.log("Patient response:", patientRes.data);
        console.log("Appointment response:", appointmentRes.data);

        // Safely extract data
        const patientData =
          Array.isArray(patientRes.data.patients)
            ? patientRes.data.patients
            : Array.isArray(patientRes.data)
            ? patientRes.data
            : [];

        const appointmentData =
          Array.isArray(appointmentRes.data.appointments)
            ? appointmentRes.data.appointments
            : Array.isArray(appointmentRes.data)
            ? appointmentRes.data
            : [];

        setPatients(patientData || []);
        setAppointments(appointmentData || []);
      } catch (err) {
        console.error("Data fetch error:", err);
        toast.error("Failed to load patients or appointments.");
        setPatients([]);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/billing/create", formData);
      const billing = res.data.billing;
      toast.success("Billing record created!");

      if (!billing?._id) {
        return toast.error("Failed to retrieve billing ID");
      }

      const orderRes = await axiosInstance.post("/payment/order", {
        billingId: billing._id,
      });

      const { order } = orderRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Hospital Billing",
        description: formData.details || "Hospital Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axiosInstance.post("/payment/verify", {
              billingId: billing._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful!");
            navigate(`/billing/${billing._id}`);
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating billing");
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h4 className="mb-3">Create Billing Record</h4>

        {loading ? (
          <p>Loading patients and appointments...</p>
        ) : (
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Patient</label>
              <select
                name="patientId"
                className="form-select"
                value={formData.patientId}
                onChange={handleChange}
                required
              >
                <option value="">Select patient</option>
                {Array.isArray(patients) && patients.length > 0 ? (
                  patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name || p.fullName || "Unnamed"}
                    </option>
                  ))
                ) : (
                  <option disabled>No patients found</option>
                )}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Appointment (optional)</label>
              <select
                name="appointmentId"
                className="form-select"
                value={formData.appointmentId}
                onChange={handleChange}
              >
                <option value="">None</option>
                {Array.isArray(appointments) && appointments.length > 0 ? (
                  appointments.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.date} - {a.time}
                    </option>
                  ))
                ) : (
                  <option disabled>No appointments found</option>
                )}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                className="form-control"
                value={formData.amount}
                onChange={handleChange}
                required
                min={0}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Details</label>
              <textarea
                name="details"
                className="form-control"
                rows={3}
                value={formData.details}
                onChange={handleChange}
                placeholder="e.g. Consultation + Lab Charges"
              ></textarea>
            </div>

            <div className="col-12">
              <button className="btn btn-primary w-100" type="submit">
                Submit Billing Record
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddBilling;
