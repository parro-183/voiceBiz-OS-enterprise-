const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    logger.info('Rate limit check', { ip: req.ip, path: req.path });
    return false;
  },
});

// Authentication rate limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // only 5 requests per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
});

// Call creation rate limiter
const callLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 calls per minute per IP
  message: 'Too many calls created, please wait before creating another.',
});

module.exports = { apiLimiter, authLimiter, callLimiter };
