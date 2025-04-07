import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";
import "../../styles/registerAdmin.css";

const RegisterAdmin = () => {
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
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    if (formData.profilePicture) {
      data.append("profileImage", formData.profilePicture);
    }

    try {
      await axiosInstance.post("/admin/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Admin registered successfully!");
      navigate("/admin/register");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="register-admin-container">
        <Card className="register-admin-card animate__animated animate__fadeInUp">
          <h3 className="text-center text-primary mb-4 fw-semibold">Register Admin</h3>

          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form onSubmit={handleSubmit}>
            {preview && (
              <div className="text-center mb-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="profile-preview"
                />
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Profile Picture (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 floating-label">
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <Form.Label>Full Name</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3 floating-label">
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                autoComplete="username"
                required
              />
              <Form.Label>Email</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3 floating-label">
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder=" "
                pattern="[0-9]{10}"
                autoComplete="tel"
                required
              />
              <Form.Label>Phone</Form.Label>
            </Form.Group>

            <Form.Group className="mb-3 floating-label">
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                autoComplete="new-password"
                required
              />
              <Form.Label>Password</Form.Label>
            </Form.Group>

            <Form.Group className="mb-4 floating-label">
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder=" "
                autoComplete="new-password"
                required
              />
              <Form.Label>Confirm Password</Form.Label>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 py-2 fw-semibold"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Registering...
                </>
              ) : (
                "Register Admin"
              )}
            </Button>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegisterAdmin;
