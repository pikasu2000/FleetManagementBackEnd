const VehicleModel = require("../models/Vehicle.model");
const User = require("../models/User.model");

// Manager and admin can only add vehicle
const createVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      licensePlate,
      mileage,
      status,
      assignedDriver,
      location,
      maintenanceHistory,
    } = req.body;

    const newVehicle = new VehicleModel({
      make,
      model,
      year,
      licensePlate,
      mileage,
      status,
      assignedDriver,
      location,
      maintenanceHistory,
    });

    await newVehicle.save();
    res
      .status(201)
      .json({ message: "Vehicle created successfully", vehicle: newVehicle });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await VehicleModel.find();
    res.status(200).json({ success: true, vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const editVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const updatedData = req.body;

    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      vehicleId,
      updatedData,
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const deletedVehicle = await VehicleModel.findByIdAndDelete(vehicleId);

    if (!deletedVehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      vehicle: deletedVehicle,
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  editVehicle,
  deleteVehicle,
};
