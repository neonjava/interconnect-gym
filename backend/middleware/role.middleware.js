'use strict';
const { error } = require('../utils/apiResponse');

/**
 * Role guard factory.
 * Usage: requireRole('admin') or requireRole('admin', 'trainer')
 */
const requireRole = (...roles) => (req, res, next) => {
    if (!req.user) return error(res, 'Not authenticated.', 401);
    if (!roles.includes(req.user.role)) {
        return error(res, `Access denied. Required role: ${roles.join(' or ')}.`, 403);
    }
    next();
};

module.exports = requireRole;
