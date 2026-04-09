'use strict';
const User = require('../models/User.model');
const MemberProfile = require('../models/MemberProfile.model');
const Subscription = require('../models/Subscription.model');
const Payment = require('../models/Payment.model');
const WorkoutPlan = require('../models/WorkoutPlan.model');
const DietPlan = require('../models/DietPlan.model');
const Attendance = require('../models/Attendance.model');
const ProgressLog = require('../models/ProgressLog.model');
const Notification = require('../models/Notification.model');
const { success, created, error } = require('../utils/apiResponse');

// GET /member/dashboard
exports.getDashboard = async (req, res, next) => {
    try {
        const memberId = req.user._id;
        const [subscription, workoutPlan, dietPlan, unreadCount] = await Promise.all([
            Subscription.findOne({ memberId, status: 'active' }).populate('membershipId', 'name badge'),
            WorkoutPlan.findOne({ memberId, isActive: true }, 'title level weeks'),
            DietPlan.findOne({ memberId, isActive: true }, 'title dailyCalories'),
            Notification.countDocuments({ userId: memberId, isRead: false }),
        ]);
        // attendance this month
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const attendanceCount = await Attendance.countDocuments({ memberId, date: { $gte: monthStart } });
        return success(res, { subscription, workoutPlan, dietPlan, attendanceCount, unreadNotifications: unreadCount });
    } catch (err) { next(err); }
};

// GET /member/subscription
exports.getSubscription = async (req, res, next) => {
    try {
        const sub = await Subscription.findOne({ memberId: req.user._id, status: 'active' })
            .populate('membershipId').populate('paymentHistory');
        return success(res, sub);
    } catch (err) { next(err); }
};

// GET /member/payments
exports.getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({ memberId: req.user._id }).sort({ createdAt: -1 });
        return success(res, payments);
    } catch (err) { next(err); }
};

// GET /member/workout-plan
exports.getWorkoutPlan = async (req, res, next) => {
    try {
        const plan = await WorkoutPlan.findOne({ memberId: req.user._id, isActive: true });
        if (!plan) return error(res, 'No active workout plan found.', 404);
        return success(res, plan);
    } catch (err) { next(err); }
};

// GET /member/diet-plan
exports.getDietPlan = async (req, res, next) => {
    try {
        const plan = await DietPlan.findOne({ memberId: req.user._id, isActive: true });
        if (!plan) return error(res, 'No active diet plan found.', 404);
        return success(res, plan);
    } catch (err) { next(err); }
};

// POST /member/attendance/checkin
exports.checkIn = async (req, res, next) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const existing = await Attendance.findOne({ memberId: req.user._id, date: today });
        if (existing) return error(res, 'Already checked in today.', 409);
        const record = await Attendance.create({ memberId: req.user._id, date: today, checkInTime: new Date(), markedBy: 'qr' });
        return created(res, record, 'Check-in successful!');
    } catch (err) { next(err); }
};

// GET /member/attendance
exports.getAttendance = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        const query = { memberId: req.user._id };
        if (month && year) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59);
            query.date = { $gte: start, $lte: end };
        }
        const records = await Attendance.find(query).sort({ date: -1 });
        return success(res, records);
    } catch (err) { next(err); }
};

// GET /member/progress
exports.getProgress = async (req, res, next) => {
    try {
        const logs = await ProgressLog.find({ memberId: req.user._id }).sort({ logDate: -1 });
        return success(res, logs);
    } catch (err) { next(err); }
};

// POST /member/progress
exports.addProgress = async (req, res, next) => {
    try {
        const log = await ProgressLog.create({ ...req.body, memberId: req.user._id });
        return created(res, log, 'Progress logged.');
    } catch (err) { next(err); }
};

// PUT /member/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true });
        const profile = await MemberProfile.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true, upsert: true });
        return success(res, { user, profile }, 'Profile updated.');
    } catch (err) { next(err); }
};

// GET /member/notifications
exports.getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
        return success(res, notifications);
    } catch (err) { next(err); }
};

// PUT /member/notifications/:id/read
exports.markNotificationRead = async (req, res, next) => {
    try {
        await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isRead: true });
        return success(res, null, 'Notification marked as read.');
    } catch (err) { next(err); }
};
