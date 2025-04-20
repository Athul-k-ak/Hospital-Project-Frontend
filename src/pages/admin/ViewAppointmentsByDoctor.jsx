import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Badge } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance"; // ✅ Use custom Axios instance
import DashboardLayout from "../../components/DashboardLayout";

const ViewAppointmentsByDoctor = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointment/by-doctor");
      console.log("Fetched Appointments:", res.data); // Log the response

      if (res.data.message) {
        setError(res.data.message); // Handle error message from backend
      } else {
        setAppointments(res.data); // Handle successful response
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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  return (
    <DashboardLayout>
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold">Appointments by Doctor</h3>

      {appointments.length === 0 ? (
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
