'use strict';

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── Helper ────────────────────────────────────────────────────────────────────

/**
 * Signs and returns a JWT token for the given user.
 *
 * @param {string} userId - Mongoose ObjectId of the user
 * @param {string} role   - User's role ("user" | "admin")
 * @returns {string}        Signed JWT
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Creates a new user account.
 *
 * @param {{ name: string, email: string, password: string, role?: string, phone?: string, address?: string }} data
 * @returns {{ user: object, token: string }}
 * @throws {Error} 409 if the email is already registered
 */
const registerUser = async (data) => {
  const { name, email, password, role, phone, address } = data;

  // Check for duplicate email before attempting to save
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    throw err;
  }

  // Create user — password is hashed by the pre('save') hook on the model
  const user = await User.create({ name, email, password, role, phone, address });

  const token = generateToken(user._id, user.role);

  return { user, token };
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Validates credentials and returns a token on success.
 *
 * @param {string} email
 * @param {string} password - Plain-text password from the client
 * @returns {{ user: object, token: string }}
 * @throws {Error} 401 if credentials are invalid, 403 if account is blocked
 */
const loginUser = async (email, password) => {
  // Explicitly select password because the field has `select: false` on the schema
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  // Security check: Blocked users cannot log in
  if (user.isBlocked) {
    const err = new Error('Account is blocked. Please contact support.');
    err.statusCode = 403;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id, user.role);

  // Strip password from the returned object
  user.password = undefined;

  return { user, token };
};

module.exports = { generateToken, registerUser, loginUser };
