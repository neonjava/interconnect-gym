'use strict';
require('dotenv').config();

const required = [
    'MONGO_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
];

required.forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ Missing required env variable: ${key}`);
        process.exit(1);
    }
});

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    mongoUri: process.env.MONGO_URI,
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
        refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
    },
    smtp: {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        from: process.env.EMAIL_FROM,
    },
};
