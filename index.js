const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const { initSocketIO } = require("./utils/logActivity");

// Route imports
const UserRouter = require("./routes/user.route");
const VehicleRouter = require("./routes/vehicle.route");
const TripRouter = require("./routes/trip.route");
const FuelRoutes = require("./routes/fuel.route");
const GeoFenceRoutes = require("./routes/geofence.route");
const MaintenanceRoutes = require("./routes/maintainece.route");
const LogActivityRoutes = require("./routes/activity.route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", UserRouter);
app.use("/api/vehicles", VehicleRouter);
app.use("/api/trips", TripRouter);
app.use("/api/fuel", FuelRoutes);
app.use("/api/geofences", GeoFenceRoutes);
app.use("/api/maintenance", MaintenanceRoutes);
app.use("/api/activity", LogActivityRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the Fleet Management API");
});

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend URL in production
    methods: ["GET", "POST"],
  },
});

// Initialize custom Socket.IO logic
initSocketIO(io);

// Socket connection events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
  });
