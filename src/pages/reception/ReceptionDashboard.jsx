import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axios from "../../utils/axiosInstance";
import { Spinner } from "react-bootstrap";
import {
  FaUserInjured,
  FaUserMd,
  FaUserNurse,
} from "react-icons/fa";
// import "../../styles/adminDashboard.css";

const ReceptionDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalStaff: 0,
  });

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          patientRes,
          doctorRes,
          staffCountRes,
          availableDoctorsRes,
        ] = await Promise.all([
          axios.get("/dashboard/patients/count"),
          axios.get("/dashboard/doctors/count"),
          axios.get("/dashboard/staff/count"),
          axios.get("/dashboard/doctors/today"),
        ]);

        setStats({
          totalPatients: patientRes.data.count,
          totalDoctors: doctorRes.data.count,
          totalStaff: staffCountRes.data.count,
        });

        setAvailableDoctors(availableDoctorsRes.data.doctors || []);
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
      <div className="admin-dashboard container-fluid py-4">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="row justify-content-center g-4">
              <StatCard
                title="Total Patients"
                value={stats.totalPatients}
                bg="primary"
                icon={<FaUserInjured size={40} />}
              />
              <StatCard
                title="Total Doctors"
                value={stats.totalDoctors}
                bg="success"
                icon={<FaUserMd size={40} />}
              />
              <StatCard
                title="Total Staff"
                value={stats.totalStaff}
                bg="warning"
                text="dark"
                icon={<FaUserNurse size={40} />}
              />
            </div>

            <div className="row mt-4">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-light">
                    <h5 className="mb-0">Doctors Available Today</h5>
                  </div>
                  <div className="card-body table-responsive">
                    {availableDoctors.length === 0 ? (
                      <p className="text-muted text-center">
                        No doctors available today.
                      </p>
                    ) : (
                      <table className="table table-striped table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Department</th>
                            
                          </tr>
                        </thead>
                        <tbody>
                          {availableDoctors.map((doc, idx) => (
                            <tr key={doc._id}>
                              <td>{idx + 1}</td>
                              <td>{doc.name}</td>
                              <td>{doc.specialty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ title, value, bg = "primary", text = "white", icon }) => (
  <div className="col-md-4 col-sm-6">
    <div className={`card stat-card text-${text} bg-${bg} shadow-sm rounded-4 border-0 h-100`}>
      <div className="card-body text-center py-4">
        <div className="mb-3">{icon}</div>
        <h6 className="card-title text-uppercase fw-semibold mb-2">{title}</h6>
        <h2 className="mb-0 fw-bold">{value}</h2>
      </div>
    </div>
  </div>
);

export default ReceptionDashboard;
