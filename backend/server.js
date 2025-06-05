const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const connectDB = require("./config/db");
const Message = require("./models/chatModel");
const cron = require('node-cron');

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const chatRoutes = require("./routes/chatRoutes");

require("./passport/google");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

connectDB();

app.use(cors({
  origin: "http://localhost:5173", // 🛡️ React frontend URL
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "notora_secret_key",
  resave: false,
  saveUninitialized: true,
    cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const message = new Message({
        sender: data.sender,
        content: data.content,
        room: data.room,
        senderName: data.senderName
      });
      await message.save();
      
      io.to(data.room).emit("receive_message", {
        sender: data.sender,
        senderName: data.senderName,
        content: data.content,
        room: data.room,
        timestamp: message.createdAt
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Delete messages older than 5 days every day at midnight
cron.schedule('0 0 * * *', async () => {
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  try {
    await Message.deleteMany({ createdAt: { $lt: fiveDaysAgo } });
    console.log('Old chat messages deleted');
  } catch (err) {
    console.error('Error deleting old messages:', err);
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to Notora Backend");
});

app.use("/api", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});