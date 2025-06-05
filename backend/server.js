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
const mongoose = require("mongoose");
const { handleMulterError } = require("./middlewares/upload");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

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
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization"]
  }
});

// Connect to MongoDB first
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: Object.values(err.errors).map(e => e.message).join(', ')
    });
  }

  // Handle mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }

  // Handle Cloudinary errors
  if (err.name === 'CloudinaryError') {
    return res.status(500).json({
      error: 'Error uploading file to cloud storage'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Notora Backend");
});

app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/chat", chatRoutes);

// Socket.IO connection handling
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication token not provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new Error("User not found"));
    }

    socket.user = user;
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user.name);

  socket.on("join_room", async (room) => {
    try {
      console.log(`${socket.user.name} joined room: ${room}`);
      socket.join(room);

      // Fetch recent messages for the room
      const messages = await Message.find({ room })
        .sort({ timestamp: -1 })
        .limit(50)
        .populate("sender", "name");

      socket.emit("room_messages", messages);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "Failed to join room");
    }
  });

  socket.on("send_message", async (messageData) => {
    try {
      console.log("Received message:", messageData);
      
      // Create new message
      const message = new Message({
        content: messageData.content,
        room: messageData.room,
        sender: socket.user._id,
        senderName: socket.user.name,
        isAdmin: socket.user.role === "admin", // Set isAdmin based on user role
        timestamp: new Date()
      });

      await message.save();
      console.log("Message saved:", message);

      // Broadcast message to room
      io.to(messageData.room).emit("receive_message", {
        _id: message._id,
        content: message.content,
        room: message.room,
        sender: message.sender,
        senderName: message.senderName,
        isAdmin: message.isAdmin,
        timestamp: message.timestamp
      });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("leave_room", (room) => {
    console.log(`${socket.user.name} left room: ${room}`);
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.name);
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

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});