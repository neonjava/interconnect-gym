'use strict';
const { verifyAccessToken } = require('../utils/generateToken');
const { error } = require('../utils/apiResponse');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) return error(res, 'Not authenticated. Please log in.', 401);

        const decoded = verifyAccessToken(token);
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (!user || !user.isActive) return error(res, 'User not found or deactivated.', 401);

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') return error(res, 'Session expired. Please log in again.', 401);
        return error(res, 'Invalid token.', 401);
    }
};

module.exports = protect;
