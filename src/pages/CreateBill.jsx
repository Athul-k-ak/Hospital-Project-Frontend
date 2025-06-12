// src/pages/CreateBill.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";

const CreateBill = () => {
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

        setPatients(patientRes.data.patients || []);
        setAppointments(appointmentRes.data.appointments || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/billing/create", formData);
      const billing = res.data.billing;

      if (!billing?._id) {
        toast.error("Failed to create billing");
        return;
      }

      toast.success("Bill created! Proceed to payment...");
      navigate(`/billing/pay/${billing._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Error creating billing");
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h4>Create Billing Record</h4>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="row g-3">
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
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name || "Unnamed"}
                  </option>
                ))}
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
                {appointments.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.date} - {a.time}
                  </option>
                ))}
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
                value={formData.details}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button className="btn btn-primary w-100" type="submit">
                Submit Bill
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateBill;
