import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import { Spinner, Table, Alert, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const MyAppointments = () => {
  const { user } = useSelector((state) => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axiosInstance.get("/appointment/my");
        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "doctor") {
      fetchAppointments();
    }
  }, [user]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axiosInstance.put(`/appointment/${appointmentId}/status`, {
        status: newStatus,
      });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      toast.success("Appointment status updated");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4 fw-bold">My Appointments</h3>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : appointments.length === 0 ? (
          <Alert variant="info">No appointments found</Alert>
        ) : (
          <Table striped bordered hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, index) => (
                <tr key={appt._id}>
                  <td>{index + 1}</td>
                  <td>{appt.patient?.name}</td>
                  <td>{appt.patient?.age}</td>
                  <td>{appt.patient?.gender}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>{appt.time}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        appt.status === "Completed"
                          ? "success"
                          : appt.status === "Cancelled"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      value={appt.status}
                      onChange={(e) =>
                        handleStatusChange(appt._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Form.Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAppointments;
