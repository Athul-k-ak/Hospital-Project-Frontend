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

        const patientData = patientRes.data.patients || [];
        const appointmentData = appointmentRes.data.appointments || [];

        setPatients(patientData);
        setAppointments(appointmentData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load patients or appointments.");
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
      const billId = res.data.billing?._id;
      toast.success("Billing record created!");

      if (billId) {
        navigate(`billing/${billingId}`);
      } else {
        toast.error("Bill ID not found");
      }
    } catch (err) {
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
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name || p.fullName || "Unnamed"}
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
