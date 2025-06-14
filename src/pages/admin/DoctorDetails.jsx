import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/doctorDetails.css";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDoctor = async () => {
    try {
      const res = await axiosInstance.get(`/doctor/${id}`);
      setDoctor(res.data);
    } catch (error) {
      console.error("Error fetching doctor:", error);
      toast.error("Failed to load doctor details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-5">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout>
        <div className="alert alert-danger">Doctor not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-4 doctor-details">
        <h3 className="mb-4">Doctor Details</h3>
        <div className="card shadow-sm">
          <div className="row g-0">
            <div className="col-md-4 text-center p-3">
              <img
                src={doctor.profileImage || "/doctor-placeholder.png"}
                alt={doctor.name}
                className="img-fluid rounded-circle border"
                style={{ width: "180px", height: "180px", objectFit: "cover" }}
              />
              <h5 className="mt-3">{doctor.name}</h5>
              <p className="text-muted">{doctor.specialty}</p>
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <p><strong>Email:</strong> {doctor.email}</p>
                <p><strong>Phone:</strong> {doctor.phone}</p>
                <p><strong>Qualification:</strong> {doctor.qualification}</p>
                <p><strong>Available Days:</strong> {doctor.availableDays?.join(", ")}</p>
                <p><strong>Available Time:</strong> {doctor.availableTime?.join(" - ")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🔙 Back Button */}
        <div className="mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDetails;
