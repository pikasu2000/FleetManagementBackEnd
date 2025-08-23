const mongoose = require('mongoose');

const geofenceAlertSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    geofenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Geofence', required: true },
    alertMessage: { type: String, required: true },
    alertDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('GeofenceAlert', geofenceAlertSchema);
