import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Select from "react-select";

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
      const url = isDoctor ? "/patient/doctor-patients" : "/patient";
      const res = await axiosInstance.get(url);

      // ✅ handle response structure differences
      if (isAdmin && Array.isArray(res.data.patients)) {
        setPatients(res.data.patients);
      } else if (isDoctor && Array.isArray(res.data)) {
        setPatients(res.data);
      } else {
        setPatients([]);
        toast.warn("No patients found.");
      }
    } catch (error) {
      toast.error("Failed to load patients");
      console.error("Fetch error:", error);
    }
  };

  fetchPatients();
}, [user, isDoctor, isAdmin]);


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

  const patientOptions = patients.map((p) => ({
    value: p._id,
    label: `${p.name} (${p.age} yrs, ${p.gender})`
  }));

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">Add Patient Report</h3>

        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Select Patient</label>
            <Select
              options={patientOptions}
              value={patientOptions.find((opt) => opt.value === selectedPatientId) || null}
              onChange={(selected) => setSelectedPatientId(selected ? selected.value : "")}
              isSearchable
              placeholder="Search or select a patient..."
              isClearable
            />
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
