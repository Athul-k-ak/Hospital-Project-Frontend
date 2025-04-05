import React from "react";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/adminDashboard.css";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="admin-dashboard container-fluid">
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-sm-6">
            <div className="card stat-card bg-primary text-white">
              <div className="card-body">
                <h5 className="card-title">Total Patients</h5>
                <h3>1,245</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card stat-card bg-success text-white">
              <div className="card-body">
                <h5 className="card-title">Doctors</h5>
                <h3>78</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card stat-card bg-warning text-dark">
              <div className="card-body">
                <h5 className="card-title">Appointments Today</h5>
                <h3>134</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card stat-card bg-danger text-white">
              <div className="card-body">
                <h5 className="card-title">Revenue (This Month)</h5>
                <h3>₹ 4,50,000</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Recent Appointments</h5>
              </div>
              <div className="card-body table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Patient Name</th>
                      <th>Doctor</th>
                      <th>Department</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Doe</td>
                      <td>Dr. Smith</td>
                      <td>Cardiology</td>
                      <td>03-Apr-2025</td>
                    </tr>
                    <tr>
                      <td>Jane Roe</td>
                      <td>Dr. Arya</td>
                      <td>Neurology</td>
                      <td>03-Apr-2025</td>
                    </tr>
                    <tr>
                      <td>Rahul Kumar</td>
                      <td>Dr. Anjali</td>
                      <td>Orthopedics</td>
                      <td>03-Apr-2025</td>
                    </tr>
                    <tr>
                      <td>Sneha Verma</td>
                      <td>Dr. Iqbal</td>
                      <td>Pediatrics</td>
                      <td>03-Apr-2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header bg-light">
                <h5 className="mb-0">Staff On Duty</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Dr. Smith - Cardiology</li>
                  <li className="list-group-item">Dr. Arya - Neurology</li>
                  <li className="list-group-item">Nurse Priya - ICU</li>
                  <li className="list-group-item">Lab Tech Ramesh</li>
                  <li className="list-group-item">Reception - Anu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
