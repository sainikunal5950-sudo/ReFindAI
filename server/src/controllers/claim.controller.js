'use strict';

const claimService    = require('../services/claim.service');
const { sendSuccess } = require('../utils/response');

/**
 * POST /api/claims
 * Submit an ownership claim for a found item with verification answers.
 */
const submitClaim = async (req, res, next) => {
  try {
    const { foundItemId, verificationAnswers, proofMessage } = req.body;

    if (!foundItemId) {
      const err = new Error('Found item ID is required');
      err.statusCode = 400;
      throw err;
    }

    const claim = await claimService.createClaim(
      req.user._id,
      foundItemId,
      verificationAnswers,
      proofMessage
    );

    sendSuccess(res, 201, 'Ownership claim submitted successfully', { claim });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/claims/found-item/:foundItemId
 * Get all claims filed for a found item (Finder / Admin only).
 */
const getClaimsForFoundItem = async (req, res, next) => {
  try {
    const { foundItemId } = req.params;

    const claims = await claimService.getClaimsForFoundItem(
      foundItemId,
      req.user._id,
      req.user.role
    );

    sendSuccess(res, 200, 'Claims retrieved for found item', {
      claims,
      totalClaims: claims.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/claims/my
 * Get all claims submitted by the logged-in user.
 */
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await claimService.getMyClaims(req.user._id);

    sendSuccess(res, 200, 'Your submitted claims retrieved', {
      claims,
      totalClaims: claims.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/claims/:claimId/approve
 * Approve an ownership claim (Finder / Admin only).
 */
const approveClaim = async (req, res, next) => {
  try {
    const { claimId } = req.params;

    const claim = await claimService.approveClaim(
      claimId,
      req.user._id,
      req.user.role
    );

    sendSuccess(res, 200, 'Claim approved successfully. Item marked as claimed.', { claim });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/claims/:claimId/reject
 * Reject an ownership claim (Finder / Admin only).
 */
const rejectClaim = async (req, res, next) => {
  try {
    const { claimId } = req.params;
    const { rejectionReason } = req.body;

    const claim = await claimService.rejectClaim(
      claimId,
      req.user._id,
      req.user.role,
      rejectionReason
    );

    sendSuccess(res, 200, 'Claim rejected', { claim });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitClaim,
  getClaimsForFoundItem,
  getMyClaims,
  approveClaim,
  rejectClaim,
};
