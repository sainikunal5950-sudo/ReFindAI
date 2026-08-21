'use strict';

const notificationService = require('../services/notification.service');
const { sendSuccess }      = require('../utils/response');

/**
 * GET /api/notifications
 * Retrieve paginated notifications for the logged-in user with unreadCount.
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await notificationService.getUserNotifications(req.user._id, {
      page,
      limit,
    });

    sendSuccess(res, 200, 'Notifications retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user._id
    );

    sendSuccess(res, 200, 'Notification marked as read', { notification });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications for the user as read.
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);

    sendSuccess(res, 200, 'All notifications marked as read', result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
};
