'use strict';
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const protect = require('../middleware/auth.middleware');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many requests. Try again in 15 minutes.' } });

router.post('/register', authLimiter, ctrl.register);
router.post('/login', authLimiter, ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout', protect, ctrl.logout);
router.get('/me', protect, ctrl.getMe);
router.post('/forgot-password', authLimiter, ctrl.forgotPassword);
router.post('/reset-password', ctrl.resetPassword);

module.exports = router;
