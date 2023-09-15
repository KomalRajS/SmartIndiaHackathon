if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const app = express();
const { urlencoded } = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const ejsMate = require("ejs-mate");
const User = require("./models/user");

//socket server
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: "http://localhost:3000", // Set the correct origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
  credentials: true, // Enable CORS with credentials (e.g., cookies)
};

app.use(cors(corsOptions));
//setting view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(urlencoded({ extended: true }));

//setting body parser
app.use(bodyParser.json());

const dbUrl =
  process.env.MONGODB_URL || "mongodb://localhost:27017/template-db";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//passport configuration
app.use(express.urlencoded({ extended: true }));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//sessions and coockies configuration
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: dbUrl,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//routes
const userAuthRoutes = require("./router/AuthenticationRoutes/user");
const rescuerAuthRoutes = require("./router/AuthenticationRoutes/rescuer");
app.use("/auth", userAuthRoutes);
app.use("/auth", rescuerAuthRoutes);

const allRescueCentersDataRoutes = require("./router/RescueCenterRoutes/rescueData");
app.use("/rescue", allRescueCentersDataRoutes);
const allRequestsData = require("./router/RescueCenterRoutes/RequestsData");
app.use("/rescue", allRequestsData);

const rescueCenterDashboard = require("./router/RescueCenterRoutes/dashboard");
app.use("/rescue", rescueCenterDashboard);

const requestBoardRoutes = require("./router/RescueCenterRoutes/RequestBoard");
app.use("/rescue", requestBoardRoutes);

// ------------------------scoket-------------------------------//

const http = require("http"); // You'll need the http module for Socket.IO
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const server = http.createServer(app);

//cors

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//socket route

app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io-client/dist/socket.io.js");
});
all_users = {};

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Invalid username"));
  }
  socket.roomId = socket.handshake.auth.roomId;
  socket.userId = socket.handshake.auth.userId;
  if (!all_users[socket.roomId]) all_users[socket.roomId] = [];
  socket.username = username;

  all_users[socket.roomId].push({
    userId: socket.userId,
    username: socket.username,
  });
  socket.join(socket.roomId);
  next();
});

io.on("connection", async (socket) => {
  //all connected users

  const users = all_users[socket.roomId];
  //all users event
  io.to(socket.roomId).emit("users", users);

  //connected user details

  //new user events
  socket.broadcast.to(socket.roomId).emit("user connected", {
    userId: socket.userId,
    username: socket.username,
  });

  //new message event
  socket.on("new message", (message) => {
    socket.broadcast.to(socket.roomId).emit("new message", {
      userId: socket.userId,
      username: socket.username,
      message,
    });
  });

  socket.on("ask request", (user) => {
    socket.roomId = socket.handshake.auth.roomId;
    socket.to(socket.handshake.auth.roomId).emit("ask rescuecenter", user);
  });

  socket.on("asign", (teamMemberId, teamMember) => {
    const roomId = socket.roomId + teamMemberId;
    const room = io.sockets.adapter.rooms.get(socket.roomId);

    io.emit("make new connection", roomId);
    io.emit("new message", {
      userId: teamMemberId,
      username: teamMember.username,
      message: teamMember.username,
    });
    if (room) {
      room.forEach((socketId) => {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
          socket.disconnect(true); // Disconnect the socket
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
