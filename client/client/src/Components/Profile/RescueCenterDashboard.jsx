import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MonitorMap from "./RescueCenterComponents/MonitorMap";
import NavBar from "../Navbar/Navbar";
import RescueCenter from "./RescueCenter";
export default function RescueCenterDashboard() {
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
      <RescueCenter></RescueCenter>
    </>
  );
}
