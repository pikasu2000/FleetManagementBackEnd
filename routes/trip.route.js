const express = require("express");
const {
  createTrip,
  viewTrips,

  deleteTrip,
} = require("../controllers/trip.controller");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");
const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createTrip
);
router.get(
  "/view",
  authMiddleware,
  roleMiddleware("admin", "manager", "driver"),
  viewTrips
);

router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteTrip
);

module.exports = router;
