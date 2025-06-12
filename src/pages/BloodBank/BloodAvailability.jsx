import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Card, Spinner, Alert } from "react-bootstrap";
import DashboardLayout from "../../components/DashboardLayout";

const BloodAvailability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/bloodbank/all")
      .then((res) => {
        if (res.data && res.data.bloodAvailability) {
          setAvailability(res.data.bloodAvailability);
        } else {
          setError("Invalid response format");
        }
      })
      .catch(() => setError("Failed to load blood availability"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h4 className="mb-4">🩸 Blood Availability Summary</h4>

        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" variant="danger" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && availability.length === 0 && (
          <Alert variant="info">No blood availability data found.</Alert>
        )}

        <div className="row">
          {availability.map((item, idx) => (
            <div className="col-md-4 mb-3" key={idx}>
              <Card className="shadow-sm border-danger">
                <Card.Body>
                  <h5 className="text-danger">{item._id}</h5>
                  <p><strong>Total Units:</strong> {item.totalQuantity}</p>
                  <p><strong>Donors:</strong> {item.donors.join(", ")}</p>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BloodAvailability;
