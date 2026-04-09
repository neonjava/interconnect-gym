'use strict';

/**
 * Standardised API response helpers.
 * Keeps all responses in a consistent shape.
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({ success: true, message, data });
};

const created = (res, data = null, message = 'Created') => {
    return success(res, data, message, 201);
};

const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({ success: false, message, errors });
};

module.exports = { success, created, error };
