const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    purpose: { type: String },
    fuelUsed: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
