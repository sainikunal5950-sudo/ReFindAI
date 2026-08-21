'use strict';

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * `protect` middleware — verifies the JWT and attaches the user to req.user.
 *
 * Token can be supplied via:
 *   1. Authorization header:  "Bearer <token>"
 *   2. HTTP cookie:           cookie named "token"  (if using cookie-based auth)
 *
 * On failure, passes a 401 or 403 error to the next error handler.
 */
const protect = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header (preferred)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback: check cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      const err = new Error('Access denied. No token provided.');
      err.statusCode = 401;
      return next(err);
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      const err = new Error(
        jwtErr.name === 'TokenExpiredError'
          ? 'Session expired. Please log in again.'
          : 'Invalid token. Please log in again.'
      );
      err.statusCode = 401;
      return next(err);
    }

    // Fetch fresh user data from DB (catches deleted / deactivated accounts)
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error('User account no longer exists.');
      err.statusCode = 401;
      return next(err);
    }

    // Check if user is blocked
    if (user.isBlocked) {
      const err = new Error('Account is blocked. Please contact support.');
      err.statusCode = 403;
      return next(err);
    }

    // Attach user to request — available to all downstream handlers
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
