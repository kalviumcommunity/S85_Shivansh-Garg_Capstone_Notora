const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

connectDB();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to Notora Backend");
});

app.use("/api", noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});