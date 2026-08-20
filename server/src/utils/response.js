'use strict';

/**
 * Sends a consistent JSON success response.
 *
 * @param {Response} res        - Express response object
 * @param {number}   statusCode - HTTP status code (default: 200)
 * @param {string}   message    - Human-readable success message
 * @param {*}        data       - Optional payload to include in the response
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

/**
 * Sends a consistent JSON error response.
 *
 * @param {Response} res        - Express response object
 * @param {number}   statusCode - HTTP status code (default: 500)
 * @param {string}   message    - Human-readable error message
 * @param {*}        errors     - Optional validation errors or extra details
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = { success: false, message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

module.exports = { sendSuccess, sendError };
