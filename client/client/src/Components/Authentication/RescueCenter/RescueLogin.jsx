import React, { useState } from "react";
import NavBar from "../../Navbar/Navbar";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useUserContext } from "../../Context";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";

const formStyle = {
  maxWidth: "400px", // Adjust the maximum width as needed
  width: "100%",
};

function RescueLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { user, loginUser } = useUserContext();
  const navigate = useNavigate();
  async function handlesubmit(event) {
    event.preventDefault();

    if (!username || !password) {
      alert("enter credencilas properly");
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/rescue/login",
        {
          username: username,
          password: password,
        }
      );

      setMessage(response.data.message);
      loginUser(response.data.user);
      navigate("/home");
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
        <Form style={formStyle} onSubmit={handlesubmit}>
          <h3 className="mb-3 fs-1 fw-normal">Sign in </h3>

          <Form.Group controlId="formName">
            <Form.Label>Center name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>

          <Button
            variant="secondary"
            type="submit"
            className="mt-3"
            onClick={handlesubmit}
          >
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}

export default RescueLogin;
