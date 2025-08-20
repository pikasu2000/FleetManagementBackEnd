const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

// All routes Link
const UserRouter = require("./routes/user.route");
const VehicleRouter = require("./routes/vehicle.route");
const TripRouter = require("./routes/trip.route");
// const createDefaultAdmin = require("./utils/adminCreate");

app.use(express.json());

app.use(cors());
app.use("/api/users", UserRouter);
app.use("/api/vehicles", VehicleRouter);
app.use("/api/trips", TripRouter);

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
