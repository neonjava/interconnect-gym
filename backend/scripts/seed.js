'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const MemberProfile = require('../models/MemberProfile.model');
const Membership = require('../models/Membership.model');
const Subscription = require('../models/Subscription.model');
const Payment = require('../models/Payment.model');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected. Seeding...');

    await Promise.all([
        User.deleteMany({}), MemberProfile.deleteMany({}),
        Membership.deleteMany({}), Subscription.deleteMany({}), Payment.deleteMany({}),
    ]);

    // Admin
    const admin = await User.create({ name: 'Admin User', email: 'admin@strengtharena.com', passwordHash: 'Admin@123', role: 'admin', phone: '9000000000' });

    // Trainer
    const trainer = await User.create({ name: 'Rahul Sharma', email: 'trainer@strengtharena.com', passwordHash: 'Trainer@123', role: 'trainer', phone: '9000000001' });

    // Members
    const member1 = await User.create({ name: 'Arjun Mehta', email: 'arjun@example.com', passwordHash: 'Member@123', role: 'member', phone: '9000000002' });
    const member2 = await User.create({ name: 'Priya Singh', email: 'priya@example.com', passwordHash: 'Member@123', role: 'member', phone: '9000000003' });

    await MemberProfile.create({ userId: member1._id, gender: 'male', height: 175, weight: 82, goal: 'Muscle gain', assignedTrainerId: trainer._id, joinDate: new Date('2024-01-10') });
    await MemberProfile.create({ userId: member2._id, gender: 'female', height: 162, weight: 65, goal: 'Fat loss', assignedTrainerId: trainer._id, joinDate: new Date('2024-03-01') });

    // Membership Plans
    const basic = await Membership.create({ name: 'Basic – Monthly', durationMonths: 1, price: 999, features: ['Gym access', 'Locker room'], badge: 'basic' });
    const gold = await Membership.create({ name: 'Gold – 3 Months', durationMonths: 3, price: 2499, features: ['Gym access', 'Trainer sessions (2/week)', 'Diet plan', 'Locker room'], badge: 'gold' });

    // Subscriptions
    const now = new Date();
    const sub1 = await Subscription.create({ memberId: member1._id, membershipId: gold._id, startDate: new Date('2024-04-01'), endDate: new Date('2024-07-01'), status: 'active' });
    const sub2 = await Subscription.create({ memberId: member2._id, membershipId: basic._id, startDate: now, endDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()), status: 'active' });

    // Payments
    await Payment.create({ memberId: member1._id, subscriptionId: sub1._id, amount: 2499, method: 'upi', status: 'paid', transactionId: 'TXN001', paidAt: new Date('2024-04-01'), recordedBy: admin._id });
    await Payment.create({ memberId: member2._id, subscriptionId: sub2._id, amount: 999, method: 'cash', status: 'paid', paidAt: now, recordedBy: admin._id });

    console.log('✅ Seed complete!');
    console.log('  Admin:   admin@strengtharena.com / Admin@123');
    console.log('  Trainer: trainer@strengtharena.com / Trainer@123');
    console.log('  Member1: arjun@example.com / Member@123');
    console.log('  Member2: priya@example.com / Member@123');
    await mongoose.disconnect();
};

seed().catch((err) => { console.error(err); process.exit(1); });
