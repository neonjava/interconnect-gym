'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/member.controller');
const protect = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const isMember = [protect, requireRole('member', 'admin')];

router.get('/dashboard', ...isMember, ctrl.getDashboard);
router.get('/subscription', ...isMember, ctrl.getSubscription);
router.get('/payments', ...isMember, ctrl.getPayments);
router.get('/workout-plan', ...isMember, ctrl.getWorkoutPlan);
router.get('/diet-plan', ...isMember, ctrl.getDietPlan);

// Attendance
router.post('/attendance/checkin', ...isMember, ctrl.checkIn);
router.get('/attendance', ...isMember, ctrl.getAttendance);

// Progress
router.route('/progress').get(...isMember, ctrl.getProgress).post(...isMember, ctrl.addProgress);

// Profile
router.put('/profile', protect, ctrl.updateProfile);

// Notifications
router.get('/notifications', ...isMember, ctrl.getNotifications);
router.put('/notifications/:id/read', ...isMember, ctrl.markNotificationRead);

module.exports = router;
