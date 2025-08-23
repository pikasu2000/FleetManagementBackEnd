const express = require("express");
const router = express.Router();
const Activity = require("../models/activity.model");

// Get all activities
router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("userId", "name email username")
      .populate("relatedVehicle", "make model licensePlate")
      .populate("relatedDriver", "name username email")
      .populate("relatedTrip", "name status")
      .populate("relatedGeofence", "name")
      .populate("relatedMaintenance", "type dueDate mileageDue completed notes")
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
