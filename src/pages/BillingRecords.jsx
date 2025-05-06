import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const BillingRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchBillingRecords = async () => {
      try {
        const res = await axios.get("/api/billing", { withCredentials: true });
        setRecords(res.data);
      } catch (error) {
        console.error("Failed to fetch billing records", error);
      }
    };
    fetchBillingRecords();
  }, []);

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="mb-4">All Billing Records</h3>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Appointment</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {records.map((bill, index) => (
                <tr key={bill._id}>
                  <td>{index + 1}</td>
                  <td>{bill.patientName}</td>
                  <td>₹{bill.amount}</td>
                  <td>{bill.paymentStatus}</td>
                  <td>{bill.appointmentId ? `${bill.appointmentId.date} at ${bill.appointmentId.time}` : "N/A"}</td>
                  <td>{new Date(bill.billingDate).toLocaleDateString()}</td>
                  <td>{bill.details}</td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">No billing records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingRecords;
