'use strict';

const mongoose = require('mongoose');

const ALLOWED_CATEGORIES = [
  'Electronics',
  'Documents',
  'Bags',
  'Jewelry',
  'Clothing',
  'Keys',
  'Others',
  'Other',
];

/**
 * LostItem Schema
 *
 * Fields:
 *  - title       : Short descriptive title of lost item
 *  - description : Detailed description (color, brand, serials, features)
 *  - category    : Category enum
 *  - location    : Location where the item was lost
 *  - date        : Date when the item was lost
 *  - images      : Array of image URLs (max 5)
 *  - status      : "active" | "matched" | "resolved" | "closed"
 *  - user        : User reference (who reported it)
 *  - createdAt   : auto-set by timestamps
 *  - updatedAt   : auto-set by timestamps
 */
const LostItemSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    description: {
      type:      String,
      required:  [true, 'Description is required'],
      trim:      true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2500, 'Description cannot exceed 2500 characters'],
    },

    category: {
      type:     String,
      required: [true, 'Category is required'],
      trim:     true,
      enum: {
        values:  ALLOWED_CATEGORIES,
        message: 'Invalid category. Allowed: ' + ALLOWED_CATEGORIES.join(', '),
      },
    },

    location: {
      type:      String,
      required:  [true, 'Location is required'],
      trim:      true,
      minlength: [2, 'Location must be at least 2 characters'],
      maxlength: [200, 'Location cannot exceed 200 characters'],
    },

    date: {
      type:     Date,
      required: [true, 'Date of loss is required'],
      validate: {
        validator: function (val) {
          return val <= new Date(Date.now() + 24 * 60 * 60 * 1000); // Allow up to end of today
        },
        message: 'Date cannot be in the future',
      },
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 5;
        },
        message: 'A maximum of 5 images can be attached',
      },
    },

    status: {
      type:    String,
      enum:    ['active', 'matched', 'resolved', 'closed'],
      default: 'active',
      index:   true,
    },

    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User reference is required'],
      index:    true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes for fast searching and filtering ─────────────────────────────────
LostItemSchema.index({ category: 1, location: 1, date: -1 });
LostItemSchema.index({ createdAt: -1 });
LostItemSchema.index({ title: 'text', description: 'text', location: 'text' });

// Clean JSON transform
LostItemSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('LostItem', LostItemSchema);
module.exports.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;
