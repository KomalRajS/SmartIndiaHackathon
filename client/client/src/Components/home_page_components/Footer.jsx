import React from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

function Footer() {
  return (
    <div className="bg-gray-100 py-4">
      <Container>
        <Row className="text-center justify-content-between align-items-center">
          <Col>
            <h1>Traveligo</h1>
          </Col>
          <Col xs={12} sm={6} className="mt-3 mt-sm-0">
            <Nav className="justify-content-center">
              <Nav.Item>
                <Nav.Link href="#">
                  <FaGithub className="icon" />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">
                  <FaInstagram className="icon" />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#">
                  <FaLinkedin className="icon" />
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <ul>
              <li>About</li>
              <li>Partnerships</li>
              <li>Advertising</li>
              <li>Issues</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Footer;
