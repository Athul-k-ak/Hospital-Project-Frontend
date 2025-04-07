import { useNavigate } from "react-router-dom";
import "../../styles/registerPage.css"; // Optional: Enhance this for better design
import DashboardLayout from "../../components/DashboardLayout";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUserShield, FaUserNurse, FaUserMd, FaUsersCog } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Register Admin",
      description: "Add a new Admin to manage the system.",
      route: "/admin/register-admin", // ✅ Fixed path
      color: "#007bff",
      icon: <FaUserShield size={30} />,
    },
    {
      title: "Register Reception",
      description: "Register reception staff for front desk duties.",
      route: "/admin/register-reception", // ✅ Add this route in AppRoutes
      color: "#28a745",
      icon: <FaUserNurse size={30} />,
    },
    {
      title: "Register Doctor",
      description: "Add a new doctor to the hospital.",
      route: "/admin/register-doctor", // ✅ Add this route in AppRoutes
      color: "#17a2b8",
      icon: <FaUserMd size={30} />,
    },
    {
      title: "Register Staff",
      description: "Add supporting staff like nurses, lab techs, etc.",
      route: "/admin/register-staff", // ✅ Add this route in AppRoutes
      color: "#ffc107",
      icon: <FaUsersCog size={30} />,
    },
  ];

  return (
    <DashboardLayout>
      <Container className="register-page py-5">
        <h2 className="text-center text-white mb-4">User Registration</h2>
        <Row className="g-4 justify-content-center">
          {cardData.map((card, index) => (
            <Col key={index} xs={12} sm={6} md={6} lg={3}>
              <Card
                onClick={() => navigate(card.route)}
                style={{
                  cursor: "pointer",
                  backgroundColor: card.color,
                  color: "white",
                  transition: "transform 0.2s ease-in-out",
                }}
                className="text-center shadow-sm register-card h-100"
              >
                <Card.Body>
                  <div className="mb-3">{card.icon}</div>
                  <Card.Title className="fw-bold">{card.title}</Card.Title>
                  <Card.Text>{card.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </DashboardLayout>
  );
};

export default Register;
