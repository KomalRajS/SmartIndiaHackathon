import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import { useUserContext } from "../Context";
import { useNavigate } from "react-router-dom";
const NavBar = ({ searchbox }) => {
  const [logo, setlogo] = useState();
  const { user, logoutUser } = useUserContext();
  const logoclick = () => {};
  const navigate = useNavigate();
  useEffect(() => {});
  const logout = () => {
    logoutUser();
    navigate("/");
  };
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Navbar.Brand href="#">💡 Smart India Hackathon</Navbar.Brand>
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
          {user && (
            <>
              <div className="text-white">{user.username}</div>
              <Button onClick={(e) => logoutUser()}>logout</Button>
            </>
          )}
          {}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
