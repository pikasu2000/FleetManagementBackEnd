const express = require("express");
const {
  createTrip,
  viewTrips,
  getTripById,
} = require("../controllers/trip.controller");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");
const router = express.Router();

router.post("/create", authMiddleware, createTrip);
router.get("/view", authMiddleware, viewTrips);
router.get("/view/:id", authMiddleware, getTripById);

module.exports = router;
