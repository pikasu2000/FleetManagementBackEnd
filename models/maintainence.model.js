const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    type: { type: String, required: true },
    dueDate: { type: Date, required: true },
    mileageDue: { type: Number }, // optional: trigger based on mileage
    completed: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
