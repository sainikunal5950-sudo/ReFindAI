'use strict';

const User = require('../models/User');

/**
 * Fetches a single user by ID, excluding the password field.
 *
 * @param {string} userId
 * @returns {Promise<object>}
 * @throws {Error} 404 if user not found
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * Updates allowed profile fields for a user.
 * Restricted fields: email, password, role, isBlocked, isVerified.
 *
 * @param {string} userId
 * @param {object} updateData
 * @returns {Promise<object>} Updated user
 * @throws {Error} 404 if user not found, 400 if invalid
 */
const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'phone', 'address', 'avatar'];
  const sanitizedUpdate = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      sanitizedUpdate[field] = updateData[field];
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: sanitizedUpdate },
    { new: true, runValidators: true }
  );

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return user;
};

/**
 * Retrieves a paginated list of users with optional filtering (for admin).
 *
 * @param {object} filters     - { role, isBlocked, search }
 * @param {object} pagination  - { page, limit }
 * @returns {Promise<{ users: Array, total: number, page: number, limit: number, totalPages: number }>}
 */
const getAllUsers = async (filters = {}, pagination = {}) => {
  const query = {};

  if (filters.role) {
    query.role = filters.role;
  }

  if (filters.isBlocked !== undefined && filters.isBlocked !== '') {
    query.isBlocked = filters.isBlocked === 'true' || filters.isBlocked === true;
  }

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const page = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Deletes a user account by ID.
 *
 * @param {string} userId
 * @returns {Promise<object>} Deleted user
 * @throws {Error} 404 if user not found
 */
const deleteUserAccount = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

/**
 * Toggles or sets the isBlocked status of a user (admin only).
 *
 * @param {string} userId
 * @param {boolean} [explicitStatus] - Optional boolean to set specific status
 * @returns {Promise<object>} Updated user
 * @throws {Error} 404 if user not found
 */
const toggleBlockUser = async (userId, explicitStatus) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  user.isBlocked = explicitStatus !== undefined ? Boolean(explicitStatus) : !user.isBlocked;
  await user.save();

  return user;
};

module.exports = {
  getUserById,
  updateUserProfile,
  getAllUsers,
  deleteUserAccount,
  toggleBlockUser,
};
