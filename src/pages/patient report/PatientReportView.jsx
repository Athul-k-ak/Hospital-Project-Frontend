import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // 🔁 Adjust the path based on your folder structure
import DashboardLayout from "../../components/DashboardLayout";

const PatientReportView = () => {
  const { patientId } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get(`/patientreport/${patientId}`);
        setReports(res.data.reports);
      } catch (err) {
        console.error("Failed to load patient reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [patientId]);

  if (loading) return <div className="container mt-4">Loading reports...</div>;

  return (
    <DashboardLayout>
    <div className="container mt-4">
      <h4>Reports for Patient</h4>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        reports.map((r) => (
          <div className="card mb-3" key={r._id}>
            <div className="card-body">
              <h5 className="card-title">Doctor: {r.doctorId?.name || "N/A"}</h5>
              <p className="card-text">Report: {r.report}</p>
              <p className="card-text">Prescription: {r.prescription}</p>
              {r.bloodUsed && (
                <p className="text-danger">
                  Blood Used: {r.bloodUsed.units} unit(s) of {r.bloodUsed.bloodGroup}
                </p>
              )}
              <small className="text-muted">
                Created at: {new Date(r.createdAt).toLocaleString()}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
    </DashboardLayout>
  );
};

export default PatientReportView;
