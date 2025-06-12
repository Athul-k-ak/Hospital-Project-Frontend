import React, { useState } from 'react';
import axios from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import DashboardLayout from '../../components/DashboardLayout';

const AddBill = () => {
  const [form, setForm] = useState({
    patientId: '',
    patientName: '',
    details: '',
    amount: ''
    // Optional: appointmentId: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await axios.post('/billing/create', form);
      navigate(`/billing/pay/${data._id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create bill');
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4">
        <Card className="shadow-sm">
          <Card.Body>
            <h3 className="mb-4">Add New Bill</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Patient ID</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Patient Name</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                />
              </Form.Group>

              {/* Optional */}
              {/* <Form.Group className="mb-3">
                <Form.Label>Appointment ID</Form.Label>
                <Form.Control
                  type="text"
                  value={form.appointmentId}
                  onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
                />
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Label>Service Details</Form.Label>
                <Form.Control
                  type="text"
                  required
                  placeholder="E.g., X-Ray, Blood Test"
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Total Amount (₹)</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </Form.Group>

              <Button type="submit" variant="primary">Create Bill</Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddBill;
