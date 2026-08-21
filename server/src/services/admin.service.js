'use strict';

const User      = require('../models/User');
const LostItem  = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Match     = require('../models/Match');
const Claim     = require('../models/Claim');
const AdminLog  = require('../models/AdminLog');

/**
 * Gets aggregated system statistics for the admin dashboard.
 *
 * @returns {Promise<object>} Platform statistics breakdown
 */
const getDashboardStats = async () => {
  const [
    totalUsers,
    totalLostItems,
    totalFoundItems,
    totalMatches,
    totalClaims,
    resolvedLostItems,
    claimedFoundItems,
    flaggedLost,
    flaggedFound,
    pendingClaims,
    confirmedMatches,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: 'admin' } }),
    LostItem.countDocuments(),
    FoundItem.countDocuments(),
    Match.countDocuments(),
    Claim.countDocuments(),
    LostItem.countDocuments({ status: 'resolved' }),
    FoundItem.countDocuments({ status: 'claimed' }),
    LostItem.countDocuments({ isFlagged: true }),
    FoundItem.countDocuments({ isFlagged: true }),
    Claim.countDocuments({ status: 'pending' }),
    Match.countDocuments({ status: 'confirmed' }),
  ]);

  return {
    users: {
      total: totalUsers,
    },
    items: {
      totalLost: totalLostItems,
      totalFound: totalFoundItems,
      totalItems: totalLostItems + totalFoundItems,
      resolved: resolvedLostItems + claimedFoundItems,
      flagged: flaggedLost + flaggedFound,
    },
    matches: {
      total: totalMatches,
      confirmed: confirmedMatches,
    },
    claims: {
      total: totalClaims,
      pending: pendingClaims,
    },
  };
};

/**
 * Gets all Lost Items platform-wide with admin filtering and pagination.
 */
const getAllLostItemsAdmin = async (filters = {}, pagination = {}) => {
  const page  = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 20));
  const skip  = (page - 1) * limit;

  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.isFlagged !== undefined) query.isFlagged = filters.isFlagged === 'true' || filters.isFlagged === true;
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const [items, total] = await Promise.all([
    LostItem.find(query)
      .populate('user', 'name email avatar phone isBlocked')
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
 * Gets all Found Items platform-wide with admin filtering and pagination.
 */
const getAllFoundItemsAdmin = async (filters = {}, pagination = {}) => {
  const page  = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 20));
  const skip  = (page - 1) * limit;

  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.isFlagged !== undefined) query.isFlagged = filters.isFlagged === 'true' || filters.isFlagged === true;
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const [items, total] = await Promise.all([
    FoundItem.find(query)
      .populate('user', 'name email avatar phone isBlocked')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    FoundItem.countDocuments(query),
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
 * Admin removal of any lost or found item (e.g. spam/fraud).
 */
const removeItemAdmin = async (type, id, adminId, reason = 'Administrative removal') => {
  let item;
  const isLost = type.toLowerCase() === 'lost';

  if (isLost) {
    item = await LostItem.findByIdAndDelete(id);
    if (!item) {
      const err = new Error('Lost item not found');
      err.statusCode = 404;
      throw err;
    }
    // Clean up matches
    await Match.deleteMany({ lostItem: id });
  } else {
    item = await FoundItem.findByIdAndDelete(id);
    if (!item) {
      const err = new Error('Found item not found');
      err.statusCode = 404;
      throw err;
    }
    // Clean up matches & claims
    await Promise.all([
      Match.deleteMany({ foundItem: id }),
      Claim.deleteMany({ foundItem: id }),
    ]);
  }

  // Audit log
  await AdminLog.create({
    admin: adminId,
    action: isLost ? 'DELETE_LOST_ITEM' : 'DELETE_FOUND_ITEM',
    targetType: isLost ? 'LostItem' : 'FoundItem',
    targetId: id,
    details: { title: item.title, reason },
  });

  return { success: true, removedItem: item };
};

/**
 * Flag / unflag an item for suspicious activity review.
 */
const flagItemAdmin = async (type, id, isFlagged, flagReason = '', adminId) => {
  const isLost = type.toLowerCase() === 'lost';
  const Model  = isLost ? LostItem : FoundItem;

  const item = await Model.findByIdAndUpdate(
    id,
    { isFlagged: Boolean(isFlagged), flagReason: flagReason || '' },
    { new: true }
  );

  if (!item) {
    const err = new Error('Item not found');
    err.statusCode = 404;
    throw err;
  }

  // Audit log
  await AdminLog.create({
    admin: adminId,
    action: isFlagged ? 'FLAG_ITEM' : 'UNFLAG_ITEM',
    targetType: isLost ? 'LostItem' : 'FoundItem',
    targetId: id,
    details: { title: item.title, flagReason },
  });

  return item;
};

/**
 * Gets all claims platform-wide for admin overview.
 */
const getAllClaimsAdmin = async (filters = {}, pagination = {}) => {
  const page  = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 20));
  const skip  = (page - 1) * limit;

  const query = {};
  if (filters.status) query.status = filters.status;

  const [claims, total] = await Promise.all([
    Claim.find(query)
      .populate('claimant', 'name email avatar phone isBlocked')
      .populate({
        path: 'foundItem',
        populate: { path: 'user', select: 'name email' },
      })
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Claim.countDocuments(query),
  ]);

  return {
    claims,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Gets all matches platform-wide for admin overview.
 */
const getAllMatchesAdmin = async (filters = {}, pagination = {}) => {
  const page  = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 20));
  const skip  = (page - 1) * limit;

  const query = {};
  if (filters.status) query.status = filters.status;

  const [matches, total] = await Promise.all([
    Match.find(query)
      .populate({
        path: 'lostItem',
        populate: { path: 'user', select: 'name email' },
      })
      .populate({
        path: 'foundItem',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Match.countDocuments(query),
  ]);

  return {
    matches,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Gets audit logs of admin actions.
 */
const getAdminLogs = async (pagination = {}) => {
  const page  = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 30));
  const skip  = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AdminLog.find()
      .populate('admin', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    AdminLog.countDocuments(),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

module.exports = {
  getDashboardStats,
  getAllLostItemsAdmin,
  getAllFoundItemsAdmin,
  removeItemAdmin,
  flagItemAdmin,
  getAllClaimsAdmin,
  getAllMatchesAdmin,
  getAdminLogs,
};
