import React, { useState, useEffect } from "react";
import NavBar from "../../Navbar/Navbar";
import { Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import Container from "react-bootstrap/Container";
import { useUserContext } from "../../Context";
import Selector from "../../Utility/Selector";
import { useNavigate } from "react-router-dom";

function RescueRegister() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [disablecheck, setdisablecheck] = useState(true);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNo, setPhoneNo] = useState("");
  const [authotp, setauthotp] = useState("");
  const [sendOrResend, setSendOrResend] = useState("send");

  const [pageNo, setPageNo] = useState(1);

  const [specs, Setspecs] = useState([]);
  const [calamities, Setcalamities] = useState([]);
  const [severity, Setseverity] = useState([]);
  const [medFacilities, setMedFacilities] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [supplyResource, setSupplyResource] = useState([]);
  const [services, setServices] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState();
  const { user, loginUser } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setLocation({ latitude: 13, longitude: 77 });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not available in this browser.");
    }
  }, []);

  const handlesignup = (event) => {};
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
        "http://localhost:4000/auth/rescue/register",
        {
          email: email,
          username: username,
          password: password,
          verCode: authotp,
          country_code: countryCode,
          phone_no: phoneNo,
          address: address,
          description: description,

          geometry: {
            type: "Point",
            coordinates: [location.latitude, location.longitude],
          },
          capacity: capacity,
          services: services,
          availability: availability,
          specializatiion: specs,
          medical_facility: medFacilities,
          supply_and_resource: supplyResource,
          calamities: calamities,
        }
      );
      loginUser(response.data.user);
      navigate("/home");
    } catch (error) {
      navigate("/error", {
        state: [error.message, error.response.status],
      });
    }
  }

  const handleOptionClick = (setter, selectedOptions, option) => {
    if (!selectedOptions.includes(option)) {
      setter([...selectedOptions, option]);
    }
  };
  const handleRemoveOption = (setter, selectedOptions, option) => {
    setter(selectedOptions.filter((selected) => selected !== option));
  };

  return (
    <>
      <div>
        <NavBar />
      </div>

      <Container
        className="d-flex flex-column justify-content-center mt-5 allign-item-center mx-auto"
        style={{ width: "35%" }}
      >
        <Row>
          <h3 className="mb-3 fs-1 fw-normal">Sign up </h3>
        </Row>
        <p className="text-muted">Step {pageNo} / 4</p>
        <Row>
          <Form onSubmit={handlesignup}>
            {pageNo == 1 && (
              <div>
                <Form.Group controlId="formGridPassword">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="username"
                    value={username}
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
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="*****"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="formGridPassword">
                    <Form.Label>address</Form.Label>
                    <Form.Control
                      as="textarea"
                      type="textarea"
                      placeholder="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group controlId="formGridPassword">
                    <Form.Label>description</Form.Label>
                    <Form.Control
                      as="textarea"
                      type="textarea"
                      placeholder="small description "
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Row>
                <Row className="d-flex justify-content-end mt-2">
                  <Col xs="auto" className="ml-auto justify-content-end">
                    <Button
                      variant="light"
                      type="submit"
                      className="mx-auto"
                      onClick={(e) => {
                        if (pageNo != 4) setPageNo(pageNo + 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                        />
                      </svg>
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {pageNo == 2 && (
              <div>
                <Form.Group controlId="formGridPassword">
                  <Form.Label>Specialization</Form.Label>
                  <Selector
                    options={[
                      "fire response",
                      "medical",
                      "mental health support",
                      "search and rescue",
                      "water rescue",
                    ]}
                    setter={Setspecs}
                    list={specs}
                    parentAdder={handleOptionClick}
                    parentRemover={handleRemoveOption}
                    inputName={"specialization"}
                  ></Selector>
                </Form.Group>

                <Form.Group controlId="formGridPassword">
                  <Form.Label>Services</Form.Label>
                  <Selector
                    options={[
                      "counseling",
                      "food and water",
                      "language assistance",
                      "medical",
                      "transportation",
                    ]}
                    setter={setServices}
                    list={services}
                    parentAdder={handleOptionClick}
                    parentRemover={handleRemoveOption}
                    inputName={"sevices"}
                  ></Selector>
                </Form.Group>

                <Form.Group controlId="formGridPassword">
                  <Form.Label>Calamities</Form.Label>
                  <Selector
                    options={[
                      "earthquake",
                      "fire",
                      "flood",
                      "hurricane",
                      "pandemic",
                      "tsunami",
                    ]}
                    setter={Setcalamities}
                    list={calamities}
                    parentAdder={handleOptionClick}
                    parentRemover={handleRemoveOption}
                    inputName={"calamities"}
                  ></Selector>
                </Form.Group>

                <Row className="d-flex justify-content-between mt-2">
                  <Col xs="auto" className="ml-auto justify-content-start">
                    <Button
                      variant="light"
                      type="submit"
                      className="mx-auto"
                      onClick={(e) => {
                        if (pageNo != 1) setPageNo(pageNo - 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                        />
                      </svg>
                    </Button>
                  </Col>
                  <Col xs="auto" className="ml-auto justify-content-end">
                    <Button
                      variant="light"
                      type="submit"
                      className="mx-auto"
                      onClick={(e) => {
                        if (pageNo != 4) setPageNo(pageNo + 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                        />
                      </svg>
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {pageNo == 3 && (
              <div>
                <Form.Group controlId="formGridPassword">
                  <Form.Label>Supply and Resources</Form.Label>
                  <Selector
                    options={[
                      "limited supplies",
                      "medical equipment available",
                      "pharmaceuticals available",
                      "well-stocked",
                    ]}
                    setter={setSupplyResource}
                    list={supplyResource}
                    parentAdder={handleOptionClick}
                    parentRemover={handleRemoveOption}
                    inputName={"supply & resources"}
                  ></Selector>
                </Form.Group>

                <Form.Group controlId="formGridPassword">
                  <Form.Label>Medical facilities</Form.Label>
                  <Selector
                    options={[
                      "basic first aid",
                      "intensive care units",
                      "pediatric care",
                      "surgical facilities",
                      "trauma care",
                    ]}
                    setter={setMedFacilities}
                    list={medFacilities}
                    parentAdder={handleOptionClick}
                    parentRemover={handleRemoveOption}
                    inputName={"medical facilities"}
                  ></Selector>
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="formGridPassword">
                      <Form.Label>Availability</Form.Label>
                      <Selector
                        options={[
                          "almost full",
                          "available",
                          "full",
                          "temporarily unavailable",
                        ]}
                        setter={setAvailability}
                        list={availability}
                        parentAdder={handleOptionClick}
                        parentRemover={handleRemoveOption}
                        inputName={"availability"}
                      ></Selector>
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="formGridPassword">
                      <Form.Label>Capacity</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="address"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="d-flex justify-content-between mt-2">
                  <Col xs="auto" className="ml-auto justify-content-start">
                    <Button
                      variant="light"
                      type="submit"
                      className="mx-auto"
                      onClick={(e) => {
                        if (pageNo != 1) setPageNo(pageNo - 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                        />
                      </svg>
                    </Button>
                  </Col>
                  <Col xs="auto" className="ml-auto justify-content-end">
                    <Button
                      variant="light"
                      type="submit"
                      className="mx-auto"
                      onClick={(e) => {
                        if (pageNo != 4) setPageNo(pageNo + 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-right"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                        />
                      </svg>
                    </Button>
                  </Col>
                </Row>
              </div>
            )}

            {pageNo == 4 && (
              <div>
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

                <Form.Label className="text-muted mt-0 fs-6 ">
                  {message}
                </Form.Label>

                <Row className="d-flex justify-content-between">
                  <Col xs="auto" className="ml-auto justify-content-start">
                    <Button
                      variant="light"
                      type="submit"
                      className="mx-auto"
                      onClick={(e) => {
                        if (pageNo != 1) setPageNo(pageNo - 1);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrow-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                        />
                      </svg>
                    </Button>
                  </Col>
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
              </div>
            )}
          </Form>
        </Row>
      </Container>
    </>
  );
}

export default RescueRegister;
