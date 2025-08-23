const TripModel = require("../models/trip.model");

const createTrip = async (req, res) => {
  try {
    const tripData = req.body;
    console.log(tripData);
    const newTrip = new TripModel(tripData);
    await newTrip.save();
    res
      .status(201)
      .json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({
      success: false,
      message: "Trip Add Failed",
      error: error.message,
    });
  }
};

const viewTrips = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id.toString();
    console.log("Logged in user:", req.user);

    let trips;

    if (userRole === "admin" || userRole === "manager") {
      trips = await TripModel.find()
        .populate({ path: "vehicleId", select: "make model licensePlate" })
        .populate({ path: "driverId", select: "username profile" });
    } else if (userRole === "driver") {
      // Drivers see only their trips
      trips = await TripModel.find({
        $expr: {
          $eq: [{ $toString: "$driverId" }, userId], // convert driverId to string
        },
      })
        .populate({ path: "vehicleId", select: "make model licensePlate" })
        .populate({ path: "driverId", select: "username profile" });
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    console.log("Trips found:", trips.length);
    res.status(200).json({ success: true, trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
};
const deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    const trip = await TripModel.findByIdAndDelete(tripId);

    res.status(200).json({ success: true, trip });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch trip",
      error: error.message,
    });
  }
};

module.exports = {
  createTrip,
  viewTrips,

  deleteTrip,
};
