const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: String,
    message: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    relatedVehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    relatedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    relatedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },
    relatedGeofence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Geofence",
      default: null,
    },
    relatedMaintenance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maintenance",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
