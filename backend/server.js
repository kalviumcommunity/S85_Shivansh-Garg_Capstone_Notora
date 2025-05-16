const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const connectDB = require("./config/db");

const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");

require("./passport/google");

const app = express();

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
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Welcome to Notora Backend");
});

app.use("/api", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/auth", googleAuthRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});