const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const UserRouter = require("./routes/user.route");
app.use(express.json());

// const createDefaultAdmin = require("./utils/adminCreate");
app.use(cors());
app.use("/api/users", UserRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Fleet Management API");
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // createDefaultAdmin();
  });
});
