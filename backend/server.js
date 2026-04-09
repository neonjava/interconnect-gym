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
app.use(cookieParser());

// Security headers with production CSP
if (env === 'production') {
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "script-src": ["'self'", "'unsafe-inline'"],
                "img-src": ["'self'", "data:", "blob:"],
            },
        },
    }));
} else {
    app.use(helmet());
}

app.use(cors({ origin: env === 'production' ? true : clientUrl, credentials: true }));
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

// 404 handler for API
app.use('/api', (_req, res) => res.status(404).json({ success: false, message: 'API Route not found.' }));

// Serve Frontend in Production
if (env === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendPath, 'index.html'));
        }
    });
}

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
