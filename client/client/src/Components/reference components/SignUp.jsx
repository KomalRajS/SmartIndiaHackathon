import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setconfirmpass] = useState("");
  const [rescueteam, setrescueteam] = useState(false);
  const [mobileno, setmobileno] = useState();
  const [disablecheck, setdisablecheck] = useState(true);
  const [authotp, setauthotp] = useState();
  const [rescuecentername, setrescuecentername] = useState("");
  const [address, setaddress] = useState("");
  const [discription, setdiscription] = useState("");
  const [rescueslider, setrescueslider] = useState(0);
  const [specification, setspecification] = useState("");
  const [calamities, setcalamities] = useState([]);
  const [calamity, setcalamity] = useState("");
  const [availability, setavailability] = useState(0);
  const [capacity, setcapacity] = useState();
  const [disablenext, setdisablenext] = useState(false);

  const handlesignup = (event) => {};

  async function sendotp(event) {
    event.preventDefault();

    try {
      await axios
        .post("http://localhost:4000/auth/verify", {
          country_code: "+91",
          phone_no: mobileno,
        })
        .then(function (response) {
          alert(response.message);
        });

      setdisablecheck(false);
    } catch (error) {
      console.log(error);
      alert("check mobile no");
    }
  }

  async function signup(event) {
    event.preventDefault();

    try {
      await axios
        .post("http://localhost:4000/auth/user/register", {
          email: email,
          password: password,
          verCode: authotp,
          country_code: "+91",
          phone_no: mobileno,
        })
        .then(function (response) {
          alert(response.message);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const addcalamities = async (event) => {
    event.preventDefault();
    setcalamities((calamities) => [...calamities, calamity]);
    setcalamity("");
  };

  const nextbuttonhandle = (event) => {
    event.preventDefault();
    if (rescueslider == 2) {
      setdisablenext(true);
    } else {
      setrescueslider(rescueslider + 1);
    }
  };

  return (
    <form onSubmit={handlesignup} className=" bg-slate-100  h-full w-full">
      <div className=" cols-span-3 p-4  text-center">
        <div className=" text-pink-400 text-3xl m-5 font-bold">Rescue</div>
        <div className="rounded-2xl shadow-2xl flex flex-col w-1/4 h-full  items-center max-w-3xl max-h-8xl transition duration-1000 ease-out self-center mx-auto">
          <h2 className="p-3 text-3xl m-3 font-bold text-blue-400">
            Welcome Back
          </h2>

          <h3 className="text-blue-400 pt-2 text-2xl font-bold">Sign In</h3>
          <div className="flex space-x-2 m-4 items-center justify-center">
            <div className="icon">
              <FaFacebook />
            </div>
            <div className="icon">
              <FaGithub />
            </div>
            <div className="icon">
              <FaLinkedin />
            </div>
          </div>

          {/* Inputs */}

          <div className="m-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={rescueteam}
                onChange={() => setrescueteam(!rescueteam)}
                id="flexCheckDefault"
              />
              <label className="form-check-label" for="flexCheckDefault">
                Are u Registering as Rescue Team
              </label>
            </div>
          </div>

          {/* for user */}
          {!rescueteam && (
            <div className="flex flex-col items-center justify-center">
              <div className="m-3">
                <input
                  type="email"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                ></input>
              </div>
              <div className="m-3 ">
                <input
                  type="text"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                ></input>
              </div>
              <div className="m-3 ">
                <input
                  type="password"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="Confirm Password"
                  value={confirmpass}
                  onChange={(event) => setconfirmpass(event.target.value)}
                ></input>
              </div>
              <div className="m-3 ">
                <input
                  type="number"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="enter your mobile no"
                  value={mobileno}
                  onChange={(event) => setmobileno(event.target.value)}
                ></input>
              </div>
              <div className="m-3 ">
                <input
                  type="number"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="enter OTP"
                  value={authotp}
                  onChange={(event) => setauthotp(event.target.value)}
                ></input>
              </div>
              <button
                type="button"
                className="button m-2 bg-blue-400 bg-opacity-40 text-blue-600 font-bold text-xl rounded-lg px-4 py-2"
                onClick={sendotp}
              >
                Send OTP
              </button>

              <button
                type="submit"
                onClick={signup}
                disabled={disablecheck}
                style={disablecheck ? { filter: "blur(1px)" } : {}}
                className="button m-2 bg-blue-400 bg-opacity-40 text-blue-600 font-bold text-xl rounded-lg px-4 py-2"
              >
                Sign Up
              </button>
            </div>
          )}

          {rescueslider === 0 && rescueteam && (
            <div>
              <div className="m-3">{`Step ${rescueslider + 1} / 3`}</div>
              <div className="m-3">
                <input
                  type="text"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Enter name of rescue center"
                  value={rescuecentername}
                  onChange={(event) => setrescuecentername(event.target.value)}
                ></input>
              </div>
              <div className="m-3">
                <input
                  type="email"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                ></input>
              </div>
              <div className="m-3 ">
                <input
                  type="text"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                ></input>
              </div>
              <div className="m-3 ">
                <input
                  type="password"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="Confirm Password"
                  value={confirmpass}
                  onChange={(event) => setconfirmpass(event.target.value)}
                ></input>
              </div>
              <div className="m-3">
                <input
                  type="text"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Enter name of rescue center"
                  value={address}
                  onChange={(event) => setaddress(event.target.value)}
                ></input>
              </div>
              <div className="m-3">
                <input
                  type="text"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Enter name of rescue center"
                  value={discription}
                  onChange={(event) => setdiscription(event.target.value)}
                ></input>
              </div>
            </div>
          )}

          {rescueslider === 1 && rescueteam && (
            <div>
              <div className="m-3">{`Step ${rescueslider + 1} / 3`}</div>
              <div className="m-3">
                <input
                  type="text"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Enter name of rescue center"
                  value={specification}
                  onChange={(event) => setspecification(event.target.value)}
                ></input>
              </div>
              <div className="m-3">
                <input
                  type="email"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Email"
                  value={calamity}
                  onChange={(event) => setcalamity(event.target.value)}
                ></input>
              </div>

              <button onClick={addcalamities}>Add calamity</button>

              <div className="m-3">
                <input
                  type="number"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Enter name of rescue center"
                  value={capacity}
                  onChange={(event) => setcapacity(event.target.value)}
                ></input>
              </div>

              <div className="m-3">
                <input
                  type="number"
                  className="rounded-md p-2  border  border-cyan-700 w-60"
                  placeholder="Enter name of rescue center"
                  value={availability}
                  onChange={(event) => setavailability(event.target.value)}
                ></input>
              </div>
            </div>
          )}

          {rescueslider === 2 && rescueteam && (
            <div className="flex flex-col items-center justify-center">
              <div className="m-3">{`Step ${rescueslider + 1} / 3`}</div>
              <div className="m-3 ">
                <input
                  type="number"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="enter your mobile no"
                  value={mobileno}
                  onChange={(event) => setmobileno(event.target.value)}
                ></input>
              </div>
              <div className="m-3 ">
                <input
                  type="number"
                  className="rounded-md p-2 border  border-cyan-700 w-60"
                  placeholder="enter OTP"
                  value={authotp}
                  onChange={(event) => setauthotp(event.target.value)}
                ></input>
              </div>
              <button
                type="button"
                className="button m-2 bg-blue-400 bg-opacity-40 text-blue-600 font-bold text-xl rounded-lg px-4 py-2"
                onClick={sendotp}
              >
                Send OTP
              </button>

              <button
                type="submit"
                onClick={signup}
                disabled={disablecheck}
                style={disablecheck ? { filter: "blur(1px)" } : {}}
                className="button m-2 bg-blue-400 bg-opacity-40 text-blue-600 font-bold text-xl rounded-lg px-4 py-2"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* next button for slider */}
          {rescueteam && (
            <button
              onClick={nextbuttonhandle}
              className="button"
              disabled={disablenext}
            >
              Next
            </button>
          )}

          <div className="flex gap-2 justify-center mb-4">
            <p className="text-blue-400 mt-4 text-lg">
              already have an account
            </p>
            <Link to={"/login"}>
              <p className="text-blue-600 mt-4 text-lg font-medium cursor-pointer">
                Sign In
              </p>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignUp;
