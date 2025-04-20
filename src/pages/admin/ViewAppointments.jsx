import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Spinner, Table, Alert, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const endpoint =
          user.role === "doctor"
            ? `/appointment/doctor/${user.id}`
            : `/appointment/`; // Admin & Reception
  
        const res = await axios.get(endpoint);
  
        console.log("Appointments fetched:", res.data); // 👈 DEBUG LOG
  
        const apptData = Array.isArray(res.data)
          ? res.data
          : res.data.appointments || [];
  
        setAppointments(apptData);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
  
    fetchAppointments();
  }, [user]);
  
  return (
    <DashboardLayout>
    <Container className="mt-4">
      <h3 className="mb-4">All Appointments</h3>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : appointments.length === 0 ? (
        <Alert variant="info">No appointments found</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt._id}>
                  <td>{index + 1}</td>
                  <td>{appt.patient?.name || "N/A"}</td>
                  <td>{appt.doctor?.name || "N/A"}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.time}</td>
                  <td>{appt.status || "Booked"}</td>
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
