const Fuel = require("../models/fuel.model");
const Vehicle = require("../models/Vehicle.model");

const addFuelEntry = async (req, res) => {
  try {
    const { vehicleId, driverId, startMileage, endMileage, fuelUsed } =
      req.body;
    const distance = endMileage - startMileage;
    const expectedFuel = distance * 0.1;
    const inefficiencyFlag = fuelUsed > expectedFuel;

    const fuelEntry = new Fuel({
      vehicleId,
      driverId,
      startMileage,
      endMileage,
      fuelUsed,
      expectedFuel,
      inefficiencyFlag,
    });

    await fuelEntry.save();
    res.status(201).json({ success: true, data: fuelEntry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getFuelByVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const fuelData = await Fuel.find({ vehicleId })
      .populate("driverId", "name")
      .sort({ tripDate: -1 });
    res.status(200).json({ success: true, data: fuelData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllFuelEntries = async (req, res) => {
  try {
    const fuelData = await Fuel.find().populate(
      "vehicleId driverId",
      "name licensePlate"
    );
    res.status(200).json({ success: true, data: fuelData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateFuelEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Recalculate inefficiency if fuelUsed or mileage changed
    if (
      updatedData.startMileage !== undefined &&
      updatedData.endMileage !== undefined &&
      updatedData.fuelUsed !== undefined
    ) {
      const distance = updatedData.endMileage - updatedData.startMileage;
      updatedData.expectedFuel = distance * 0.1;
      updatedData.inefficiencyFlag =
        updatedData.fuelUsed > updatedData.expectedFuel;
    }

    const fuelEntry = await Fuel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({ success: true, data: fuelEntry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteFuelEntry = async (req, res) => {
  try {
    const { id } = req.params;
    await Fuel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Fuel entry deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addFuelEntry,
  getFuelByVehicle,
  getAllFuelEntries,
  updateFuelEntry,
  deleteFuelEntry,
};
