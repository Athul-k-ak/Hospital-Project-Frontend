import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import "../styles/DoctorList.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const res = await axiosInstance.get("/doctor");
      setDoctors(res.data || []);
      setFilteredDoctors(res.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to load doctors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = doctors.filter(
      (doc) =>
        doc.name.toLowerCase().includes(lowerSearch) ||
        (doc.specialty && doc.specialty.toLowerCase().includes(lowerSearch))
    );
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  const handleRowClick = (id) => {
    navigate(`/doctors/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="doctor-list container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h3 className="m-0">Doctors</h3>
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: "250px" }}
          />
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="alert alert-info">No matching doctors found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialty</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc, index) => (
                  <tr
                    key={doc._id}
                    onClick={() => handleRowClick(doc._id)}
                    className="doctor-row"
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{doc.name}</td>
                    <td>{doc.email}</td>
                    <td>{doc.specialty || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorList;
