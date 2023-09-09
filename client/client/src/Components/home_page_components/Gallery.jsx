import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import Image from "react-bootstrap/Image";
import Selectcard from "./SelectCard";

function Gallary() {
  return (
    <div>
      <div className="mx-10 text-2xl font-weight-bold">Gallery</div>
      <Container className="max-w-1240px mx-auto px-4 py-10">
        <Row xs={1} sm={2} lg={3} gap={4}>
          <Col>
            <Selectcard image={maldives3} text="Dubai" />
          </Col>
          <Col>
            <Selectcard image={""} text="Medical" />
          </Col>
          <Col>
            <Selectcard image={""} text="Emergency" />
          </Col>
          <Col>
            <Selectcard image={""} text="Floods" />
          </Col>
          <Col>
            <Selectcard image={""} text="Scarcity of food" />
          </Col>
          <Col>
            <Selectcard image={""} text="Cylclone" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Gallary;
