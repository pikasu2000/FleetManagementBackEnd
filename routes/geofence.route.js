const express = require("express");
const router = express.Router();
const {
  addGeofence,
  getAllGeofences,
  checkGeofence,
  getAllAlerts,
} = require("../controllers/geofence.controller");
const roleMiddleware = require("../middlewares/role.middleware");
const authMiddleware = require("../middlewares/auth.middlware");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  addGeofence
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  getAllGeofences
);
router.post("/check", authMiddleware, checkGeofence);
router.get("/alerts", authMiddleware, getAllAlerts);

module.exports = router;
