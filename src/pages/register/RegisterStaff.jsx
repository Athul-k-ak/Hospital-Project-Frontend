import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/registerStaff.css";

const roles = [
  "Nurse",
  "Technician",
  "Lab Assistant",
  "Pharmacist",
  "Cleaner",
  "Security",
];

const RegisterStaff = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    qualification: "",
    role: "Nurse",
    phone: "",
    place: "",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, profileImage: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });

      await axiosInstance.post("/staff/add", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("✅ Staff added successfully!");
      setTimeout(() => navigate("/admin/register"), 1500);
    } catch (error) {
      console.error("Staff registration error:", error.response?.data);
      toast.error(error.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h3 className="mb-4 text-center">Register Staff</h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Qualification</label>
                <input
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Place</label>
                <input
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {preview && (
                <div className="col-md-6 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}

              <div className="col-12 text-center mt-3">
                <button className="btn btn-success w-50" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Registering...
                    </>
                  ) : (
                    "Register Staff"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RegisterStaff;
