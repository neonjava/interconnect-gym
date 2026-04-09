'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const protect = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const isAdmin = [protect, requireRole('admin')];

// Dashboard
router.get('/dashboard', ...isAdmin, ctrl.getDashboard);

// Members
router.route('/members').get(...isAdmin, ctrl.getMembers).post(...isAdmin, ctrl.createMember);
router.route('/members/:id').get(...isAdmin, ctrl.getMemberById).put(...isAdmin, ctrl.updateMember).delete(...isAdmin, ctrl.deleteMember);

// Trainers
router.route('/trainers').get(...isAdmin, ctrl.getTrainers).post(...isAdmin, ctrl.createTrainer);

// Membership Plans
router.route('/memberships').get(...isAdmin, ctrl.getMemberships).post(...isAdmin, ctrl.createMembership);
router.route('/memberships/:id').put(...isAdmin, ctrl.updateMembership).delete(...isAdmin, ctrl.deleteMembership);

// Subscriptions
router.route('/subscriptions').get(...isAdmin, ctrl.getSubscriptions);
router.route('/subscriptions/:id').put(...isAdmin, ctrl.updateSubscription);

// Payments
router.route('/payments').get(...isAdmin, ctrl.getPayments).post(...isAdmin, ctrl.createPayment);

// Analytics
router.get('/analytics/revenue', ...isAdmin, ctrl.getRevenueAnalytics);
router.get('/analytics/members', ...isAdmin, ctrl.getMemberAnalytics);
router.get('/analytics/attendance', ...isAdmin, ctrl.getAttendanceAnalytics);

// Notifications
router.post('/notifications/broadcast', ...isAdmin, ctrl.broadcastNotification);

module.exports = router;
