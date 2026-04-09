'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ['admin', 'trainer', 'member'], default: 'member' },
        phone: { type: String, trim: true },
        avatar: { type: String, default: null },
        isActive: { type: Boolean, default: true },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        refreshToken: { type: String },
    },
    { timestamps: true }
);

// Virtual: full URL for avatar
userSchema.virtual('avatarUrl').get(function () {
    return this.avatar ? `/uploads/${this.avatar}` : null;
});

// Pre-save: hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
    next();
});

// Method: compare password
userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.passwordHash);
};

// Sanitize output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    delete obj.resetPasswordToken;
    delete obj.resetPasswordExpires;
    delete obj.refreshToken;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
