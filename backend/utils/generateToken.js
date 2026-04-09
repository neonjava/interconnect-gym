'use strict';
const jwt = require('jsonwebtoken');
const { jwt: jwtCfg } = require('../config/env');

const generateAccessToken = (payload) =>
    jwt.sign(payload, jwtCfg.accessSecret, { expiresIn: jwtCfg.accessExpires });

const generateRefreshToken = (payload) =>
    jwt.sign(payload, jwtCfg.refreshSecret, { expiresIn: jwtCfg.refreshExpires });

const verifyAccessToken = (token) => jwt.verify(token, jwtCfg.accessSecret);

const verifyRefreshToken = (token) => jwt.verify(token, jwtCfg.refreshSecret);

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };
