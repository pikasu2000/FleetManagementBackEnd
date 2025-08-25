const express = require("express");
const {
  createTrip,
  viewAllTrips,
  updateTripStatus,
  viewUserTrips,
  viewDriverTrips,
  deleteTrip,
} = require("../controllers/trip.controller");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");

const router = express.Router();

// Create a new trip (admin or manager)
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin", "manager", "user"),
  createTrip
);

// View trips (admin, manager, driver)
router.get(
  "/view/all",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  viewAllTrips
);

router.get(
  "/view/user",
  authMiddleware,
  roleMiddleware("admin", "manager", "user"),
  viewUserTrips
);
router.get(
  "/view/driver",
  authMiddleware,
  roleMiddleware("admin", "manager", "driver"),
  viewDriverTrips
);

// Delete a trip (admin only)
router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteTrip
);

// Update trip status (assign driver or driver response)
router.put(
  "/update/:tripId",
  authMiddleware,
  roleMiddleware("admin", "manager", "driver", "user"),
  updateTripStatus
);

module.exports = router;
