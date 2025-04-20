import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import "../../styles/PatientList.css";
import DashboardLayout from "../../components/DashboardLayout";

const PatientList = () => {
  const { token } = useSelector((state) => state.auth);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/patient", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("✅ Patients API response:", res.data); // <--- Add this
      setPatients(res.data.patients); // make sure this matches your actual response key
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <DashboardLayout>
    <div className="patient-list container py-4">
      <h3 className="mb-4">All Patients</h3>

      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Place</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr key={patient._id}>
                  <td>{index + 1}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.place}</td>
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

export default PatientList;
