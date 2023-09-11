import React from "react";
import { useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import NavBar from "./Navbar/Navbar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
function Error() {
  const { state } = useLocation();
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div>
        <Card>
          <Card.Body>
            <Card.Title>{state}</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Error;
