const mongoose = require("mongoose");

const fuelSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    tripDate: {
      type: Date,
      default: Date.now,
    },
    startMileage: {
      type: Number,
      required: true,
    },
    endMileage: {
      type: Number,
      required: true,
    },
    fuelUsed: {
      type: Number,
      required: true,
    },
    expectedFuel: {
      type: Number,
    },
    inefficiencyFlag: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fuel", fuelSchema);
