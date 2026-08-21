
'use strict';

const LostItem = require('../models/LostItem');

/**
 * Creates a new lost item report.
 *
 * @param {string} userId - ID of the user creating the report
 * @param {object} data   - Lost item payload
 * @returns {Promise<object>} Created lost item document
 */
const createLostItem = async (userId, data) => {
  const item = await LostItem.create({
    ...data,
    user: userId,
  });

  return await LostItem.findById(item._id).populate('user', 'name email avatar phone');
};

/**
 * Fetches all lost items with search, filters, and pagination.
 *
 * @param {object} filters     - { category, location, status, startDate, endDate, search }
 * @param {object} pagination  - { page, limit }
 * @returns {Promise<{ items: Array, total: number, page: number, limit: number, totalPages: number }>}
 */
const getAllLostItems = async (filters = {}, pagination = {}) => {
  const query = {};

  // Filter by category
  if (filters.category && filters.category !== 'all' && filters.category !== 'All') {
    query.category = new RegExp(`^${filters.category}$`, 'i');
  }

  // Filter by location (partial regex match)
  if (filters.location && filters.location.trim() !== '') {
    query.location = new RegExp(filters.location.trim(), 'i');
  }

  // Filter by status (default: active if not specified, or all)
  if (filters.status && filters.status !== 'all') {
    query.status = filters.status;
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      // Set to end of day
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }

  // Search keyword in title or description
  if (filters.search && filters.search.trim() !== '') {
    const searchRegex = new RegExp(filters.search.trim(), 'i');
    query.$or = [{ title: searchRegex }, { description: searchRegex }, { location: searchRegex }];
  }

  const page = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    LostItem.find(query)
      .populate('user', 'name email avatar phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    LostItem.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Fetches a single lost item by ID with owner information populated.
 *
 * @param {string} itemId
 * @returns {Promise<object>}
 * @throws {Error} 404 if item not found
 */
const getLostItemById = async (itemId) => {
  const item = await LostItem.findById(itemId).populate('user', 'name email avatar phone');
  if (!item) {
    const err = new Error('Lost item report not found');
    err.statusCode = 404;
    throw err;
  }
  return item;
};

/**
 * Updates a lost item report (owner or admin only).
 *
 * @param {string} itemId
 * @param {string} userId
 * @param {string} userRole
 * @param {object} data
 * @returns {Promise<object>}
 * @throws {Error} 404 if not found, 403 if unauthorized
 */
const updateLostItem = async (itemId, userId, userRole, data) => {
  const item = await LostItem.findById(itemId);
  if (!item) {
    const err = new Error('Lost item report not found');
    err.statusCode = 404;
    throw err;
  }

  // Ownership or admin check
  const ownerId = item.user.toString();
  if (ownerId !== userId.toString() && userRole !== 'admin') {
    const err = new Error('You are not authorized to update this item report');
    err.statusCode = 403;
    throw err;
  }

  const allowedUpdates = ['title', 'description', 'category', 'location', 'date', 'images', 'status'];
  for (const key of allowedUpdates) {
    if (data[key] !== undefined) {
      item[key] = data[key];
    }
  }

  await item.save();
  return await LostItem.findById(item._id).populate('user', 'name email avatar phone');
};

/**
 * Deletes a lost item report (owner or admin only).
 *
 * @param {string} itemId
 * @param {string} userId
 * @param {string} userRole
 * @returns {Promise<object>}
 * @throws {Error} 404 if not found, 403 if unauthorized
 */
const deleteLostItem = async (itemId, userId, userRole) => {
  const item = await LostItem.findById(itemId);
  if (!item) {
    const err = new Error('Lost item report not found');
    err.statusCode = 404;
    throw err;
  }

  // Ownership or admin check
  const ownerId = item.user.toString();
  if (ownerId !== userId.toString() && userRole !== 'admin') {
    const err = new Error('You are not authorized to delete this item report');
    err.statusCode = 403;
    throw err;
  }

  await LostItem.findByIdAndDelete(itemId);
  return item;
};

/**
 * Fetches lost item reports created by a specific user.
 *
 * @param {string} userId
 * @param {object} pagination - { page, limit }
 * @returns {Promise<{ items: Array, total: number, page: number, limit: number, totalPages: number }>}
 */
const getMyLostItems = async (userId, pagination = {}) => {
  const page = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = { user: userId };

  const [items, total] = await Promise.all([
    LostItem.find(query)
      .populate('user', 'name email avatar phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    LostItem.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

module.exports = {
  createLostItem,
  getAllLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
  getMyLostItems,
};
