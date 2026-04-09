'use strict';
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' },
        amount: { type: Number, required: true },
        method: { type: String, enum: ['cash', 'upi', 'card', 'online', 'other'], required: true },
        status: { type: String, enum: ['paid', 'pending', 'failed', 'refunded'], default: 'pending' },
        transactionId: { type: String, trim: true },
        receiptUrl: { type: String },
        paidAt: { type: Date },
        notes: { type: String },
        recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who recorded
    },
    { timestamps: true }
);

paymentSchema.index({ memberId: 1, status: 1 });
paymentSchema.index({ paidAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
