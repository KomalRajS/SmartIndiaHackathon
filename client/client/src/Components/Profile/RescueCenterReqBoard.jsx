import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MonitorMap from "./RescueCenterComponents/MonitorMap";
import NavBar from "../Navbar/Navbar";
import { Row, Col, Card, Placeholder } from "react-bootstrap";

export default function RescueCenterRequestBaord() {
  const [data, setData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:4000/rescue/dashboard/req/${id}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [id]);

  return (
    <>
      <NavBar></NavBar>
      <Row style={{ margin: "0px" }}>
        <Col sm="7">
          <MonitorMap></MonitorMap>
        </Col>
        <Col sm="5">
          <Card>
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder.Button variant="primary" xs={6} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
