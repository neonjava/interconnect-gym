'use strict';
const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema(
    {
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        logDate: { type: Date, required: true },
        weight: { type: Number }, // kg
        bodyFat: { type: Number }, // %
        chest: { type: Number }, // cm
        waist: { type: Number }, // cm
        hips: { type: Number }, // cm
        arms: { type: Number }, // cm
        notes: { type: String },
        photos: [{ type: String }], // file paths
    },
    { timestamps: true }
);

progressLogSchema.index({ memberId: 1, logDate: -1 });

module.exports = mongoose.model('ProgressLog', progressLogSchema);
