const Maintenance = require("../models/maintainence.model");

const addMaintenance = async (req, res) => {
  try {
    const { vehicleId, type, dueDate, mileageDue, notes } = req.body;
    
    const maintenance = new Maintenance({
      vehicleId,
      type,
      dueDate,
      mileageDue,
      notes,
    });
    console.log("New Maintenance Created:", maintenance);
    await maintenance.save();
    res.status(201).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate("vehicleId", "make model licensePlate")
      .sort({ dueDate: 1 });
    console.log(maintenance);
    res.status(200).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const completeMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await Maintenance.findByIdAndUpdate(
      id,
      { completed: true },
      { new: true }
    );
    res.status(200).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addMaintenance,
  getAllMaintenance,
  completeMaintenance,
};
