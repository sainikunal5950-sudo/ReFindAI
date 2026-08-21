'use strict';

const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'match_found',
  'claim_submitted',
  'claim_approved',
  'claim_rejected',
  'item_resolved',
];

/**
 * Notification Schema
 *
 * Stores in-app alerts for matches, claim status updates, and resolutions.
 */
const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User recipient is required'],
      index:    true,
    },

    type: {
      type:     String,
      enum: {
        values:  NOTIFICATION_TYPES,
        message: 'Invalid notification type',
      },
      required: [true, 'Notification type is required'],
      index:    true,
    },

    title: {
      type:      String,
      required:  [true, 'Notification title is required'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    message: {
      type:      String,
      required:  [true, 'Notification message is required'],
      trim:      true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },

    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },

    link: {
      type:    String,
      trim:    true,
      default: '',
    },

    isRead: {
      type:    Boolean,
      default: false,
      index:   true,
    },
  },
  {
    timestamps: true,
  }
);

// Fast query index for user's unread / read notification feeds
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

// Clean JSON transform
NotificationSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
module.exports.NOTIFICATION_TYPES = NOTIFICATION_TYPES;
