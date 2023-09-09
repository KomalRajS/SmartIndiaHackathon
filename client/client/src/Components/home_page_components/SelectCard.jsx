import React from "react";
import Image from "react-bootstrap/Image";

function Selectcard(props) {
  return (
    <div className="position-relative">
      <Image
        src={props.image}
        alt="hello"
        className="opacity-4 w-100 h-100 object-cover"
      />
      <div className="bg-dark text-white position-absolute top-0 left-0 w-100 h-100 font-weight-bold m-3 text-2xl">
        {/* <p className="left-3 bottom-3 text-xl font-bold text-white position-absolute"></p> */}
        {props.text}
      </div>
    </div>
  );
}

export default Selectcard;
