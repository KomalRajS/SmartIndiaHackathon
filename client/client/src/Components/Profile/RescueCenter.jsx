import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Stack,
  Badge,
  Placeholder,
} from "react-bootstrap";
import Chat from "../Chat";

export default function RescueCenter() {
  const [data, setData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:4000/rescue/dashboard/req/${id}`
        );
        setData(response.data);
      } catch (error) {}
    }

    fetchData();
  }, [id]);
  return (
    <>
      <Row className="p-2 " style={{ margin: "0px" }}>
        <Col sm={7} className="">
          <Row className="my-3">
            <Col sm={4}>
              <Card style={{ height: "18rem" }} className="  shadow">
                <Card.Body>
                  <Card.Title>Contact details</Card.Title>
                  {data.contact &&
                    data.contact.country_code &&
                    data.contact.phone_no &&
                    data.email && (
                      <>
                        <p>{data.contact.country_code} 8019929229</p>
                        <p>{data.email} </p>
                      </>
                    )}

                  <Card.Title>Address</Card.Title>
                  {data.address && <p>{data.address}</p>}

                  {data.description && (
                    <Card.Text>{data.description}</Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col sm={8}>
              <Card style={{ height: "18rem" }} className=" shadow ">
                <Card.Body>
                  {data.username && data.rest.availability && (
                    <>
                      <Card.Title className="mb-6">
                        {data.username}
                        <Badge
                          bg="success ms-1 text-white"
                          style={{ fontSize: "10px" }}
                        >
                          available
                        </Badge>
                      </Card.Title>
                    </>
                  )}
                  {data.rest && data.rest.services && (
                    <Stack
                      className="mt-3"
                      direction="horizontal"
                      gap={2}
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <strong>Services</strong>
                      <div>
                        {data.rest.services.map((e) => (
                          <Badge bg="secondary ms-1">{e}</Badge>
                        ))}
                      </div>
                    </Stack>
                  )}
                  {data.rest && data.rest.calamities && (
                    <Stack
                      direction="horizontal"
                      gap={2}
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <strong>Calamities</strong>
                      <div>
                        {data.rest.calamities.map((e) => (
                          <Badge bg="secondary ms-1">{e}</Badge>
                        ))}
                      </div>
                    </Stack>
                  )}
                  {data.rest && data.rest.medical_facility && (
                    <Stack
                      direction="horizontal"
                      gap={2}
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <strong>medical facility</strong>
                      <div>
                        {data.rest.medical_facility.map((e) => (
                          <Badge bg="secondary ms-1">{e}</Badge>
                        ))}
                      </div>
                    </Stack>
                  )}
                  {data.rest && data.rest.supply_and_resource && (
                    <Stack
                      direction="horizontal"
                      gap={2}
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <strong>supply and resource</strong>
                      <div>
                        {data.rest.supply_and_resource.map((e) => (
                          <Badge bg="secondary ms-1">{e}</Badge>
                        ))}
                      </div>
                    </Stack>
                  )}
                  {data.rest && data.rest.specialization && (
                    <Stack
                      direction="horizontal"
                      gap={2}
                      style={{ display: "flex", flexWrap: "wrap" }}
                    >
                      <strong>specialization</strong>
                      <div>
                        {data.rest.specialization.map((e) => (
                          <Badge bg="secondary ms-1">{e}</Badge>
                        ))}
                      </div>
                      <Button className="ms-auto " variant="light">
                        📝
                      </Button>
                    </Stack>
                  )}
                </Card.Body>
                {data.updatedAt && (
                  <p className="text-muted ms-2 " style={{ fontSize: "10px" }}>
                    <strong>last updated</strong> {data.updatedAt}
                  </p>
                )}
              </Card>
            </Col>
          </Row>
          <Row className="">
            <Col>
              <Card style={{ height: "fit-content" }}>
                <Card.Body></Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col sm={5} className="my-2">
          <Card style={{ height: "34rem" }} className="shadow">
            <Card.Body>
              <Chat id={id}> </Chat>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
