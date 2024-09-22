const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const { Server } = require("socket.io");

const port = process.env.PORT || 4500;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your client's URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello, it is working");
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`user is enter room ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", (socket) => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
