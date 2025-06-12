import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Table, Spinner, Alert } from "react-bootstrap";
import DashboardLayout from "../../components/DashboardLayout";

const BloodStockList = () => {
  const [bloodList, setBloodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/bloodbank") // ✅ Correct endpoint
      .then((res) => setBloodList(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch blood stock");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
    <div className="m-3">
      <h4>All Blood Donations</h4>
      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Donor Name</th>
              <th>Blood Group</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {bloodList.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No records found.</td>
              </tr>
            ) : (
              bloodList.map((b, idx) => (
                <tr key={b._id || idx}>
                  <td>{idx + 1}</td>
                  <td>{b.donorName}</td>
                  <td>{b.bloodGroup}</td>
                  <td>{b.age}</td>
                  <td>{b.phone}</td>
                  <td>{b.gender}</td>
                  <td>{b.quantity} unit(s)</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
    </DashboardLayout>
  );
  
};


export default BloodStockList;
