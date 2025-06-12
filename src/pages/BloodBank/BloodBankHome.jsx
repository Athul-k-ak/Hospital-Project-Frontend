// src/pages/bloodbank/BloodBankHome.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import DashboardLayout from "../../components/DashboardLayout";

const BloodBankHome = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Container>
        <h3 className="mb-4">🩸 Blood Bank Dashboard</h3>
        <Row className="g-4">
            <Col md={6}>
            <Card className="shadow-sm h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                    <Card.Title>Blood Availability Summary</Card.Title>
                    <Card.Text>
                    View total units available for each blood group.
                    </Card.Text>
                </div>
                <Button variant="primary" onClick={() => navigate("availability")}>
                    View Availability
                </Button>
                </Card.Body>
            </Card>
            </Col>

          <Col md={6}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title>View Blood Stock</Card.Title>
                  <Card.Text>
                    See the total available blood units grouped by blood type and view donors.
                  </Card.Text>
                </div>
                <Button variant="danger" onClick={() => navigate("stock")}>
                  View Stock
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title>Register Blood Donation</Card.Title>
                  <Card.Text>
                    Add new blood donation entries by donor details and quantity.
                  </Card.Text>
                </div>
                <Button variant="success" onClick={() => navigate("register")}>
                  Register Donation
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default BloodBankHome;
