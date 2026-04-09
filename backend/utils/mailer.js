'use strict';
const nodemailer = require('nodemailer');
const { smtp } = require('../config/env');

const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
});

/**
 * @param {string} to - recipient email
 * @param {string} subject
 * @param {string} html
 */
const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({ from: smtp.from, to, subject, html });
        console.log(`📧 Email sent to ${to}`);
    } catch (err) {
        console.error(`❌ Email send failed: ${err.message}`);
        // Non-fatal: log but don't crash
    }
};

const paymentReceiptMail = (to, name, amount, date) =>
    sendMail(
        to,
        'Payment Receipt – Strength Arena',
        `<h2>Payment Confirmed 🎉</h2>
     <p>Hi <strong>${name}</strong>,</p>
     <p>We received your payment of <strong>₹${amount}</strong> on ${date}.</p>
     <p>Thank you for being part of Strength Arena!</p>`
    );

const membershipExpiryMail = (to, name, expiryDate) =>
    sendMail(
        to,
        'Membership Expiring Soon – Strength Arena',
        `<h2>Membership Expiry Reminder ⚠️</h2>
     <p>Hi <strong>${name}</strong>,</p>
     <p>Your membership expires on <strong>${expiryDate}</strong>. Renew now to continue your fitness journey!</p>`
    );

const passwordResetMail = (to, name, resetUrl) =>
    sendMail(
        to,
        'Password Reset – Strength Arena',
        `<h2>Reset Your Password</h2>
     <p>Hi <strong>${name}</strong>,</p>
     <p>Click the link below to reset your password (expires in 1 hour):</p>
     <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7C3AED;color:#fff;border-radius:8px;text-decoration:none">Reset Password</a>
     <p>If you did not request this, ignore this email.</p>`
    );

module.exports = { sendMail, paymentReceiptMail, membershipExpiryMail, passwordResetMail };
