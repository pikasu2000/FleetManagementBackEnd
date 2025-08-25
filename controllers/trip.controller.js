const TripModel = require("../models/trip.model");
const mongoose = require("mongoose");
// 🔹 Common query builder
const getTrips = async (filter = {}) => {
  return TripModel.find(filter)
    .populate("vehicleId", "make model licensePlate")
    .populate("driverId", "username profile")
    .populate("userId", "username email")
    .sort({ createdAt: -1 });
};

// 🔹 Create a trip
const createTrip = async (req, res) => {
  try {
    const {
      vehicleId,
      startLocation,
      endLocation,
      startTime,
      endTime,
      distance,
      fuelUsed,
      tripType,
      purpose,
    } = req.body;

    if (
      !vehicleId ||
      !startLocation ||
      !endLocation ||
      !startTime ||
      !tripType
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const tripData = {
      userId: req.user._id,
      vehicleId,
      startLocation,
      endLocation,
      startTime,
      endTime: endTime || null,
      distance: distance || null,
      fuelUsed: fuelUsed || null,
      tripType,
      purpose,
      status: "pending",
      driverId: null,
    };
    // console.log("Creating trip:", req.body);
    const newTrip = await TripModel.create(tripData);

    res.status(201).json({
      success: true,
      message: "Trip requested successfully",
      trip: await newTrip.populate("vehicleId driverId userId"),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Update trip (assign driver or respond)
const updateTripStatus = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { driverId, action, updates } = req.body;
    const user = req.user;

    if (!tripId) return res.status(400).json({ message: "Trip ID required" });

    const trip = await TripModel.findById(tripId);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Manager/Admin assigns driver
    if (driverId && ["manager", "admin"].includes(user.role)) {
      trip.driverId = driverId;
      trip.status = "assigned";

      // Driver accepts/rejects
    } else if (action && user.role === "driver") {
      if (!trip.driverId || trip.driverId.toString() !== user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You are not assigned to this trip" });
      }
      if (action === "accept") {
        trip.driverAccepted = "accepted";
        trip.status = "ongoing";
      } else if (action === "reject") {
        trip.driverAccepted = "rejected";
        trip.status = "canceled";
      } else {
        return res.status(400).json({ message: "Invalid action" });
      }

      // Manager/Admin arbitrary updates
    } else if (updates && ["manager", "admin"].includes(user.role)) {
      Object.assign(trip, updates);

      // User cancel their own trip
    } else if (updates && user.role === "user") {
      if (updates.status === "canceled") {
        if (trip.userId.toString() !== user._id.toString()) {
          return res
            .status(403)
            .json({ message: "You can only cancel your own trip" });
        }
        trip.status = "canceled";
      } else {
        return res
          .status(403)
          .json({ message: "Users can only cancel their trips" });
      }
    } else {
      return res.status(400).json({ message: "Invalid operation" });
    }

    await trip.save();
    const populatedTrip = await trip.populate("vehicleId driverId userId");
    req.app.get("io")?.emit("tripUpdated", populatedTrip);

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      trip: populatedTrip,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// For admin and Mnager
const viewAllTrips = async (req, res) => {
  try {
    const { role } = req.user;

    if (!["admin", "manager"].includes(role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const trips = await getTrips();
    res.status(200).json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// for users
const viewUserTrips = async (req, res) => {
  try {
    const { role, _id } = req.user;

    if (role !== "user") {
      return res.status(403).json({ message: "Only users can view this" });
    }
    // console.log();
    const trips = await getTrips({ userId: new mongoose.Types.ObjectId(_id) });

    res.status(200).json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// for driver
const viewDriverTrips = async (req, res) => {
  try {
    const { role, _id } = req.user;

    if (role !== "driver") {
      return res.status(403).json({ message: "Only drivers can view this" });
    }

    const trips = await getTrips({
      driverId: new mongoose.Types.ObjectId(_id),
    });
    res.status(200).json({ success: true, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Delete trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await TripModel.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    res.status(200).json({ success: true, trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTrip,
  updateTripStatus,
  viewUserTrips,
  viewDriverTrips,
  viewAllTrips,
  deleteTrip,
};
