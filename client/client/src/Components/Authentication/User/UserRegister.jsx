import React, { useState, useEffect } from "react";
import NavBar from "../../Navbar/Navbar";
import axios from "axios";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context";

const formStyle = {
  maxWidth: "400px", // Adjust the maximum width as needed
  width: "100%",
};

function UserRegister() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [disablecheck, setdisablecheck] = useState(true);
  const [isRescueTeamMember, setisRescueTeamMember] = useState(false);
  const [rescueTeamId, setRescueTeamId] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNo, setPhoneNo] = useState("");
  const [authotp, setauthotp] = useState("");
  const [sendOrResend, setSendOrResend] = useState("send");
  const [location, setLocation] = useState();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, loginUser } = useUserContext();

  const handlesignup = (event) => {};
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not available in this browser.");
    }
  }, []);

  async function sendotp(event) {
    event.preventDefault();
    setSendOrResend("Resend");
    try {
      console.log(countryCode + phoneNo);
      const response = await axios.post("http://localhost:4000/auth/verify", {
        country_code: countryCode,
        phone_no: phoneNo,
      });
      setMessage(response.data.message);
      setdisablecheck(false);
    } catch (error) {
      navigate("/error", {
        state: [error.message, error.response.status],
      });
    }
  }
  async function signup(event) {
    if (
      !email ||
      !password ||
      !phoneNo ||
      !username ||
      !authotp ||
      !countryCode
    ) {
      event.preventDefault();
      alert("enter all the details correctly");
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/auth/user/register",
        {
          email: email,
          username: username,
          password: password,
          verCode: authotp,
          country_code: countryCode,
          phone_no: phoneNo,
          rescue_team_id: rescueTeamId,
          location: {
            type: "Point",
            coordinates: [location.latitude, location.longitude],
          },
        }
      );
      console.log(response);
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
        <Form onSubmit={handlesignup}>
          <h3 className="mb-3 fs-1 fw-normal">Sign up </h3>
          <Form.Group controlId="formGridPassword">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder=" abc@gmail.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="*****"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Form.Label>Are you a memeber of any rescue team ?</Form.Label>
          <Row className="mb-3">
            <Col xs={4}>
              <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Yes"
                  onChange={(e) => setisRescueTeamMember(true)}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Control
                  type="text"
                  placeholder="Rescue team id"
                  value={rescueTeamId}
                  disabled={!isRescueTeamMember}
                  onChange={(e) => setRescueTeamId(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Label>Mobile no</Form.Label>
          <Row className="mb-3">
            <Col xs={4}>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">India</option>
                  <option value="+1">US</option>
                  <option value="+0">China</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Control
                  required
                  type="text"
                  placeholder="phone no"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3 d-flex justify-content-between">
            <Col xs={8} className="ml-auto">
              <Form.Group as={Col} controlId="formGridState">
                <Form.Control
                  type="text"
                  placeholder="enter OTP"
                  onChange={(e) => setauthotp(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs="auto" className="ml-auto">
              <Form.Group as={Col} controlId="formGridCity">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={(e) => sendotp(e)}
                >
                  {sendOrResend} OTP
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Form.Label className="text-muted mt-0 fs-6 ">{message}</Form.Label>

          <Row className="d-flex justify-content-start">
            <Col xs="auto" className="ml-auto">
              <Button
                variant="secondary"
                type="submit"
                className="mx-auto"
                disabled={disablecheck}
                onClick={signup}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default UserRegister;
