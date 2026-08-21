'use strict';

const adminService    = require('../services/admin.service');
const { sendSuccess } = require('../utils/response');

/**
 * GET /api/admin/stats
 * Aggregated platform dashboard statistics.
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    sendSuccess(res, 200, 'Admin statistics retrieved successfully', stats);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/lost-items
 * Retrieve all lost items across platform with search and status filtering.
 */
const getAllLostItemsAdmin = async (req, res, next) => {
  try {
    const { status, category, isFlagged, search, page, limit } = req.query;
    const result = await adminService.getAllLostItemsAdmin(
      { status, category, isFlagged, search },
      { page, limit }
    );
    sendSuccess(res, 200, 'Lost items retrieved for admin', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/found-items
 * Retrieve all found items across platform.
 */
const getAllFoundItemsAdmin = async (req, res, next) => {
  try {
    const { status, category, isFlagged, search, page, limit } = req.query;
    const result = await adminService.getAllFoundItemsAdmin(
      { status, category, isFlagged, search },
      { page, limit }
    );
    sendSuccess(res, 200, 'Found items retrieved for admin', result);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/items/:type/:id
 * Delete any lost or found item.
 */
const removeItem = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { reason }   = req.body || {};

    const result = await adminService.removeItemAdmin(
      type,
      id,
      req.user._id,
      reason
    );

    sendSuccess(res, 200, `${type} item deleted successfully by admin`, result);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/items/:type/:id/flag
 * Flag or unflag item for suspicious activity.
 */
const flagItem = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { isFlagged, flagReason } = req.body;

    const item = await adminService.flagItemAdmin(
      type,
      id,
      isFlagged,
      flagReason,
      req.user._id
    );

    sendSuccess(res, 200, `Item flag status updated`, { item });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/claims
 * Platform-wide claims monitor.
 */
const getAllClaimsAdmin = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await adminService.getAllClaimsAdmin({ status }, { page, limit });
    sendSuccess(res, 200, 'All claims retrieved for admin', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/matches
 * Platform-wide matches monitor.
 */
const getAllMatchesAdmin = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await adminService.getAllMatchesAdmin({ status }, { page, limit });
    sendSuccess(res, 200, 'All matches retrieved for admin', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/logs
 * Audit log of administrative actions.
 */
const getAdminLogs = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await adminService.getAdminLogs({ page, limit });
    sendSuccess(res, 200, 'Admin audit logs retrieved', result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getAllLostItemsAdmin,
  getAllFoundItemsAdmin,
  removeItem,
  flagItem,
  getAllClaimsAdmin,
  getAllMatchesAdmin,
  getAdminLogs,
};
