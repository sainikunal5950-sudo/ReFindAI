'use strict';

const nodemailer   = require('nodemailer');
const Notification = require('../models/Notification');
const User         = require('../models/User');

// Configure Nodemailer transporter (Gmail / SMTP / Mock)
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Mock transporter for local test environments
  transporter = nodemailer.createTransport({
    jsonTransport: true,
  });
}

/**
 * Sends an email notification using Nodemailer.
 *
 * @param {string} userEmail
 * @param {string} subject
 * @param {string} bodyText
 * @param {string} htmlContent
 * @returns {Promise<object>}
 */
const sendEmailNotification = async (userEmail, subject, bodyText, htmlContent = '') => {
  if (!userEmail) return null;

  try {
    const htmlTemplate =
      htmlContent ||
      `
      <div style="background-color: #0A0A0F; color: #F5F5F7; padding: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1E293B;">
        <div style="display: flex; align-items: center; margin-bottom: 24px;">
          <h2 style="color: #3B82F6; margin: 0; font-size: 24px; font-weight: 800;">Retrivo</h2>
          <span style="color: #06B6D4; font-size: 14px; margin-left: 8px; font-weight: 600;">AI Lost & Found</span>
        </div>
        <h3 style="color: #F5F5F7; font-size: 18px; margin-top: 0;">${subject}</h3>
        <p style="color: #A1A1AA; font-size: 15px; line-height: 1.6;">${bodyText}</p>
        <hr style="border: none; border-top: 1px solid #1E293B; margin: 24px 0;" />
        <p style="color: #64748B; font-size: 12px; margin: 0;">
          This is an automated notification from Retrivo. Visit your dashboard to manage your reports and claims.
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Retrivo AI Alerts" <${process.env.EMAIL_FROM || 'notifications@retrivo.ai'}>`,
      to: userEmail,
      subject: `[Retrivo] ${subject}`,
      text: bodyText,
      html: htmlTemplate,
    });

    return info;
  } catch (err) {
    console.warn('[NotificationService] Email delivery note:', err.message);
    return null;
  }
};

/**
 * Creates an in-app notification and automatically sends an email alert.
 *
 * @param {string} userId
 * @param {string} type
 * @param {string} title
 * @param {string} message
 * @param {string} relatedItem
 * @param {string} link
 * @returns {Promise<object>} Created Notification
 */
const createNotification = async (userId, type, title, message, relatedItem = null, link = '') => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    relatedItem: relatedItem || undefined,
    link,
    isRead: false,
  });

  // Asynchronously send email notification to user
  try {
    const recipient = await User.findById(userId).select('email name');
    if (recipient && recipient.email) {
      await sendEmailNotification(recipient.email, title, message);
    }
  } catch (emailErr) {
    console.warn('[NotificationService] Failed to send email alert:', emailErr.message);
  }

  return notification;
};

/**
 * Gets paginated notifications for a user, sorted newest first.
 *
 * @param {string} userId
 * @param {object} pagination - { page, limit }
 * @returns {Promise<{ notifications: Array, unreadCount: number, total: number, page: number, totalPages: number }>}
 */
const getUserNotifications = async (userId, pagination = {}) => {
  const page = Math.max(1, parseInt(pagination.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(pagination.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return {
    notifications,
    unreadCount,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
};

/**
 * Marks a single notification as read.
 *
 * @param {string} notificationId
 * @param {string} userId
 * @returns {Promise<object>} Updated Notification
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    user: userId,
  });

  if (!notification) {
    const err = new Error('Notification not found');
    err.statusCode = 404;
    throw err;
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

/**
 * Marks all unread notifications for a user as read.
 *
 * @param {string} userId
 * @returns {Promise<{ modifiedCount: number }>}
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );

  return { modifiedCount: result.modifiedCount };
};

module.exports = {
  createNotification,
  sendEmailNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
};
