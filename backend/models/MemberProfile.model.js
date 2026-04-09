'use strict';
const mongoose = require('mongoose');

const memberProfileSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        dateOfBirth: { type: Date },
        gender: { type: String, enum: ['male', 'female', 'other'] },
        height: { type: Number }, // cm
        weight: { type: Number }, // kg
        goal: { type: String, trim: true },
        assignedTrainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        joinDate: { type: Date, default: Date.now },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
            relation: { type: String },
        },
        medicalNotes: { type: String },
    },
    { timestamps: true }
);

memberProfileSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;
    const ageDiff = Date.now() - this.dateOfBirth.getTime();
    return Math.abs(new Date(ageDiff).getUTCFullYear() - 1970);
});

memberProfileSchema.set('toObject', { virtuals: true });
memberProfileSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('MemberProfile', memberProfileSchema);
