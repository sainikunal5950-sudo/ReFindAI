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
 * FoundItem Schema
 *
 * Fields:
 *  - title            : Short descriptive title of found item
 *  - description      : Detailed description (color, brand, distinguishing features)
 *  - category         : Category enum
 *  - location         : Location where the item was found
 *  - date             : Date when the item was found
 *  - handoverLocation : Optional physical location where finder can hand it over
 *  - images           : Array of image URLs (max 5)
 *  - status           : "active" | "matched" | "claimed" | "closed"
 *  - user             : User reference (who found/reported it)
 *  - createdAt        : auto-set by timestamps
 *  - updatedAt        : auto-set by timestamps
 */
const FoundItemSchema = new mongoose.Schema(
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
      required: [true, 'Date found is required'],
      validate: {
        validator: function (val) {
          return val <= new Date(Date.now() + 24 * 60 * 60 * 1000); // Allow up to end of today
        },
        message: 'Date cannot be in the future',
      },
    },

    handoverLocation: {
      type:      String,
      trim:      true,
      default:   '',
      maxlength: [250, 'Handover location cannot exceed 250 characters'],
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
      enum:    ['active', 'matched', 'claimed', 'closed'],
      default: 'active',
      index:   true,
    },

    verificationQuestions: {
      type:    [String],
      default: [],
    },

    isFlagged: {
      type:    Boolean,
      default: false,
      index:   true,
    },

    flagReason: {
      type:    String,
      trim:    true,
      default: '',
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
FoundItemSchema.index({ category: 1, location: 1, date: -1 });
FoundItemSchema.index({ createdAt: -1 });
FoundItemSchema.index({ title: 'text', description: 'text', location: 'text', handoverLocation: 'text' });

// Clean JSON transform
FoundItemSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('FoundItem', FoundItemSchema);
module.exports.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;
