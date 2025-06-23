import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/addAppointment.css";
import DashboardLayout from "../../components/DashboardLayout";

const dayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const AddAppointment = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const confirmedAppointmentId = searchParams.get("confirmed");

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const [form, setForm] = useState({
    doctorId: "",
    patientId: "",
    date: null,
    time: "",
    newPatient: {
      name: "",
      age: "",
      gender: "",
      phone: "",
      place: "",
    },
  });

  // 🔹 Fetch doctors and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, patientRes] = await Promise.all([
          axiosInstance.get("/doctor", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/patient", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDoctors(doctorRes.data || []);
        setPatients(patientRes.data.patients || []);
      } catch (error) {
        console.error("Error loading doctors/patients:", error);
        toast.error("Failed to load doctors or patients.");
      }
    };

    fetchData();
  }, [token]);

  // 🔹 Fetch confirmed appointment details
  useEffect(() => {
    const fetchConfirmedAppointment = async () => {
      if (!confirmedAppointmentId) return;
      try {
        const res = await axiosInstance.get(`/appointment/${confirmedAppointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookingDetails(res.data.appointment);
        toast.success("Appointment payment successful");

        // Clear the form
        setForm({
          doctorId: "",
          patientId: "",
          date: null,
          time: "",
          newPatient: {
            name: "",
            age: "",
            gender: "",
            phone: "",
            place: "",
          },
        });
        setAvailableTimeSlots([]);
      } catch (err) {
        toast.error("Failed to load confirmed appointment");
        console.error(err);
      }
    };

    fetchConfirmedAppointment();
  }, [confirmedAppointmentId, token]);

  // 🔹 Update time slots based on doctor and date
  useEffect(() => {
    const updateTimeSlots = () => {
      if (!form.doctorId || !form.date) return setAvailableTimeSlots([]);

      const selectedDoctor = doctors.find((d) => d._id === form.doctorId);
      if (!selectedDoctor) return;

      const selectedDay = Object.keys(dayMap).find(
        (day) => dayMap[day] === form.date.getDay()
      );

      if (selectedDoctor.availableDays.includes(selectedDay)) {
        setAvailableTimeSlots(selectedDoctor.availableTime || []);
        setForm((prev) => ({ ...prev, time: "" }));
      } else {
        toast.error("Doctor is not available on this date.");
        setAvailableTimeSlots([]);
        setForm((prev) => ({ ...prev, date: null, time: "" }));
      }
    };

    updateTimeSlots();
  }, [form.doctorId, form.date, doctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("newPatient.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        newPatient: { ...prev.newPatient, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { doctorId, patientId, date, time, newPatient } = form;

    if (!doctorId || !date || (!patientId && !newPatient.name)) {
      return toast.error("Please fill all required fields.");
    }

    if (!patientId) {
      const { name, age, gender, phone, place } = newPatient;
      if (!name || !age || !gender || !phone || !place) {
        return toast.error("Please complete new patient info.");
      }

      if (isNaN(age) || Number(age) <= 0) {
        return toast.error("Invalid age.");
      }
    }

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

    const payload = {
      doctorId,
      date: formattedDate,
      ...(time && { time }),
      ...(patientId
        ? { patientId }
        : {
            patient: {
              ...newPatient,
              age: Number(newPatient.age),
            },
          }),
    };

    try {
      setLoading(true);
      const res = await axiosInstance.post("/appointment/book", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const appointmentId = res.data.appointment._id;
      navigate(`/payment/${appointmentId}`);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const doctorOptions = doctors.map((doc) => ({
    value: doc._id,
    label: doc.name,
  }));

  const patientOptions = patients.map((pat) => ({
    value: pat._id,
    label: `${pat.name} - ${pat.phone}`,
  }));

  const selectedDoctor = doctors.find((doc) => doc._id === form.doctorId);
  const availableDays = selectedDoctor?.availableDays || [];

  const isDateAvailable = (date) => {
    const dayIndex = date.getDay();
    const dayName = Object.keys(dayMap).find((key) => dayMap[key] === dayIndex);
    return availableDays.includes(dayName);
  };

  const getDoctorName = (id) => doctors.find((doc) => doc._id === id)?.name || "N/A";
  const getPatientInfo = (id) => patients.find((pat) => pat._id === id) || {};

  return (
    <DashboardLayout>
      <div className="add-appointment container py-4">
        <h3 className="mb-4">Book New Appointment</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">Select Doctor</label>
            <Select
              options={doctorOptions}
              value={doctorOptions.find((opt) => opt.value === form.doctorId) || null}
              onChange={(selected) =>
                setForm({ ...form, doctorId: selected?.value || "", date: null, time: "" })
              }
              isClearable
              placeholder="Select Doctor"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Appointment Date</label>
            <DatePicker
              selected={form.date}
              onChange={(date) => setForm((prev) => ({ ...prev, date }))}
              className="form-control"
              placeholderText={form.doctorId ? "Select available date" : "Select doctor first"}
              filterDate={isDateAvailable}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              disabled={!form.doctorId}
            />
          </div>

          {form.date && (
            <div className="col-md-6">
              <label className="form-label">Available Time Slots</label>
              <select
                name="time"
                className="form-select"
                value={form.time}
                onChange={handleChange}
              >
                <option value="">Auto Assign (Next Available)</option>
                {availableTimeSlots.map((slot, i) => (
                  <option key={i} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <small className="form-text text-muted">
                Leave blank to auto-assign time slot.
              </small>
            </div>
          )}

          <div className="col-md-6">
            <label className="form-label">Existing Patient (Optional)</label>
            <Select
              options={patientOptions}
              value={patientOptions.find((opt) => opt.value === form.patientId) || null}
              onChange={(selected) =>
                setForm({ ...form, patientId: selected?.value || "" })
              }
              isClearable
              placeholder="Search and select patient"
            />
          </div>

          <div className="col-12">
            <h5 className="mt-4">Or Add New Patient</h5>
          </div>

          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="newPatient.name"
              className="form-control"
              value={form.newPatient.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              name="newPatient.age"
              className="form-control"
              value={form.newPatient.age}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Gender</label>
            <select
              name="newPatient.gender"
              className="form-select"
              value={form.newPatient.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="newPatient.phone"
              className="form-control"
              value={form.newPatient.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Place</label>
            <input
              type="text"
              name="newPatient.place"
              className="form-control"
              value={form.newPatient.place}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>

        {bookingDetails && (
          <div className="appointment-summary mt-5 p-4 border rounded shadow bg-light">
            <h5 className="text-success mb-3">✅ Appointment Confirmed</h5>
            <p><strong>Doctor:</strong> {bookingDetails.doctor?.name || getDoctorName(bookingDetails.doctorId)}</p>
            <p><strong>Patient:</strong> {bookingDetails.patient?.name || getPatientInfo(bookingDetails.patientId).name || "N/A"}</p>
            <p><strong>Phone:</strong> {bookingDetails.patient?.phone || getPatientInfo(bookingDetails.patientId).phone || "N/A"}</p>
            <p><strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {bookingDetails.time || "Auto Assigned"}</p>
            <p><strong>Fee Paid:</strong> ₹{bookingDetails.fee || "N/A"}</p>
            <p><strong>Payment Status:</strong> <span className="badge bg-success">{bookingDetails.paymentStatus || "Paid"}</span></p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddAppointment;
