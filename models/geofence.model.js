const mongoose = require('mongoose');

const geofenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    center: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    radius: { type: Number, required: true }, // in meters
    active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Geofence', geofenceSchema);
