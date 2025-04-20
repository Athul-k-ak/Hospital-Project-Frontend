import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Container } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/DashboardLayout";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyAppointments = async () => {
    try {
      const res = await axiosInstance.get("/appointment/by-doctor"); // Cookies sent automatically
      setAppointments(res.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((appt) => appt.date === today);

  return (
    <DashboardLayout>
      <Container fluid>
        <h3 className="mb-4 fw-bold">Welcome Doctor 👨‍⚕️</h3>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-4">
            <Col md={4}>
              <Card className="shadow-sm rounded-4 border-0">
                <Card.Body>
                  <h6 className="text-muted">Total Appointments</h6>
                  <h2 className="fw-bold">{appointments.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm rounded-4 border-0">
                <Card.Body>
                  <h6 className="text-muted">Today’s Appointments</h6>
                  <h2 className="fw-bold">{todayAppointments.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm rounded-4 border-0">
                <Card.Body>
                  <h6 className="text-muted">Reports Submitted</h6>
                  <h2 className="fw-bold text-secondary">Coming Soon</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
