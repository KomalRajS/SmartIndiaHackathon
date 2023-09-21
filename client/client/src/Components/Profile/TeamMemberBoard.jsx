import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MonitorMap from "./RescueCenterComponents/MonitorMap";
import NavBar from "../Navbar/Navbar";
import { Row, Col, Card, Placeholder } from "react-bootstrap";
import { useUserContext } from "../Context";
import { useNavigate } from "react-router-dom";
import Chat from "../Chat";
export default function TeamMemberBoard() {
  const [data, setData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: User } = useUserContext();
  const [handlingReq, setHandlingReq] = useState(false);
  const [allReqLoc, setAllReqLoc] = useState([]);

  const updateAllReqLoc = (data) => {
    console.log("hey", data);
    setAllReqLoc([...allReqLoc, data]);
  };

  useEffect(() => {
    console.log(id);
    async function fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:4000/rescue/dashboard/req/${id}`
        );
        setData(response.data);
      } catch (error) {
        navigate("/error", {
          state: [error.message, error.response.status],
        });
      }
    }

    fetchData();
  }, [id]);

  return (
    <>
      <NavBar></NavBar>
      <Row style={{ margin: "0px" }}>
        <Col sm="7">
          <MonitorMap url="req" id={id} allReqMarkers={allReqLoc}></MonitorMap>
        </Col>
        <Col sm="5">
          <Row>
            <Card>
              <Chat
                reqUserId={id + "req" + User._id}
                updateAllReqLocFun={updateAllReqLoc}
              ></Chat>
            </Card>
          </Row>
        </Col>
      </Row>
    </>
  );
}
