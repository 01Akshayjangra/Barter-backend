const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // import cors package

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

var cookieParser = require('cookie-parser');
const app = express();
// const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const path = require("path");

dotenv.config({ path: './config.env' })
require("./config/db");

const corsOptions = {
  origin: '*'
};

app.use(cors(corsOptions));
app.use(express.json()); //to accept json data
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`The server is running at localhost:${port}`)
})


const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*'
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (!userData || !userData._id) {
      socket.emit("error", "Invalid user data"); // Emit an error event
      return;
    }

    socket.join(userData._id);
    socket.emit("connected");
  });

    socket.on("join chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;

      if (!chat.users) return console.log("chat.users not defined");

      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;

        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
});

