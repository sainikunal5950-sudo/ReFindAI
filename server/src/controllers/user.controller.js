'use strict';

const userService     = require('../services/user.service');
const { sendSuccess } = require('../utils/response');

// ─── Restricted Fields Check ──────────────────────────────────────────────────
const RESTRICTED_UPDATE_FIELDS = ['email', 'password', 'role', 'isBlocked', 'isVerified'];

/**
 * Validates profile update payload.
 * Rejects if restricted fields are present or if values are invalid.
 */
const validateProfileUpdate = (body) => {
  const attemptedRestricted = RESTRICTED_UPDATE_FIELDS.filter((f) => body[f] !== undefined);
  if (attemptedRestricted.length > 0) {
    const err = new Error(
      `Cannot update restricted fields via this endpoint: ${attemptedRestricted.join(', ')}`
    );
    err.statusCode = 400;
    throw err;
  }

  if (body.name !== undefined && body.name.trim().length === 0) {
    const err = new Error('Name cannot be empty');
    err.statusCode = 400;
    throw err;
  }

  if (body.phone !== undefined && body.phone.trim() !== '') {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
    if (!phoneRegex.test(body.phone.trim())) {
      const err = new Error('Please provide a valid phone number format');
      err.statusCode = 400;
      throw err;
    }
  }
};

// ─── Controller Handlers ──────────────────────────────────────────────────────

/**
 * GET /api/users/me
 * Returns the currently authenticated user's profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user._id);
    sendSuccess(res, 200, 'Profile fetched successfully', { user });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/me
 * Updates the currently authenticated user's own profile.
 */
const updateProfile = async (req, res, next) => {
  try {
    validateProfileUpdate(req.body);

    const updatedUser = await userService.updateUserProfile(req.user._id, req.body);
    sendSuccess(res, 200, 'Profile updated successfully', { user: updatedUser });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/users/me/avatar
 * Uploads and updates the user's profile avatar.
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('Please upload an image file');
      err.statusCode = 400;
      throw err;
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await userService.updateUserProfile(req.user._id, { avatar: avatarUrl });

    sendSuccess(res, 200, 'Avatar uploaded successfully', {
      avatar: avatarUrl,
      user:   updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users
 * Returns a paginated list of all users (Admin only).
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { role, isBlocked, search, page, limit } = req.query;

    const result = await userService.getAllUsers(
      { role, isBlocked, search },
      { page, limit }
    );

    sendSuccess(res, 200, 'Users retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/:id
 * Fetches a single user by ID (Admin only).
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, 200, 'User details fetched successfully', { user });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/:id
 * Deletes a user account (Admin only).
 */
const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUserAccount(req.params.id);
    sendSuccess(res, 200, 'User account deleted successfully', {
      user: { id: deletedUser._id, email: deletedUser.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/users/:id/block
 * Toggles or sets the isBlocked status for a user (Admin only).
 */
const blockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;
    const updatedUser = await userService.toggleBlockUser(req.params.id, isBlocked);

    const statusText = updatedUser.isBlocked ? 'blocked' : 'unblocked';
    sendSuccess(res, 200, `User ${statusText} successfully`, { user: updatedUser });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
  getAllUsers,
  getUserById,
  deleteUser,
  blockUser,
};
