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
    const trips = await TripModel.find();
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

const getTripById = async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = await TripModel.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

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
  getTripById,
};
