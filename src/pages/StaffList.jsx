import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axios from "../utils/axiosInstance";
import { Spinner, Table, Card } from "react-bootstrap";
import { FaUserNurse } from "react-icons/fa";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchStaff = async () => {
  try {
    setLoading(true);
    const res = await axios.get("/staff/list");

    // ✅ Extract the actual array from res.data.staff
    if (Array.isArray(res.data.staff)) {
      setStaff(res.data.staff);
    } else {
      console.error("Unexpected response:", res.data);
      setStaff([]);
      setError("Unexpected response format from server");
    }
  } catch (err) {
    console.error(err);
    setError("Failed to load staff data");
  } finally {
    setLoading(false);
  }
};

  fetchStaff();
}, []);


  return (
    <DashboardLayout>
      <div className="container-fluid py-4">
        <Card className="shadow-sm border-0">
          <Card.Header className="bg-light d-flex align-items-center">
            <FaUserNurse className="me-2 text-primary" size={20} />
            <h5 className="mb-0">Staff List</h5>
          </Card.Header>

          <Card.Body className="table-responsive">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : staff.length === 0 ? (
              <div className="text-muted text-center py-4">No staff records found.</div>
            ) : (
              <Table striped hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s, idx) => (
                    <tr key={s._id}>
                      <td>{idx + 1}</td>
                      <td>{s.name}</td>
                      <td>{s.role}</td>
                      <td>{s.gender}</td>
                      <td>{s.phone}</td>
                      
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffList;
