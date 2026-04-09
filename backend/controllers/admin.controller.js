'use strict';
const User = require('../models/User.model');
const MemberProfile = require('../models/MemberProfile.model');
const Membership = require('../models/Membership.model');
const Subscription = require('../models/Subscription.model');
const Payment = require('../models/Payment.model');
const Notification = require('../models/Notification.model');
const { success, created, error } = require('../utils/apiResponse');
const { paymentReceiptMail, membershipExpiryMail } = require('../utils/mailer');

// --- DASHBOARD ---
exports.getDashboard = async (req, res, next) => {
    try {
        const [totalMembers, activeSubscriptions, todayPayments] = await Promise.all([
            User.countDocuments({ role: 'member', isActive: true }),
            Subscription.countDocuments({ status: 'active' }),
            Payment.aggregate([
                { $match: { status: 'paid', paidAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
        ]);
        const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const monthlyRevenue = await Payment.aggregate([
            { $match: { status: 'paid', paidAt: { $gte: monthStart } } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        return success(res, {
            totalMembers,
            activeSubscriptions,
            todayRevenue: todayPayments[0]?.total || 0,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
        });
    } catch (err) { next(err); }
};

// --- MEMBERS ---
exports.getMembers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, status } = req.query;
        const query = { role: 'member' };
        if (status === 'active') query.isActive = true;
        if (status === 'inactive') query.isActive = false;
        if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];

        const [members, total] = await Promise.all([
            User.find(query).skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 }),
            User.countDocuments(query),
        ]);
        return success(res, { members, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
};

exports.getMemberById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'member') return error(res, 'Member not found.', 404);
        const profile = await MemberProfile.findOne({ userId: user._id }).populate('assignedTrainerId', 'name email');
        const subscription = await Subscription.findOne({ memberId: user._id, status: 'active' }).populate('membershipId');
        return success(res, { user, profile, subscription });
    } catch (err) { next(err); }
};

exports.createMember = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return error(res, 'Email already exists.', 409);
        const user = await User.create({ name, email, passwordHash: password, phone, role: 'member' });
        await MemberProfile.create({ userId: user._id });
        return created(res, user, 'Member created.');
    } catch (err) { next(err); }
};

exports.updateMember = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return error(res, 'Member not found.', 404);
        return success(res, user, 'Member updated.');
    } catch (err) { next(err); }
};

exports.deleteMember = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!user) return error(res, 'Member not found.', 404);
        return success(res, null, 'Member deactivated.');
    } catch (err) { next(err); }
};

// --- TRAINERS ---
exports.getTrainers = async (req, res, next) => {
    try {
        const trainers = await User.find({ role: 'trainer', isActive: true });
        return success(res, trainers);
    } catch (err) { next(err); }
};

exports.createTrainer = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return error(res, 'Email already exists.', 409);
        const trainer = await User.create({ name, email, passwordHash: password, phone, role: 'trainer' });
        return created(res, trainer, 'Trainer created.');
    } catch (err) { next(err); }
};

// --- MEMBERSHIP PLANS ---
exports.getMemberships = async (req, res, next) => {
    try {
        const plans = await Membership.find().sort({ price: 1 });
        return success(res, plans);
    } catch (err) { next(err); }
};

exports.createMembership = async (req, res, next) => {
    try {
        const plan = await Membership.create(req.body);
        return created(res, plan, 'Membership plan created.');
    } catch (err) { next(err); }
};

exports.updateMembership = async (req, res, next) => {
    try {
        const plan = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!plan) return error(res, 'Plan not found.', 404);
        return success(res, plan, 'Plan updated.');
    } catch (err) { next(err); }
};

exports.deleteMembership = async (req, res, next) => {
    try {
        await Membership.findByIdAndUpdate(req.params.id, { isActive: false });
        return success(res, null, 'Plan archived.');
    } catch (err) { next(err); }
};

// --- SUBSCRIPTIONS ---
exports.getSubscriptions = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status ? { status } : {};
        const [subs, total] = await Promise.all([
            Subscription.find(query).populate('memberId', 'name email').populate('membershipId', 'name price')
                .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
            Subscription.countDocuments(query),
        ]);
        return success(res, { subscriptions: subs, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
};

exports.updateSubscription = async (req, res, next) => {
    try {
        const sub = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sub) return error(res, 'Subscription not found.', 404);
        if (sub.status === 'expired') {
            const member = await User.findById(sub.memberId);
            if (member) await membershipExpiryMail(member.email, member.name, sub.endDate.toDateString());
        }
        return success(res, sub, 'Subscription updated.');
    } catch (err) { next(err); }
};

// --- PAYMENTS ---
exports.getPayments = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, startDate, endDate } = req.query;
        const query = {};
        if (status) query.status = status;
        if (startDate || endDate) query.paidAt = {};
        if (startDate) query.paidAt.$gte = new Date(startDate);
        if (endDate) query.paidAt.$lte = new Date(endDate);
        const [payments, total] = await Promise.all([
            Payment.find(query).populate('memberId', 'name email').sort({ createdAt: -1 })
                .skip((page - 1) * limit).limit(Number(limit)),
            Payment.countDocuments(query),
        ]);
        return success(res, { payments, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
};

exports.createPayment = async (req, res, next) => {
    try {
        const payment = await Payment.create({ ...req.body, recordedBy: req.user._id, paidAt: new Date() });
        const member = await User.findById(req.body.memberId);
        if (member) {
            await paymentReceiptMail(member.email, member.name, payment.amount, payment.paidAt.toDateString());
            await Notification.create({ userId: member._id, type: 'payment', title: 'Payment Received', message: `Your payment of ₹${payment.amount} was recorded.` });
        }
        return created(res, payment, 'Payment recorded.');
    } catch (err) { next(err); }
};

// --- ANALYTICS ---
exports.getRevenueAnalytics = async (req, res, next) => {
    try {
        const data = await Payment.aggregate([
            { $match: { status: 'paid', paidAt: { $exists: true } } },
            { $group: { _id: { year: { $year: '$paidAt' }, month: { $month: '$paidAt' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        return success(res, data);
    } catch (err) { next(err); }
};

exports.getMemberAnalytics = async (req, res, next) => {
    try {
        const data = await User.aggregate([
            { $match: { role: 'member' } },
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);
        return success(res, data);
    } catch (err) { next(err); }
};

exports.getAttendanceAnalytics = async (req, res, next) => {
    try {
        const Attendance = require('../models/Attendance.model');
        const data = await Attendance.aggregate([
            { $group: { _id: { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
        ]);
        return success(res, data);
    } catch (err) { next(err); }
};

// --- NOTIFICATIONS ---
exports.broadcastNotification = async (req, res, next) => {
    try {
        const { title, message, roles = ['member'] } = req.body;
        const users = await User.find({ role: { $in: roles }, isActive: true }, '_id');
        const notifications = users.map((u) => ({ userId: u._id, type: 'general', title, message }));
        await Notification.insertMany(notifications);
        return success(res, { sent: notifications.length }, 'Notification broadcast.');
    } catch (err) { next(err); }
};
