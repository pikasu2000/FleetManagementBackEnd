const Activity = require("../models/activity.model");

let ioInstance;

function initSocketIO(io) {
  ioInstance = io;
}

async function logActivity({
  type,
  message,
  userId,
  vehicleId,
  driverId,
  tripId,
  geofenceId,
  maintenanceId,
}) {
  const activity = new Activity({
    type,
    message,
    userId,
    relatedVehicle: vehicleId || null,
    relatedDriver: driverId || null,
    relatedTrip: tripId || null,
    relatedGeofence: geofenceId || null,
    relatedMaintenance: maintenanceId || null,
  });

  await activity.save();

  // Emit activity if socket is initialized
  if (ioInstance) {
    ioInstance.emit(
      "new_activity",
      await activity.populate("userId relatedVehicle relatedDriver relatedTrip")
    );
  }
}

module.exports = { logActivity, initSocketIO };
