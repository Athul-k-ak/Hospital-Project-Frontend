import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DashboardLayout from "../components/DashboardLayout";

const DoctorFeeManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [doctors, setDoctors] = useState([]);
  const [updating, setUpdating] = useState({});

  // 🔄 Fetch doctor list with fees
  const fetchDoctorFees = async () => {
    try {
      const res = await axiosInstance.get("/doctor/fees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch doctor fees");
    }
  };

  useEffect(() => {
    fetchDoctorFees();
  }, []);

  // ✏️ Handle fee input change
  const handleFeeChange = (id, value) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc._id === id ? { ...doc, fee: parseInt(value || 0) } : doc
      )
    );
  };

  // 🔁 Update fee on backend
  const updateFee = async (id) => {
    const doctor = doctors.find((d) => d._id === id);
    if (!doctor.fee || doctor.fee < 0)
      return toast.error("Enter a valid fee amount");

    setUpdating((prev) => ({ ...prev, [id]: true }));

    try {
      await axiosInstance.put(
        `/doctor/fees/update/${id}`,
        { fee: doctor.fee },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Fee updated for Dr. ${doctor.name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update fee");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">Manage Doctor Appointment Fees</h3>
        <div className="table-responsive">
          <table className="table table-bordered align-middle shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Fee (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No doctors found
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.name}</td>
                    <td>{doc.specialty || "—"}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        min={0}
                        value={doc.fee}
                        onChange={(e) =>
                          handleFeeChange(doc._id, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateFee(doc._id)}
                        disabled={updating[doc._id]}
                      >
                        {updating[doc._id] ? "Updating..." : "Update"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorFeeManagement;
