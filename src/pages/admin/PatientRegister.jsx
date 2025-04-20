import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../styles/PatientRegister.css";
import DashboardLayout from "../../components/DashboardLayout";

const PatientRegister = () => {
  const { token } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    place: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // ✅ New state for success message

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccessMessage(""); // Clear success message on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age, gender, phone, place } = form;

    if (!name || !age || !gender || !phone || !place) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/patient/register", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success(res.data.message);
      setSuccessMessage(res.data.message); // ✅ Set success message
      setForm({ name: "", age: "", gender: "", phone: "", place: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
    <div className="patient-register container py-4">
      <h3 className="mb-4">Register New Patient</h3>

      {/* ✅ Bootstrap Success Message */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Age</label>
          <input type="number" name="age" className="form-control" value={form.age} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Gender</label>
          <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} />
        </div>

        <div className="col-12">
          <label className="form-label">Place</label>
          <input type="text" name="place" className="form-control" value={form.place} onChange={handleChange} />
        </div>

        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register Patient"}
          </button>
        </div>
      </form>
    </div>
    </DashboardLayout>
  );
};

export default PatientRegister;
