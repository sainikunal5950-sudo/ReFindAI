'use strict';

/**
 * Global error-handling middleware for Express.
 * Must be registered AFTER all routes in app.js.
 *
 * @param {Error}    err  - The error object (may include .statusCode and .isOperational)
 * @param {Request}  req  - Express request object
 * @param {Response} res  - Express response object
 * @param {Function} next - Express next middleware (required for Express to recognize this as an error handler)
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // In development, expose the stack trace for debugging
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
