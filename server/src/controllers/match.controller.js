'use strict';

const matchingService = require('../services/matching.service');
const Match           = require('../models/Match');
const LostItem        = require('../models/LostItem');
const FoundItem       = require('../models/FoundItem');
const { sendSuccess } = require('../utils/response');

/**
 * GET /api/matches/lost/:lostItemId
 * Fetch all ranked matches for a specific lost item.
 */
const getMatchesForLostItem = async (req, res, next) => {
  try {
    const { lostItemId } = req.params;

    // Run matching to ensure matches are fresh and up-to-date
    const matches = await matchingService.findPotentialMatches(lostItemId);

    sendSuccess(res, 200, 'Matches retrieved for lost item', {
      matches,
      totalMatches: matches.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/matches/found/:foundItemId
 * Fetch all ranked matches for a specific found item.
 */
const getMatchesForFoundItem = async (req, res, next) => {
  try {
    const { foundItemId } = req.params;

    const matches = await matchingService.findPotentialMatchesForFoundItem(foundItemId);

    sendSuccess(res, 200, 'Matches retrieved for found item', {
      matches,
      totalMatches: matches.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/matches/my
 * Fetch all match suggestions associated with the logged-in user's items.
 */
const getMyMatches = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all items reported by user
    const [userLostItems, userFoundItems] = await Promise.all([
      LostItem.find({ user: userId }).select('_id'),
      FoundItem.find({ user: userId }).select('_id'),
    ]);

    const lostIds = userLostItems.map((i) => i._id);
    const foundIds = userFoundItems.map((i) => i._id);

    const matches = await Match.find({
      $or: [
        { lostItem: { $in: lostIds } },
        { foundItem: { $in: foundIds } },
      ],
    })
      .populate({
        path: 'lostItem',
        populate: { path: 'user', select: 'name email avatar phone' },
      })
      .populate({
        path: 'foundItem',
        populate: { path: 'user', select: 'name email avatar phone' },
      })
      .sort({ matchScore: -1 });

    sendSuccess(res, 200, 'User match suggestions retrieved', {
      matches,
      totalMatches: matches.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/matches/:matchId/confirm
 * Confirm a match suggestion.
 */
const confirmMatch = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const match = await matchingService.confirmMatch(
      matchId,
      req.user._id,
      req.user.role
    );

    sendSuccess(res, 200, 'Match confirmed successfully', { match });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/matches/:matchId/reject
 * Reject a match suggestion.
 */
const rejectMatch = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const match = await matchingService.rejectMatch(
      matchId,
      req.user._id,
      req.user.role
    );

    sendSuccess(res, 200, 'Match rejected successfully', { match });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMatchesForLostItem,
  getMatchesForFoundItem,
  getMyMatches,
  confirmMatch,
  rejectMatch,
};
