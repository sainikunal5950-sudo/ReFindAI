'use strict';

/**
 * `authorize(...roles)` — role-based access control middleware factory.
 *
 * Usage (in a route file):
 *   router.get('/admin-only', protect, authorize('admin'), handler);
 *   router.get('/any-staff',  protect, authorize('admin', 'moderator'), handler);
 *
 * Must be used AFTER the `protect` middleware so that req.user is available.
 *
 * @param {...string} roles - One or more allowed roles.
 * @returns {Function} Express middleware that either calls next() or returns 403.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // protect middleware must run first
    if (!req.user) {
      const err = new Error('Access denied. Authentication required.');
      err.statusCode = 401;
      return next(err);
    }

    if (!roles.includes(req.user.role)) {
      const err = new Error(
        `Access denied. This resource requires one of the following roles: ${roles.join(', ')}.`
      );
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};

module.exports = { authorize };
