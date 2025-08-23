const Geofence = require("../models/geofence.model");
const GeofenceAlert = require("../models/geofenceAlert.model");

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}

const addGeofence = async (req, res) => {
  try {
    const { name, vehicleId, center, radius } = req.body;

    const geofence = new Geofence({ name, vehicleId, center, radius });
    console.log("New Geofence Created:", geofence);
    await geofence.save();
    res.status(201).json({ success: true, data: geofence });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllGeofences = async (req, res) => {
  try {
    const geofences = await Geofence.find().populate(
      "vehicleId",
      "name licensePlate"
    );
    res.status(200).json({ success: true, data: geofences });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const checkGeofence = async (req, res) => {
  try {
    const { vehicleId, lat, lng } = req.body;

    const geofences = await Geofence.find({ vehicleId, active: true });

    let alerts = [];

    geofences.forEach((geo) => {
      const distance = getDistanceFromLatLonInMeters(
        lat,
        lng,
        geo.center.lat,
        geo.center.lng
      );
      if (distance > geo.radius) {
        // Create alert
        const alert = new GeofenceAlert({
          vehicleId,
          geofenceId: geo._id,
          alertMessage: `Vehicle exited geofence: ${geo.name}`,
        });
        alert.save();
        alerts.push(alert);
      }
    });

    res.status(200).json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getAllAlerts = async (req, res) => {
  try {
    const alerts = await GeofenceAlert.find().populate(
      "vehicleId geofenceId",
      "name licensePlate"
    );
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  addGeofence,
  getAllGeofences,
  checkGeofence,
  getAllAlerts,
};
