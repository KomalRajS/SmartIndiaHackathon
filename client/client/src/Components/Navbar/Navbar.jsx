import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Form } from "react-bootstrap";
import { useUserContext } from "../Context";

const NavBar = ({ searchbox }) => {
  const [logo, setlogo] = useState();
  const { user } = useUserContext();
  const logoclick = () => {};

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Navbar.Brand href="#">💡 Samrt India Hackathon</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#action1">Home</Nav.Link>
            <Nav.Link href="#action2">Link</Nav.Link>

            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <Form className="d-flex justify-content-start">{searchbox}</Form>
          {user && <div>{user.username}</div>}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
