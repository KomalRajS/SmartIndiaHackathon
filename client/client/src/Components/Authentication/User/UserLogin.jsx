import React, { useState } from "react";
import NavBar from "../../Navbar/Navbar";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useUserContext } from "../../Context";
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const { user, loginUser, logoutUser } = useUserContext();
  const navigate = useNavigate();
  async function handleLogin(event) {
    event.preventDefault();

    if (!username || !password) {
      alert("enter details properly");
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/user/login",
        {
          username: username,
          password: password,
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      navigate("/error", {
        state: [error.message, error.response.status],
      });
    }
  }

  return (
    <>
      <div>
        <NavBar />
      </div>

      <Container className="d-flex justify-content-center mt-5">
        <Form style={formStyle} onSubmit={handleLogin}>
          <h3 className="mb-3 fs-1 fw-normal">Sign in </h3>
          <Form.Group controlId="formName">
            <Form.Label>username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>password</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Row className="d-flex justify-content-start mt-3">
            <Col xs="auto" className="ml-auto">
              <Button variant="secondary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default UserLogin;
