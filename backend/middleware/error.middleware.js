'use strict';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error('💥 Error:', err.stack || err.message);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        message = `${field} already exists.`;
        statusCode = 409;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ success: false, message: 'Validation failed.', errors });
    }

    // Cast error (invalid ObjectId)
    if (err.name === 'CastError') {
        message = `Invalid ${err.path}: ${err.value}`;
        statusCode = 400;
    }

    return res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
