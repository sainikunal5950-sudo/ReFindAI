'use strict';

const mongoose = require('mongoose');

/**
 * Match Schema
 *
 * Stores potential, confirmed, or rejected AI matches between
 * a LostItem and a FoundItem, along with weighted similarity scores.
 */
const MatchSchema = new mongoose.Schema(
  {
    lostItem: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'LostItem',
      required: [true, 'Lost item reference is required'],
      index:    true,
    },

    foundItem: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'FoundItem',
      required: [true, 'Found item reference is required'],
      index:    true,
    },

    matchScore: {
      type:     Number,
      required: true,
      min:      0,
      max:      100,
      index:    true,
    },

    breakdown: {
      textSimilarity: {
        type:    Number,
        default: 0,
      },
      locationSimilarity: {
        type:    Number,
        default: 0,
      },
      timeSimilarity: {
        type:    Number,
        default: 0,
      },
      categorySimilarity: {
        type:    Number,
        default: 0,
      },
    },

    status: {
      type:    String,
      enum:    ['pending', 'confirmed', 'rejected'],
      default: 'pending',
      index:   true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate match records for the exact same pair
MatchSchema.index({ lostItem: 1, foundItem: 1 }, { unique: true });
MatchSchema.index({ matchScore: -1 });

// Clean JSON transform
MatchSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Match', MatchSchema);
