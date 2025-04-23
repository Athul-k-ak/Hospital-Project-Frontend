import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AddPatientReport = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [formData, setFormData] = useState({
    report: "",
    prescription: "",
    bloodUsed: {
      bloodGroup: "",
      units: ""
    }
  });

  const isDoctor = user?.role === "doctor";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isDoctor && !isAdmin) {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axiosInstance.get("/patient");
        // Uncomment for debugging if needed
        // console.log("Fetched patients:", res.data);
        setPatients(Array.isArray(res.data.patients) ? res.data.patients : res.data);
      } catch (error) {
        toast.error("Failed to load patients");
        console.error(error);
      }
    };
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bloodGroup" || name === "units") {
      setFormData((prev) => ({
        ...prev,
        bloodUsed: {
          ...prev.bloodUsed,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatientId) {
      toast.warning("Please select a patient");
      return;
    }

    const reportData = {
      patientId: selectedPatientId,
      ...formData,
      bloodUsed:
        formData.bloodUsed.bloodGroup && formData.bloodUsed.units
          ? formData.bloodUsed
          : null
    };

    try {
      await axiosInstance.post("/patientreport/add", reportData);
      toast.success("Patient report added successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding report");
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">Add Patient Report</h3>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Select Patient</label>
            <select
              className="form-select"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              required
            >
              <option value="">-- Select a patient --</option>
              {patients.length > 0 ? (
                patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.age} yrs, {p.gender})
                  </option>
                ))
              ) : (
                <option disabled>No patients found</option>
              )}
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Report</label>
            <textarea
              className="form-control"
              name="report"
              rows={4}
              required
              value={formData.report}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Prescription (Optional)</label>
            <textarea
              className="form-control"
              name="prescription"
              rows={3}
              value={formData.prescription}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Blood Group (if used)</label>
            <select
              className="form-select"
              name="bloodGroup"
              value={formData.bloodUsed.bloodGroup}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Units Used</label>
            <input
              type="number"
              className="form-control"
              name="units"
              min={1}
              value={formData.bloodUsed.units}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <button className="btn btn-success" type="submit">
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddPatientReport;
