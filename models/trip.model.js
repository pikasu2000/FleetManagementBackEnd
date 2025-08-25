const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",

      default: null,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    distance: { type: Number },
    status: {
      type: String,
      enum: ["pending", "assigned", "ongoing", "completed", "canceled"],
      default: "pending",
    },
    tripType: { type: String, enum: ["delivery", "passenger", "personal"] },
    purpose: { type: String },
    fuelUsed: { type: Number },
    driverAccepted: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
