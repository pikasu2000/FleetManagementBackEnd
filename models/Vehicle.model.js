const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    licensePlate: { type: String, required: true, unique: true },
    mileage: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "maintenance", "retired"],
      default: "active",
    },

    location: {
      type: String,
    },
    maintenanceHistory: [
      {
        type: { type: String },
        date: { type: Date },
        mileageAtService: { type: Number },
        cost: { type: Number },
      },
    ],
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", VehicleSchema);
