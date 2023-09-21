import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MonitorMap from "./RescueCenterComponents/MonitorMap";
import NavBar from "../Navbar/Navbar";
import {
  Row,
  Col,
  Card,
  Placeholder,
  Alert,
  Form,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");

export default function RescueCenterRequestBaord() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [req, setReq] = useState([]);
  const { id: centerId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { user: User } = useUserContext();
  const [assigned, setAssigned] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:4000/rescue/requestboard/req/teammembers/${centerId}`
        );
        setTeamMembers(response.data);
      } catch (error) {
        navigate("/error", {
          state: [error.message, error.response.status],
        });
      }
    }
    function socketConnect() {
      const id = User._id;
      const roomId = centerId + "req";
      setUser({ username: User.username, roomId: roomId, userId: id });
      socket.auth = { username: User.username, roomId: roomId, userId: id };
      socket.connect();
    }
    socketConnect();

    socket.on("ask rescuecenter", (user) => {
      setReq([...req, user]);
    });

    fetchData();
  }, []);

  function asign(teammember) {
    console.log("hey", teammember);
    socket.emit("asign", teammember);
  }
  return (
    <>
      <NavBar></NavBar>
      <Row style={{ margin: "0px" }}>
        <Col sm="7">
          <MonitorMap url="req" id={centerId}></MonitorMap>
        </Col>
        <Col sm="5">
          <Row>
            <Card>
              <Card.Body>
                <Alert variant="success">
                  {req.map((e) => (
                    <>
                      <Alert.Heading>Hey, nice to see you</Alert.Heading>
                      <p>{JSON.stringify(e.username)}</p>

                      <Form.Select onChange={(e) => asign(e.target.value)}>
                        <option>select</option>
                        {teamMembers &&
                          teamMembers.map((e) => (
                            <option value={e._id}>{e.username}</option>
                          ))}
                      </Form.Select>
                    </>
                  ))}

                  <hr />
                </Alert>
              </Card.Body>
            </Card>
          </Row>
        </Col>
      </Row>
    </>
  );
}
