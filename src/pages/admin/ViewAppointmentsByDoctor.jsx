import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Badge } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/DashboardLayout";

const ViewAppointmentsByDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointment/by-doctor-grouped");
      if (res.data.message) {
        setError(res.data.message);
      } else {
        setAppointments(res.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h3 className="mb-4 fw-bold">Appointments Grouped by Doctor</h3>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : appointments.length === 0 ? (
          <Alert variant="info">No appointments found</Alert>
        ) : (
          appointments.map((doctorEntry, index) => (
            <Card key={index} className="mb-4 shadow-sm">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <strong>{doctorEntry.doctorName}</strong>
                <Badge bg="light" text="dark">
                  {doctorEntry.appointments.length} Appointments
                </Badge>
              </Card.Header>
              <Card.Body>
                <Table responsive bordered hover className="mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Patient Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorEntry.appointments.map((appt, idx) => (
                      <tr key={appt._id}>
                        <td>{idx + 1}</td>
                        <td>{new Date(appt.date).toLocaleDateString()}</td>
                        <td>{appt.time}</td>
                        <td>{appt.patientName}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewAppointmentsByDoctor;
