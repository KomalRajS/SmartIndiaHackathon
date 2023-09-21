import React, { useEffect } from "react";

import NavBar from "./Navbar/Navbar";
import Map from "./Map";
function Homepage() {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div>
        <Map></Map>
      </div>
    </>
  );
}

export default Homepage;
