'use strict';

const Claim     = require('../models/Claim');
const FoundItem = require('../models/FoundItem');

/**
 * Submits a new ownership claim on a found item.
 *
 * @param {string} userId              - Claimant user ID
 * @param {string} foundItemId          - Found item ID
 * @param {Array}  verificationAnswers  - Array of { question, answer }
 * @param {string} proofMessage         - Optional note from claimant
 * @returns {Promise<object>} Created claim document
 * @throws {Error} 404, 400 on self-claim or duplicate claim
 */
const createClaim = async (userId, foundItemId, verificationAnswers = [], proofMessage = '') => {
  const foundItem = await FoundItem.findById(foundItemId);
  if (!foundItem) {
    const err = new Error('Found item not found');
    err.statusCode = 404;
    throw err;
  }

  // Security Check 1: Self-claim prevention
  if (foundItem.user.toString() === userId.toString()) {
    const err = new Error('You cannot claim an item you reported as found');
    err.statusCode = 400;
    throw err;
  }

  // Security Check 2: Item must not already be claimed or closed
  if (foundItem.status === 'claimed' || foundItem.status === 'closed') {
    const err = new Error(`This item is already marked as ${foundItem.status}`);
    err.statusCode = 400;
    throw err;
  }

  // Security Check 3: Duplicate claim prevention
  const existingClaim = await Claim.findOne({
    foundItem: foundItemId,
    claimant: userId,
  });
  if (existingClaim) {
    const err = new Error('You have already submitted a claim for this item');
    err.statusCode = 400;
    throw err;
  }

  const claim = await Claim.create({
    foundItem: foundItemId,
    claimant: userId,
    verificationAnswers,
    proofMessage: proofMessage ? proofMessage.trim() : '',
    status: 'pending',
  });

  // Notify finder about submitted claim
  try {
    const notificationService = require('./notification.service');
    if (foundItem.user) {
      await notificationService.createNotification(
        foundItem.user,
        'claim_submitted',
        'New Claim Submitted!',
        `A user has submitted an ownership claim for your found "${foundItem.title}". Review their verification answers.`,
        claim._id,
        `/dashboard/found-items/${foundItem._id}/claims`
      );
    }
  } catch (notifyErr) {
    console.warn('[ClaimService] Notification dispatch note:', notifyErr.message);
  }

  return await Claim.findById(claim._id)
    .populate('claimant', 'name email avatar phone')
    .populate('foundItem', 'title category location date status images handoverLocation');
};

/**
 * Gets all claims for a specific found item (for the finder or admin to review).
 *
 * @param {string} foundItemId
 * @param {string} userId
 * @param {string} userRole
 * @returns {Promise<Array>}
 */
const getClaimsForFoundItem = async (foundItemId, userId, userRole) => {
  const foundItem = await FoundItem.findById(foundItemId);
  if (!foundItem) {
    const err = new Error('Found item not found');
    err.statusCode = 404;
    throw err;
  }

  // Ownership / Admin access check
  const isFinder = foundItem.user.toString() === userId.toString();
  if (!isFinder && userRole !== 'admin') {
    const err = new Error('You are not authorized to view claims on this item');
    err.statusCode = 403;
    throw err;
  }

  return await Claim.find({ foundItem: foundItemId })
    .populate('claimant', 'name email avatar phone')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Gets all claims submitted by the logged-in user.
 *
 * @param {string} userId
 * @returns {Promise<Array>}
 */
const getMyClaims = async (userId) => {
  return await Claim.find({ claimant: userId })
    .populate({
      path: 'foundItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .populate('reviewedBy', 'name')
    .sort({ createdAt: -1 });
};

/**
 * Approves a claim (finder or admin only).
 * Automatically rejects all other pending claims on this item and marks item 'claimed'.
 *
 * @param {string} claimId
 * @param {string} reviewerId
 * @param {string} reviewerRole
 * @returns {Promise<object>} Approved claim
 */
const approveClaim = async (claimId, reviewerId, reviewerRole) => {
  const claim = await Claim.findById(claimId).populate('foundItem');
  if (!claim) {
    const err = new Error('Claim not found');
    err.statusCode = 404;
    throw err;
  }

  if (!claim.foundItem) {
    const err = new Error('Associated found item no longer exists');
    err.statusCode = 404;
    throw err;
  }

  // Authorization check
  const isFinder = claim.foundItem.user.toString() === reviewerId.toString();
  if (!isFinder && reviewerRole !== 'admin') {
    const err = new Error('You are not authorized to approve claims on this item');
    err.statusCode = 403;
    throw err;
  }

  claim.status = 'approved';
  claim.reviewedBy = reviewerId;
  await claim.save();

  // Auto-reject other pending claims for this found item
  await Claim.updateMany(
    {
      foundItem: claim.foundItem._id,
      _id: { $ne: claimId },
      status: 'pending',
    },
    {
      status: 'rejected',
      reviewedBy: reviewerId,
      rejectionReason: 'Another claim was approved for this item',
    }
  );

  // Update FoundItem status to 'claimed'
  await FoundItem.findByIdAndUpdate(claim.foundItem._id, { status: 'claimed' });

  // Dispatch claim_approved notification to claimant
  try {
    const notificationService = require('./notification.service');
    if (claim.claimant) {
      await notificationService.createNotification(
        claim.claimant._id || claim.claimant,
        'claim_approved',
        'Your Claim Was Approved! 🎉',
        `Congratulations! Your claim for "${claim.foundItem.title}" has been verified and approved by the finder.`,
        claim._id,
        '/dashboard/claims'
      );
    }
  } catch (notifyErr) {
    console.warn('[ClaimService] Notification dispatch note:', notifyErr.message);
  }

  return await Claim.findById(claim._id)
    .populate('claimant', 'name email avatar phone')
    .populate('foundItem', 'title category location date status images handoverLocation')
    .populate('reviewedBy', 'name email');
};

/**
 * Rejects a claim (finder or admin only).
 *
 * @param {string} claimId
 * @param {string} reviewerId
 * @param {string} reviewerRole
 * @param {string} rejectionReason
 * @returns {Promise<object>} Rejected claim
 */
const rejectClaim = async (claimId, reviewerId, reviewerRole, rejectionReason = '') => {
  const claim = await Claim.findById(claimId).populate('foundItem');
  if (!claim) {
    const err = new Error('Claim not found');
    err.statusCode = 404;
    throw err;
  }

  const isFinder = claim.foundItem && claim.foundItem.user.toString() === reviewerId.toString();
  if (!isFinder && reviewerRole !== 'admin') {
    const err = new Error('You are not authorized to reject claims on this item');
    err.statusCode = 403;
    throw err;
  }

  claim.status = 'rejected';
  claim.reviewedBy = reviewerId;
  claim.rejectionReason = rejectionReason || 'Claim could not be verified by finder';
  await claim.save();

  // Dispatch claim_rejected notification to claimant
  try {
    const notificationService = require('./notification.service');
    if (claim.claimant) {
      await notificationService.createNotification(
        claim.claimant._id || claim.claimant,
        'claim_rejected',
        'Claim Update',
        `Your claim for "${claim.foundItem?.title || 'Found item'}" could not be verified: ${claim.rejectionReason}`,
        claim._id,
        '/dashboard/claims'
      );
    }
  } catch (notifyErr) {
    console.warn('[ClaimService] Notification dispatch note:', notifyErr.message);
  }

  return await Claim.findById(claim._id)
    .populate('claimant', 'name email avatar phone')
    .populate('foundItem', 'title category location date status images handoverLocation')
    .populate('reviewedBy', 'name email');
};

module.exports = {
  createClaim,
  getClaimsForFoundItem,
  getMyClaims,
  approveClaim,
  rejectClaim,
};
