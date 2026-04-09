'use strict';
const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        durationMonths: { type: Number, required: true },
        price: { type: Number, required: true },
        features: [{ type: String }],
        isActive: { type: Boolean, default: true },
        description: { type: String },
        badge: { type: String, enum: ['basic', 'silver', 'gold', 'platinum'], default: 'basic' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
