const express = require("express");
const router = express.Router();
const {
  addFuelEntry,
  getFuelByVehicle,
  getAllFuelEntries,
  updateFuelEntry,
  deleteFuelEntry,
} = require("../controllers/fuel.controller");

router.post("/", addFuelEntry);
router.get("/:vehicleId", getFuelByVehicle);
router.get("/", getAllFuelEntries);
router.put("/:id", updateFuelEntry);
router.delete("/:id", deleteFuelEntry);

module.exports = router;
