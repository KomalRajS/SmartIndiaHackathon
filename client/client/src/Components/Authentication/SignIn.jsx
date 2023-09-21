import React from "react";
import Container from "react-bootstrap/Container";
import NavBar from "../Navbar/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
function SignIn() {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div>
        <Container
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "90vh" }}
        >
          <Card border="light">
            <Card.Title>Sign in as</Card.Title>
            <Row>
              <Col>
                <Link to="/auth/user/login">
                  <Card style={{ width: "10rem" }}>
                    <Card.Img
                      variant="top"
                      src="../../../../public/user-profile-icom.jpg"
                    />
                    <Card.Body>
                      <Card.Title>User</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
              <Col>
                <Link to="/auth/rescue/login">
                  <Card style={{ width: "10rem" }}>
                    <Card.Img
                      variant="top"
                      src="holder.js/100px100?text=Image cap"
                    />
                    <Card.Body>
                      <Card.Title>Rescue Center</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default SignIn;
