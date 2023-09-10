if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = require("express")();
const http = require("http"); // You'll need the http module for Socket.IO
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const server = http.createServer(app);
const cors = require("cors");

//cors

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: "http://localhost:3000", // Set the correct origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
  credentials: true, // Enable CORS with credentials (e.g., cookies)
};

app.use(cors(corsOptions));

//socket route

app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io-client/dist/socket.io.js");
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Invalid username"));
  }

  socket.username = username;
  socket.userId = uuidv4();
  next();
});

io.on("connection", async (socket) => {
  //all connected users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userId: socket.userId,
      username: socket.username,
    });
  }

  //all users event
  socket.emit("users", users);

  //connected user details
  socket.emit("session", { userId: socket.userId, username: socket.username });

  //new user events
  socket.broadcast.emit("user connected", {
    userId: socket.userId,
    username: socket.username,
  });

  //new message event
  socket.on("new message", (message) => {
    socket.broadcast.emit("new message", {
      userId: socket.userId,
      username: socket.username,
      message,
    });
  });
});

module.exports.chatServer = server;
