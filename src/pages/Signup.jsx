import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../styles/signup.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const signupData = new FormData();
    signupData.append("name", formData.name);
    signupData.append("email", formData.email);
    signupData.append("phone", formData.phone);
    signupData.append("password", formData.password);
    if (formData.profilePicture) {
      signupData.append("profileImage", formData.profilePicture);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/signup`, {
        method: "POST",
        body: signupData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      alert("Signup successful! Redirecting to login...");
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <div className="signup-left-panel">
          <h2>Join Our Hospital System</h2>
          <p>Be the change in healthcare. Admins can register here.</p>
        </div>

        <div className="signup-form-panel">
          <h3 className="mb-3 text-primary fw-bold text-center">Admin Signup</h3>

          <form onSubmit={handleSubmit} className="signup-form">
            {preview && (
              <div className="text-center mb-3">
                <img src={preview} alt="Preview" className="profile-preview" />
              </div>
            )}

            <div className="mb-2">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="form-control mb-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-2"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="form-control mb-2"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              autoComplete="tel"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control mb-2"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password" // ✅ Added
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="form-control mb-3"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password" // ✅ Added
              required
            />

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="mt-3 text-center">
              Already have an account? <Link to="/">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
