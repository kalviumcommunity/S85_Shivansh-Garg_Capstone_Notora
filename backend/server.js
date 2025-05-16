const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to Notora Backend");
});

app.use("/api", noteRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});