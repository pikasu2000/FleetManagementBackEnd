const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Fleet Management API");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
