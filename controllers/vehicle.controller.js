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
    const vehicles = await VehicleModel.find().populate(
      "assignedDriver",
      "username profile.name email role"
    );

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

const updateVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const updatedData = { ...req.body };

    // Optional: Clean up assignedDriver field
    if (updatedData.assignedDriver) {
      if (
        typeof updatedData.assignedDriver === "object" &&
        updatedData.assignedDriver._id
      ) {
        updatedData.assignedDriver = updatedData.assignedDriver._id;
      }
    }

    // Just update with whatever fields are provided
    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      vehicleId,
      updatedData,
      { new: true, runValidators: true }
    ).populate("assignedDriver", "username profile.name email role");

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

const VehicleByID = async (req, res) => {
  try {
    const vehicleId = req.params.id;

    const vehicle = await VehicleModel.findById(vehicleId).populate(
      "assignedDriver"
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error: error.message,
    });
  }
};

// Assign driver to a vehicle
const AssignDriver = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const { driverId } = req.body;

    const driver = await User.findById(driverId);
    if (!driver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    vehicle.assignedDriver = driverId;
    await vehicle.save();

    return res.status(200).json({
      success: true,
      message: "Driver assigned successfully",
      vehicle,
    });
  } catch (error) {
    console.error("Error assigning driver:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while assigning driver",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  VehicleByID,
  AssignDriver,
};
