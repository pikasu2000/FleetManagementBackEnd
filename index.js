const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const { initSocketIO } = require("./utils/logActivity");

// All routes
const UserRouter = require("./routes/user.route");
const VehicleRouter = require("./routes/vehicle.route");
const TripRouter = require("./routes/trip.route");
const FuelRoutes = require("./routes/fuel.route");
const GeoFenceRoutes = require("./routes/geofence.route");
const MaintenanceRoutes = require("./routes/maintainece.route");
const logActivityRoutes = require("./routes/activity.route");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", UserRouter);
app.use("/api/vehicles", VehicleRouter);
app.use("/api/trips", TripRouter);
app.use("/api/fuel", FuelRoutes);
app.use("/api/geofences", GeoFenceRoutes);
app.use("/api/maintenance", MaintenanceRoutes);
app.use("/api/activity", logActivityRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Fleet Management API");
});

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
});

// Initialize ioInstance for logActivity
initSocketIO(io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server with Socket.IO
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
