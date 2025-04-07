import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/registerDoctor.css";
import DashboardLayout from "../../components/DashboardLayout";

const daysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM",
];

const RegisterDoctor = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    qualification: "",
    availableDays: [],
    availableTime: [],
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

  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    const updatedList = checked
      ? [...formData[field], value]
      : formData[field].filter((item) => item !== value);
    setFormData({ ...formData, [field]: updatedList });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "availableDays" || key === "availableTime") {
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value);
        }
      });

      const response = await axiosInstance.post("/doctor/signup", form);

      toast.success("✅ Doctor registered successfully!");
      setTimeout(() => navigate("/admin/register"), 1500);
    } catch (error) {
      console.error("Doctor registration error:", error.response?.data);
      toast.error(error.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h3 className="mb-4 text-center">Register Doctor</h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              {/* Name */}
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Specialty */}
              <div className="col-md-6">
                <label className="form-label">Specialty</label>
                <input
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* Qualification */}
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

              {/* Available Days */}
              <div className="col-md-6">
                <label className="form-label">Available Days</label>
                <div className="d-flex flex-wrap gap-2">
                  {daysList.map((day) => (
                    <div key={day} className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`day-${day}`}
                        value={day}
                        checked={formData.availableDays.includes(day)}
                        onChange={(e) => handleCheckboxChange(e, "availableDays")}
                      />
                      <label className="form-check-label" htmlFor={`day-${day}`}>
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Time Slots */}
              <div className="col-md-6">
                <label className="form-label">Available Time Slots</label>
                <div className="d-flex flex-wrap gap-2">
                  {timeSlots.map((slot) => (
                    <div key={slot} className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`time-${slot}`}
                        value={slot}
                        checked={formData.availableTime.includes(slot)}
                        onChange={(e) => handleCheckboxChange(e, "availableTime")}
                      />
                      <label className="form-check-label" htmlFor={`time-${slot}`}>
                        {slot}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile Image */}
              <div className="col-md-6">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="col-md-6 text-center">
                  <img src={preview} alt="Preview" className="img-thumbnail" style={{ maxHeight: "150px" }} />
                </div>
              )}

              {/* Submit Button */}
              <div className="col-12 text-center mt-3">
                <button className="btn btn-primary w-50" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Registering...
                    </>
                  ) : (
                    "Register Doctor"
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

export default RegisterDoctor;
