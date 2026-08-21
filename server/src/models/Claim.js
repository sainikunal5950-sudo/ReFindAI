'use strict';

const mongoose = require('mongoose');

/**
 * VerificationAnswer Subschema
 */
const VerificationAnswerSchema = new mongoose.Schema(
  {
    question: {
      type:     String,
      required: true,
      trim:     true,
    },
    answer: {
      type:     String,
      required: true,
      trim:     true,
    },
  },
  { _id: false }
);

/**
 * Claim Schema
 *
 * Stores item claim requests made by users attempting to verify
 * and reclaim an item reported as found.
 */
const ClaimSchema = new mongoose.Schema(
  {
    foundItem: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'FoundItem',
      required: [true, 'Found item reference is required'],
      index:    true,
    },

    claimant: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Claimant user reference is required'],
      index:    true,
    },

    verificationAnswers: {
      type:    [VerificationAnswerSchema],
      default: [],
    },

    proofMessage: {
      type:      String,
      trim:      true,
      default:   '',
      maxlength: [2000, 'Proof message cannot exceed 2000 characters'],
    },

    status: {
      type:    String,
      enum:    ['pending', 'approved', 'rejected'],
      default: 'pending',
      index:   true,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'User',
    },

    rejectionReason: {
      type:    String,
      trim:    true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate claims by the same claimant on the same found item
ClaimSchema.index({ foundItem: 1, claimant: 1 }, { unique: true });
ClaimSchema.index({ createdAt: -1 });

// Clean JSON transform
ClaimSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Claim', ClaimSchema);
