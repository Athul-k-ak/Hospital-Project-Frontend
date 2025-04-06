import { useNavigate } from "react-router-dom";
import "../../styles/registerPage.css"; // Optional for custom styles
import { Container, Row, Col, Card } from "react-bootstrap";
import DashboardLayout from "../../components/DashboardLayout";


const Register = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Register Admin",
      description: "Add a new Admin to manage the system.",
      route: "/register-admin",
      color: "primary",
    },
    {
      title: "Register Reception",
      description: "Register reception staff for front desk duties.",
      route: "/register-reception",
      color: "success",
    },
    {
      title: "Register Doctor",
      description: "Add a new doctor to the hospital.",
      route: "/register-doctor",
      color: "info",
    },
    {
      title: "Register Staff",
      description: "Add supporting staff like nurses, lab techs, etc.",
      route: "/register-staff",
      color: "warning",
    },
  ];

  return (
    <DashboardLayout>
    <Container className="register-page py-5">
      <h2 className="text-center text-white mb-4">User Registration</h2>
      <Row className="g-4">
        {cardData.map((card, index) => (
          <Col key={index} xs={12} sm={6} md={6} lg={3}>
            <Card
              bg={card.color.toLowerCase()}
              text="white"
              className="h-100 register-card"
              onClick={() => navigate(card.route)}
              style={{ cursor: "pointer" }}
            >
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
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
