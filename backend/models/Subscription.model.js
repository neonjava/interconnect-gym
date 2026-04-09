'use strict';
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        membershipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Membership', required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, enum: ['active', 'expired', 'paused', 'cancelled'], default: 'active' },
        autoRenew: { type: Boolean, default: false },
        paymentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
        notes: { type: String },
    },
    { timestamps: true }
);

// Auto-expire subscriptions
subscriptionSchema.pre('save', function (next) {
    if (this.endDate && this.endDate < new Date() && this.status === 'active') {
        this.status = 'expired';
    }
    next();
});

// Index for quick expiry queries
subscriptionSchema.index({ memberId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
