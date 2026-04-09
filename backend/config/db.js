'use strict';
const mongoose = require('mongoose');
const { mongoUri } = require('./env');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
