import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axios from "../../utils/axiosInstance";
import { Spinner, Table, Card } from "react-bootstrap";
import "../../styles/adminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    appointmentsToday: 0,
    monthlyRevenue: 0,
  });

  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [patientRes, doctorRes, appointmentRes, revenueRes, staffRes] =
          await Promise.all([
            axios.get("/dashboard/patients/count"),
            axios.get("/dashboard/doctors/count"),
            axios.get("/dashboard/appointments/today"),
            axios.get("/dashboard/revenue/month"),
            axios.get("/dashboard/staff/onduty"),
          ]);

        setStats({
          totalPatients: patientRes.data.count,
          totalDoctors: doctorRes.data.count,
          appointmentsToday: appointmentRes.data.count,
          monthlyRevenue: revenueRes.data.amount,
        });

        setAppointments(appointmentRes.data.latest || []);
        setStaff(staffRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="admin-dashboard container-fluid">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <StatCard title="Total Patients" value={stats.totalPatients} bg="primary" />
              <StatCard title="Doctors" value={stats.totalDoctors} bg="success" />
              <StatCard title="Appointments Today" value={stats.appointmentsToday} bg="warning" text="dark" />
             
            </div>

            <div className="row g-3">
              <div className="col-md-8">
                <Card className="h-100">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Recent Appointments</h5>
                  </Card.Header>
                  <Card.Body className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Patient Name</th>
                          <th>Doctor</th>
                          <th>Department</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length > 0 ? (
                          appointments.map((a, idx) => (
                            <tr key={idx}>
                              <td>{a.patientName}</td>
                              <td>{a.doctorName}</td>
                              <td>{a.department}</td>
                              <td>{new Date(a.date).toLocaleDateString()}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No appointments found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </div>

              <div className="col-md-4">
                <Card>
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Staff On Duty</h5>
                  </Card.Header>
                  <Card.Body>
                    <ul className="list-group list-group-flush">
                      {staff.length > 0 ? (
                        staff.map((s, idx) => (
                          <li className="list-group-item" key={idx}>
                            {s.name} - {s.role}
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item text-muted">No staff currently on duty.</li>
                      )}
                    </ul>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, bg = "primary", text = "white" }) => (
  <div className="col-md-3 col-sm-6">
    <div className={`card stat-card bg-${bg} text-${text}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h3>{value}</h3>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
