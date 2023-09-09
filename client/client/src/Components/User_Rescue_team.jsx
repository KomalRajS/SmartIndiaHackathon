import React from "react";

import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function User_Rescue_team() {
  return (
    <div>
      <p>Are U user or Rescue Team</p>

      <Button
        variant="outline-secondary"
        onClick={<Link to={"/auth/rescue/register"} />}
      >
        Rescue Team
      </Button>

      <Button
        variant="outline-secondary"
        onClick={<Link to={"/auth/user/register"} />}
      >
        User
      </Button>
    </div>
  );
}

export default User_Rescue_team;
