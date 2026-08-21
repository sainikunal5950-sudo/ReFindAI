'use strict';

const mongoose = require('mongoose');

/**
 * AdminLog Schema
 *
 * Audit trail for administrative actions (deletions, user blocks, item flags).
 */
const AdminLogSchema = new mongoose.Schema(
  {
    admin: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Admin user reference is required'],
      index:    true,
    },

    action: {
      type:     String,
      required: [true, 'Action name is required'],
      trim:     true,
      index:    true,
    },

    targetType: {
      type: String,
      enum: ['User', 'LostItem', 'FoundItem', 'Claim', 'Match', 'System'],
      required: true,
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

AdminLogSchema.index({ createdAt: -1 });

AdminLogSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
