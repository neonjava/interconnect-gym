'use strict';
const crypto = require('crypto');
const User = require('../models/User.model');
const MemberProfile = require('../models/MemberProfile.model');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/generateToken');
const { success, created, error } = require('../utils/apiResponse');
const { passwordResetMail } = require('../utils/mailer');

const COOKIE_OPTS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
};

// POST /api/v1/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return error(res, 'Email already registered.', 409);

        const user = await User.create({ name, email, passwordHash: password, phone, role: 'member' });
        await MemberProfile.create({ userId: user._id });

        const accessToken = generateAccessToken({ id: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id });
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
        return created(res, { user, accessToken }, 'Registration successful.');
    } catch (err) { next(err); }
};

// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user || !user.isActive) return error(res, 'Invalid credentials.', 401);

        const match = await user.comparePassword(password);
        if (!match) return error(res, 'Invalid credentials.', 401);

        const accessToken = generateAccessToken({ id: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ id: user._id });
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie('refreshToken', refreshToken, COOKIE_OPTS);
        return success(res, { user, accessToken }, 'Login successful.');
    } catch (err) { next(err); }
};

// POST /api/v1/auth/refresh
exports.refresh = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) return error(res, 'Refresh token missing.', 401);

        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) return error(res, 'Invalid refresh token.', 401);

        const accessToken = generateAccessToken({ id: user._id, role: user.role });
        return success(res, { accessToken }, 'Token refreshed.');
    } catch (err) {
        if (err.name === 'TokenExpiredError') return error(res, 'Session expired. Please log in.', 401);
        next(err);
    }
};

// POST /api/v1/auth/logout
exports.logout = async (req, res, next) => {
    try {
        req.user.refreshToken = null;
        await req.user.save({ validateBeforeSave: false });
        res.clearCookie('refreshToken');
        return success(res, null, 'Logged out successfully.');
    } catch (err) { next(err); }
};

// GET /api/v1/auth/me
exports.getMe = async (req, res) => success(res, req.user);

// POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return success(res, null, 'If that email exists, a reset link has been sent.');

        const rawToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
        await passwordResetMail(user.email, user.name, resetUrl);
        return success(res, null, 'Password reset email sent.');
    } catch (err) { next(err); }
};

// POST /api/v1/auth/reset-password
exports.resetPassword = async (req, res, next) => {
    try {
        const hashed = crypto.createHash('sha256').update(req.body.token).digest('hex');
        const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) return error(res, 'Invalid or expired reset token.', 400);

        user.passwordHash = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return success(res, null, 'Password reset successful.');
    } catch (err) { next(err); }
};
