'use strict';
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        checkInTime: { type: Date, required: true },
        checkOutTime: { type: Date, default: null },
        markedBy: { type: String, enum: ['qr', 'manual', 'trainer'], default: 'manual' },
        markedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        notes: { type: String },
    },
    { timestamps: true }
);

// Prevent duplicate attendance on same day
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
