import React, { useState } from "react";
import axios from "../../utils/axiosInstance";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const RegisterBlood = () => {
  const [form, setForm] = useState({
    donorName: "",
    bloodGroup: "",
    age: "",
    phone: "",
    gender: "",
    quantity: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/bloodbank/register", form);
      setMessage({ type: "success", text: "Blood donation registered successfully!" });
      setForm({ donorName: "", bloodGroup: "", age: "", phone: "", gender: "", quantity: "" });
    } catch (err) {
      setMessage({ type: "danger", text: err.response?.data?.message || "Error registering blood." });
    }
  };

  return (
    <DashboardLayout>
    <Card className="p-4 m-3 shadow-sm">
      <h4>Register Blood Donation</h4>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Donor Name</Form.Label>
          <Form.Control name="donorName" value={form.donorName} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Blood Group</Form.Label>
          <Form.Select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Age</Form.Label>
          <Form.Control type="number" name="age" value={form.age} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Phone</Form.Label>
          <Form.Control name="phone" value={form.phone} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Gender</Form.Label>
          <Form.Select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Quantity (units)</Form.Label>
          <Form.Control type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="primary">Submit</Button>
      </Form>
    </Card>
    </DashboardLayout>
  );
};

export default RegisterBlood;
