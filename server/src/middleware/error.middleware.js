'use strict';

/**
 * Global error-handling middleware for Express.
 * Must be registered AFTER all routes in app.js.
 *
 * Handles:
 *  - Custom operational errors (err.statusCode set by the app)
 *  - Mongoose validation errors  (400)
 *  - Mongoose duplicate key errors (409)
 *  - Mongoose bad ObjectId cast  (400)
 *  - JWT errors are handled in protect middleware before reaching here
 *
 * @param {Error}    err
 * @param {Request}  req
 * @param {Response} res
 * @param {Function} next  - Required parameter for Express to identify this as an error handler
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';
  let errors     = err.errors     || undefined;

  // ── Mongoose Validation Error ──────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
    errors  = messages;
  }

  // ── Mongoose Duplicate Key (E11000) ───────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  // ── Mongoose Bad ObjectId ──────────────────────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: "${err.value}"`;
  }

  // Build response — include stack trace only in development
  const response = {
    success: false,
    message,
    ...(errors    && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
