'use strict';
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDB = require('./config/db');
const { port, clientUrl, env } = require('./config/env');
const errorHandler = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const trainerRoutes = require('./routes/trainer.routes');
const memberRoutes = require('./routes/member.routes');

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (env !== 'test') app.use(morgan(env === 'production' ? 'combined' : 'dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/trainer', trainerRoutes);
app.use('/api/v1/member', memberRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'Strength Arena API is running 🏋️', timestamp: new Date() }));

// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`🚀 Server running in ${env} mode on http://localhost:${port}`);
        console.log(`🔑 API base: http://localhost:${port}/api/v1`);
    });
};

startServer();

module.exports = app;
