'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trainer.controller');
const protect = require('../middleware/auth.middleware');
const requireRole = require('../middleware/role.middleware');

const isTrainer = [protect, requireRole('trainer', 'admin')];

router.get('/my-members', ...isTrainer, ctrl.getMyMembers);
router.get('/members/:id', ...isTrainer, ctrl.getMemberDetail);

// Workout Plans
router.route('/workout-plans').get(...isTrainer, ctrl.getWorkoutPlans).post(...isTrainer, ctrl.createWorkoutPlan);
router.route('/workout-plans/:id').put(...isTrainer, ctrl.updateWorkoutPlan).delete(...isTrainer, ctrl.deleteWorkoutPlan);

// Diet Plans
router.route('/diet-plans').get(...isTrainer, ctrl.getDietPlans).post(...isTrainer, ctrl.createDietPlan);
router.route('/diet-plans/:id').put(...isTrainer, ctrl.updateDietPlan);

// Attendance
router.post('/attendance/mark', ...isTrainer, ctrl.markAttendance);
router.get('/attendance/:memberId', ...isTrainer, ctrl.getMemberAttendance);

// Progress
router.get('/progress/:memberId', ...isTrainer, ctrl.getMemberProgress);

module.exports = router;
