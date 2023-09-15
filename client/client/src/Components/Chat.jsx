import "font-awesome/css/font-awesome.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { useUserContext } from "./Context";
const socket = io("http://localhost:4000");

function Chat(props) {
  const [newUser, setNewUser] = useState("");
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const { user: User } = useUserContext();
  const { disableButton, setDisableButton } = useState(true);
  const [img, setImg] = useState(
    "data:image/png;base64,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"
  );
  const [messages, setMessages] = useState([]);
  let roomId = props.reqUserId || props.id;

  useEffect(() => {
    console.log("above", roomId);
    socket.on("users", (users) => {
      const messagesArr = [];
      for (const { userId, username } of users) {
        if (messages.some((e) => e.username == username)) break;
        const newMessage = {
          type: "userStatus",
          userId,
          username,
          isDisplayed: false,
        };
        messagesArr.push(newMessage);
      }
      setMessages([...messages, ...messagesArr]);
      setUsers(users);
    });

    socket.on("user connected", ({ userId, username }) => {
      if (messages.some((e) => e.id == userId)) return;
      const newMessage = {
        type: "userStatus",
        userId,
        username,
        isDisplayed: false,
      };
      setMessages([...messages, newMessage]);
    });

    socket.on("new message", ({ userId, username, message }) => {
      const newMessage = {
        type: "message",
        userId: userId,
        username: username,
        message,
      };
      setMessages([...messages, newMessage]);
    });

    socket.on("make new connection", (room) => {
      if (User && !User.rescue_team && !User.rest) {
        roomId = room;
        socket.disconnect();
        logNewUser();
      }
    });
  }, [socket, messages]);

  function handleChange({ currentTarget: input }) {
    setNewUser(input.value);
  }

  function logNewUser() {
    const id = User._id;
    setUser({ username: newUser, roomId: roomId, userId: id });
    socket.auth = { username: newUser, roomId: roomId, userId: id };
    socket.connect();
  }

  function sendMessage() {
    socket.emit("new message", message);

    const newMessage = {
      type: "message",
      userId: user.userId,
      username: user.username,
      message,
    };
    setMessages([...messages, newMessage]);
    setMessage("");
  }

  const updateMessage = (index) => {
    messages[index].isDisplayed = true;
    return true;
  };

  const sendRescueConnection = () => {
    const id = User._id;
    roomId = roomId + "req";
    setUser({ username: newUser, roomId: roomId, userId: id });
    socket.auth = { username: newUser, roomId: roomId, userId: id };
    socket.connect();
    socket.emit("ask request", User);
  };

  return (
    <main className="content">
      <div className="container mt-3">
        {user.userId && (
          <div className="card w-100 ">
            <div className="row vh-95">
              <div className="d-flex flex-column col-12 col-lg-12 col-xl-12 chat-window">
                {/*chat header*/}
                <div className="align-items-start py-2 px-4 w-100  d-lg-block sticky-top bg-white">
                  <div className="d-flex align-items-center py-1">
                    <div className="position-relative">
                      <img
                        src={img}
                        className="rounded-circle mx-2"
                        alt={user.username}
                        width="40"
                        height="40"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <strong>{user.username}</strong>
                    </div>
                  </div>
                </div>
                {/*chat header*/}

                {/*chat body*/}
                <div className="position-relative chat-height overflow-auto">
                  <ScrollableFeed>
                    <div className="d-flex flex-column p-4">
                      {messages.map((message, index) => {
                        return message.type === "userStatus" ? (
                          !message.isDisplayed ? (
                            <div key={index} className="text-center">
                              <span
                                className="badge text-dark"
                                style={{ backgroundColor: "#e7e7e7" }}
                              >
                                {message.userId === user.userId
                                  ? "You have joined"
                                  : `${message.username} has joined`}
                              </span>
                            </div>
                          ) : (
                            ""
                          )
                        ) : (
                          <div
                            key={index}
                            className={
                              message.userId === user.userId
                                ? "chat-message-right pb-4"
                                : "chat-message-left pb-4"
                            }
                          >
                            <div>
                              <img
                                src={img}
                                className="rounded-circle mr-1"
                                alt={message.username}
                                title={message.username}
                                width="40"
                                height="40"
                              />
                              <div className="font-weight-bold mb-1">
                                {message.userid === user.userId
                                  ? "You"
                                  : message.username}
                              </div>
                            </div>
                            <div>
                              <div
                                className="flex-shrink-1  rounded py-1 px-1 ml-3 overflow-auto txt  "
                                style={{
                                  fontSize: "15px",
                                  backgroundColor: "#66636321",
                                }}
                              >
                                {message.message}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollableFeed>
                </div>
                {/*chat body*/}

                {/*input message*/}
                <div className="align-items-end  py-3 px-4  d-lg-block mt-auto chat-input">
                  <div className="input-group flex-fill ">
                    <input
                      type="text"
                      className="form-control "
                      name="message"
                      value={message}
                      placeholder="Enter your message......"
                      onChange={({ currentTarget: input }) =>
                        setMessage(input.value)
                      }
                      onKeyDown={(e) =>
                        e.code === "Enter" ? sendMessage() : null
                      }
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() => sendMessage()}
                    >
                      Send
                    </button>
                  </div>
                </div>
                {/*input message*/}
              </div>
            </div>
          </div>
        )}
        <div className="card w-100 text-center border-white">
          {!user.userId && (
            <div className="row">
              <div className="col-12">
                <h5>Enter your name</h5>
              </div>
              <div className="d-flex align-items-center justify-content-center ">
                <div className="col-4 position-relative">
                  <input
                    type="text"
                    name="username"
                    value={newUser}
                    className="form-control mb-3"
                    placeholder="Username"
                    autoComplete="off"
                    onChange={(e) => handleChange(e)}
                    onKeyDown={(e) =>
                      e.code === "Enter" && User && User.rescue_team
                        ? logNewUser()
                        : null
                    }
                  />
                  <button
                    className="btn btn-primary"
                    disabled={disableButton}
                    onClick={() =>
                      User && (User.rescue_team || User.rest)
                        ? logNewUser()
                        : sendRescueConnection()
                    }
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Chat;
