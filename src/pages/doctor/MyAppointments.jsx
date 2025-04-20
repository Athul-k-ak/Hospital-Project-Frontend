import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Card, Toast } from "react-bootstrap";
import axiosInstance from "../../utils/axiosInstance";
import DashboardLayout from "../../components/DashboardLayout";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchMyAppointments = async () => {
      try {
        const res = await axiosInstance.get("/appointment/by-doctor");

        const doctorData = res.data[0];
        const appointments = doctorData?.appointments || [];

        setAppointments(appointments);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAppointments();
  }, []);

  // ✅ Update status and sync with backend
  const handleStatusChange = async (index, newStatus) => {
    const appointmentId = appointments[index]._id;

    try {
      const res = await axiosInstance.put(
        `/appointment/update-status/${appointmentId}`,
        { status: newStatus }
      );

      const updatedAppointments = [...appointments];
      updatedAppointments[index].status = res.data.appointment.status;
      setAppointments(updatedAppointments);

      setToastMessage("Appointment status updated successfully.");
    } catch (error) {
      console.error("Status update error:", error);
      setToastMessage("Failed to update appointment status.");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mt-4">
        <h3 className="mb-4 fw-bold">My Appointments</h3>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="mt-3">{error}</Alert>
        ) : appointments.length === 0 ? (
          <Alert variant="info">No appointments found</Alert>
        ) : (
          <Card className="shadow-sm">
            <Card.Body>
              <Table responsive hover bordered className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, index) => (
                    <tr key={appt._id || index}>
                      <td>{index + 1}</td>
                      <td>{appt.patientName || appt.patientId}</td>
                      <td>{new Date(appt.date).toLocaleDateString()}</td>
                      <td>{appt.time}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={appt.status ?? "Scheduled"} // ✅ Corrected here
                          onChange={(e) => handleStatusChange(index, e.target.value)}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* ✅ Toast Notification */}
        {toastMessage && (
          <Toast
            onClose={() => setToastMessage("")}
            show={!!toastMessage}
            delay={3000}
            autohide
            className="position-fixed bottom-0 end-0 m-3 bg-success text-white"
          >
            <Toast.Body>{toastMessage}</Toast.Body>
          </Toast>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAppointments;
