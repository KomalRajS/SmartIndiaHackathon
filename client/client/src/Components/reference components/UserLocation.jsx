import React, { useState } from "react";

function UserLocation() {
  const [details, setdetails] = useState(null);

  const getloc = () => {
    fetch(
      "https://geolocation-db.com/json/ad1930c0-2745-11ee-af9d-7935f0846d8a"
    )
      .then((response) => response.json())
      .then((data) => setdetails(data))
      .catch((error) => {
        console.log(error);
      });

    console.log(details);
  };

  return (
    <div>
      <div>
        <button onClick={getloc}>Get your location</button>
        {details && (
          <div>
            <div>{details.state}</div>
            <div>{details.latitude}</div>
            <div>{details.longitude}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserLocation;
