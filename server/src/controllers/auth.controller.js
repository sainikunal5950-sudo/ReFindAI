'use strict';

const { registerUser, loginUser } = require('../services/auth.service');
const { sendSuccess }             = require('../utils/response');

// ─── Validation helpers ────────────────────────────────────────────────────────

/**
 * Validates register request body.
 * Throws a 400 error if any field is invalid.
 */
const validateRegisterInput = ({ name, email, password }) => {
  const errors = [];

  if (!name || name.trim().length < 1) {
    errors.push('Name is required');
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    const err = new Error(errors.join('. '));
    err.statusCode = 400;
    err.errors = errors;
    throw err;
  }
};

/**
 * Validates login request body.
 * Throws a 400 error if any field is invalid.
 */
const validateLoginInput = ({ email, password }) => {
  const errors = [];

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 1) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    const err = new Error(errors.join('. '));
    err.statusCode = 400;
    err.errors = errors;
    throw err;
  }
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new user account and returns a JWT token.
 */
const register = async (req, res, next) => {
  try {
    validateRegisterInput(req.body);

    const { name, email, password } = req.body;
    const { user, token } = await registerUser({ name, email, password });

    sendSuccess(res, 201, 'Account created successfully', {
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Validates credentials and returns a JWT token on success.
 */
const login = async (req, res, next) => {
  try {
    validateLoginInput(req.body);

    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    sendSuccess(res, 200, 'Logged in successfully', {
      token,
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Stateless JWT logout — instructs the client to discard its token.
 * If you are using httpOnly cookies, this clears the cookie.
 */
const logout = (req, res) => {
  // Clear cookie if you're using cookie-based auth
  res.clearCookie('token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  sendSuccess(res, 200, 'Logged out successfully');
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Requires the `protect` middleware to have run first (sets req.user).
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    sendSuccess(res, 200, 'User profile fetched', {
      id:        req.user._id,
      name:      req.user.name,
      email:     req.user.email,
      role:      req.user.role,
      createdAt: req.user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getMe };
