import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import {
  Spinner,
  Table,
  Alert,
  Container,
  Badge,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";

const ViewAppointments = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let res;

        if (user.role === "doctor") {
          // Doctor-specific appointments
          res = await axios.get("/appointment/my");
          setAppointments(res.data.appointments || []);
        } else {
          // Admin/Reception: Grouped appointments by doctor
          res = await axios.get("/appointment/by-doctor-grouped");

          // Flatten grouped data
          const flatAppointments = res.data.flatMap((group) =>
            group.appointments.map((appt) => ({
              ...appt,
              doctor: { name: group.doctorName },
            }))
          );

          setAppointments(flatAppointments);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchAppointments();
    }
  }, [user]);

  // Function to display status badge with default
  const renderStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case "completed":
        return <Badge bg="success">Completed</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      case "booked":
        return <Badge bg="primary">Booked</Badge>;
      default:
        return <Badge bg="secondary">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <Container className="mt-4">
        <h3 className="mb-4 fw-bold">Appointments</h3>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : appointments.length === 0 ? (
          <Alert variant="info">No appointments found</Alert>
        ) : (
          <div className="table-responsive shadow-sm">
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt, index) => (
                  <tr key={appt._id || index}>
                    <td>{index + 1}</td>
                    <td>{appt.patient?.name || appt.patientName || "N/A"}</td>
                    <td>{appt.doctor?.name || "N/A"}</td>
                    <td>{new Date(appt.date).toLocaleDateString()}</td>
                    <td>{appt.time}</td>
                    <td>{renderStatusBadge(appt.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default ViewAppointments;
