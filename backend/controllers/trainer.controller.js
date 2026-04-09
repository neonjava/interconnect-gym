'use strict';
const User = require('../models/User.model');
const MemberProfile = require('../models/MemberProfile.model');
const WorkoutPlan = require('../models/WorkoutPlan.model');
const DietPlan = require('../models/DietPlan.model');
const Attendance = require('../models/Attendance.model');
const ProgressLog = require('../models/ProgressLog.model');
const Notification = require('../models/Notification.model');
const { success, created, error } = require('../utils/apiResponse');

// GET /trainer/my-members
exports.getMyMembers = async (req, res, next) => {
    try {
        const profiles = await MemberProfile.find({ assignedTrainerId: req.user._id })
            .populate('userId', 'name email phone avatar isActive createdAt');
        return success(res, profiles);
    } catch (err) { next(err); }
};

// GET /trainer/members/:id
exports.getMemberDetail = async (req, res, next) => {
    try {
        const profile = await MemberProfile.findOne({ userId: req.params.id })
            .populate('userId', 'name email phone avatar');
        if (!profile) return error(res, 'Member not found.', 404);
        const [workoutPlan, dietPlan, recentProgress] = await Promise.all([
            WorkoutPlan.findOne({ memberId: req.params.id, isActive: true }),
            DietPlan.findOne({ memberId: req.params.id, isActive: true }),
            ProgressLog.find({ memberId: req.params.id }).sort({ logDate: -1 }).limit(5),
        ]);
        return success(res, { profile, workoutPlan, dietPlan, recentProgress });
    } catch (err) { next(err); }
};

// --- WORKOUT PLANS ---
exports.createWorkoutPlan = async (req, res, next) => {
    try {
        // Deactivate previous plan
        await WorkoutPlan.updateMany({ memberId: req.body.memberId, isActive: true }, { isActive: false });
        const plan = await WorkoutPlan.create({ ...req.body, trainerId: req.user._id });
        await Notification.create({ userId: req.body.memberId, type: 'plan', title: 'New Workout Plan Assigned', message: `Your trainer assigned you a new workout plan: ${plan.title}` });
        return created(res, plan, 'Workout plan created.');
    } catch (err) { next(err); }
};

exports.getWorkoutPlans = async (req, res, next) => {
    try {
        const plans = await WorkoutPlan.find({ trainerId: req.user._id }).populate('memberId', 'name email').sort({ createdAt: -1 });
        return success(res, plans);
    } catch (err) { next(err); }
};

exports.updateWorkoutPlan = async (req, res, next) => {
    try {
        const plan = await WorkoutPlan.findOneAndUpdate({ _id: req.params.id, trainerId: req.user._id }, req.body, { new: true, runValidators: true });
        if (!plan) return error(res, 'Plan not found.', 404);
        return success(res, plan, 'Plan updated.');
    } catch (err) { next(err); }
};

exports.deleteWorkoutPlan = async (req, res, next) => {
    try {
        await WorkoutPlan.findOneAndDelete({ _id: req.params.id, trainerId: req.user._id });
        return success(res, null, 'Plan removed.');
    } catch (err) { next(err); }
};

// --- DIET PLANS ---
exports.createDietPlan = async (req, res, next) => {
    try {
        await DietPlan.updateMany({ memberId: req.body.memberId, isActive: true }, { isActive: false });
        const plan = await DietPlan.create({ ...req.body, trainerId: req.user._id });
        await Notification.create({ userId: req.body.memberId, type: 'plan', title: 'New Diet Plan Assigned', message: `Your trainer assigned you a new diet plan: ${plan.title}` });
        return created(res, plan, 'Diet plan created.');
    } catch (err) { next(err); }
};

exports.getDietPlans = async (req, res, next) => {
    try {
        const plans = await DietPlan.find({ trainerId: req.user._id }).populate('memberId', 'name email').sort({ createdAt: -1 });
        return success(res, plans);
    } catch (err) { next(err); }
};

exports.updateDietPlan = async (req, res, next) => {
    try {
        const plan = await DietPlan.findOneAndUpdate({ _id: req.params.id, trainerId: req.user._id }, req.body, { new: true });
        if (!plan) return error(res, 'Plan not found.', 404);
        return success(res, plan, 'Diet plan updated.');
    } catch (err) { next(err); }
};

// --- ATTENDANCE ---
exports.markAttendance = async (req, res, next) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const existing = await Attendance.findOne({ memberId: req.body.memberId, date: today });
        if (existing) return error(res, 'Attendance already marked for today.', 409);
        const attendance = await Attendance.create({ ...req.body, date: today, checkInTime: new Date(), markedBy: 'trainer', markedByUserId: req.user._id });
        return created(res, attendance, 'Attendance marked.');
    } catch (err) { next(err); }
};

exports.getMemberAttendance = async (req, res, next) => {
    try {
        const { month, year } = req.query;
        const query = { memberId: req.params.memberId };
        if (month && year) {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 0, 23, 59, 59);
            query.date = { $gte: start, $lte: end };
        }
        const records = await Attendance.find(query).sort({ date: -1 });
        return success(res, records);
    } catch (err) { next(err); }
};

// --- PROGRESS ---
exports.getMemberProgress = async (req, res, next) => {
    try {
        const logs = await ProgressLog.find({ memberId: req.params.memberId }).sort({ logDate: -1 });
        return success(res, logs);
    } catch (err) { next(err); }
};
