'use strict';

const Match     = require('../models/Match');
const LostItem  = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');

// Common English stopwords to ignore in text similarity
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'aren', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
  'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could', 'did',
  'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we',
  'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with',
  'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'item', 'lost', 'found',
]);

/**
 * Tokenizes text into cleaned lower-case words.
 */
const tokenize = (text) => {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 2 && !STOPWORDS.has(word));
};

/**
 * 1. Calculate Text Similarity (0 - 100)
 * Uses Jaccard similarity on keyword tokens + substring inclusion boost.
 */
const calculateTextSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;

  const t1 = text1.toLowerCase().trim();
  const t2 = text2.toLowerCase().trim();

  // Exact string match
  if (t1 === t2) return 100;

  const tokens1 = new Set(tokenize(t1));
  const tokens2 = new Set(tokenize(t2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  // Jaccard Intersection / Union
  let intersectionCount = 0;
  for (const token of tokens1) {
    if (tokens2.has(token)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...tokens1, ...tokens2]).size;
  const jaccard = unionSize > 0 ? (intersectionCount / unionSize) * 100 : 0;

  // Substring inclusion bonus
  let substringBonus = 0;
  if (t1.includes(t2) || t2.includes(t1)) {
    substringBonus = 25;
  }

  const score = Math.min(100, Math.round(jaccard * 0.75 + substringBonus + (intersectionCount > 0 ? 15 : 0)));
  return score;
};

/**
 * 2. Calculate Location Similarity (0 - 100)
 */
const calculateLocationSimilarity = (loc1, loc2) => {
  if (!loc1 || !loc2) return 0;

  const l1 = loc1.toLowerCase().trim();
  const l2 = loc2.toLowerCase().trim();

  if (l1 === l2) return 100;

  if (l1.includes(l2) || l2.includes(l1)) {
    return 85;
  }

  const tokens1 = new Set(tokenize(l1));
  const tokens2 = new Set(tokenize(l2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  let common = 0;
  for (const t of tokens1) {
    if (tokens2.has(t)) common++;
  }

  const union = new Set([...tokens1, ...tokens2]).size;
  const overlap = union > 0 ? (common / union) * 100 : 0;

  return Math.min(100, Math.round(overlap));
};

/**
 * 3. Calculate Time Similarity (0 - 100)
 * Decay function based on days between report dates.
 */
const calculateTimeSimilarity = (date1, date2) => {
  if (!date1 || !date2) return 0;

  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();

  if (isNaN(d1) || isNaN(d2)) return 0;

  const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return 100;
  if (diffDays <= 3) return 85;
  if (diffDays <= 7) return 70;
  if (diffDays <= 14) return 50;
  if (diffDays <= 30) return 30;
  return 10;
};

/**
 * 4. Calculate Category Similarity (0 or 100)
 */
const calculateCategorySimilarity = (cat1, cat2) => {
  if (!cat1 || !cat2) return 0;
  return cat1.toLowerCase().trim() === cat2.toLowerCase().trim() ? 100 : 0;
};

/**
 * 5. Calculate Weighted Composite Match Score
 * Weights:
 *  - Category : 25%
 *  - Text     : 30%
 *  - Location : 25%
 *  - Time     : 20%
 */
const calculateMatchScore = (lostItem, foundItem) => {
  const lostText = `${lostItem.title || ''} ${lostItem.description || ''}`;
  const foundText = `${foundItem.title || ''} ${foundItem.description || ''}`;

  const textScore = calculateTextSimilarity(lostText, foundText);
  const locScore = calculateLocationSimilarity(lostItem.location, foundItem.location);
  const timeScore = calculateTimeSimilarity(lostItem.date, foundItem.date);
  const catScore = calculateCategorySimilarity(lostItem.category, foundItem.category);

  // Composite weighted score
  let composite =
    catScore * 0.25 +
    textScore * 0.30 +
    locScore * 0.25 +
    timeScore * 0.20;

  // If categories don't match, cap composite score at 30
  if (catScore === 0) {
    composite = Math.min(30, composite);
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(composite)));

  return {
    matchScore: finalScore,
    breakdown: {
      textSimilarity: textScore,
      locationSimilarity: locScore,
      timeSimilarity: timeScore,
      categorySimilarity: catScore,
    },
  };
};

/**
 * Runs matching engine for a Lost Item against all active Found Items.
 * Automatically saves matches exceeding threshold (default: 40%).
 *
 * @param {string} lostItemId
 * @param {number} threshold
 * @returns {Promise<Array>} List of matches sorted descending by score
 */
const findPotentialMatches = async (lostItemId, threshold = 40) => {
  const lostItem = await LostItem.findById(lostItemId);
  if (!lostItem) return [];

  // Query active found items
  const foundItems = await FoundItem.find({ status: { $in: ['active', 'matched'] } });
  const matches = [];

  for (const foundItem of foundItems) {
    const { matchScore, breakdown } = calculateMatchScore(lostItem, foundItem);

    if (matchScore >= threshold) {
      // Upsert match record in DB
      const matchDoc = await Match.findOneAndUpdate(
        { lostItem: lostItem._id, foundItem: foundItem._id },
        {
          lostItem: lostItem._id,
          foundItem: foundItem._id,
          matchScore,
          breakdown,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      matches.push(matchDoc);

      // Trigger notifications for both users
      try {
        const notificationService = require('./notification.service');
        if (lostItem.user) {
          await notificationService.createNotification(
            lostItem.user,
            'match_found',
            'Potential Match Found!',
            `A found item matching your "${lostItem.title}" (${matchScore}% match score) was found!`,
            matchDoc._id,
            '/dashboard/matches'
          );
        }
        if (foundItem.user && foundItem.user.toString() !== lostItem.user?.toString()) {
          await notificationService.createNotification(
            foundItem.user,
            'match_found',
            'Potential Match Found!',
            `A lost item matching your found "${foundItem.title}" (${matchScore}% match score) was reported!`,
            matchDoc._id,
            '/dashboard/matches'
          );
        }
      } catch (notifyErr) {
        console.warn('[MatchingService] Notification dispatch note:', notifyErr.message);
      }
    }
  }

  // Return populated results sorted by matchScore
  return await Match.find({ lostItem: lostItemId })
    .populate({
      path: 'foundItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .populate({
      path: 'lostItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .sort({ matchScore: -1 });
};

/**
 * Runs matching engine for a Found Item against all active Lost Items.
 *
 * @param {string} foundItemId
 * @param {number} threshold
 * @returns {Promise<Array>} List of matches sorted descending by score
 */
const findPotentialMatchesForFoundItem = async (foundItemId, threshold = 40) => {
  const foundItem = await FoundItem.findById(foundItemId);
  if (!foundItem) return [];

  const lostItems = await LostItem.find({ status: { $in: ['active', 'matched'] } });
  const matches = [];

  for (const lostItem of lostItems) {
    const { matchScore, breakdown } = calculateMatchScore(lostItem, foundItem);

    if (matchScore >= threshold) {
      const matchDoc = await Match.findOneAndUpdate(
        { lostItem: lostItem._id, foundItem: foundItem._id },
        {
          lostItem: lostItem._id,
          foundItem: foundItem._id,
          matchScore,
          breakdown,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      matches.push(matchDoc);
    }
  }

  return await Match.find({ foundItem: foundItemId })
    .populate({
      path: 'lostItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .populate({
      path: 'foundItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .sort({ matchScore: -1 });
};

/**
 * Get existing matches for a lost item.
 */
const getMatchesForLostItem = async (lostItemId) => {
  return await Match.find({ lostItem: lostItemId })
    .populate({
      path: 'foundItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .populate({
      path: 'lostItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .sort({ matchScore: -1 });
};

/**
 * Get existing matches for a found item.
 */
const getMatchesForFoundItem = async (foundItemId) => {
  return await Match.find({ foundItem: foundItemId })
    .populate({
      path: 'lostItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .populate({
      path: 'foundItem',
      populate: { path: 'user', select: 'name email avatar phone' },
    })
    .sort({ matchScore: -1 });
};

/**
 * Confirms a match (user or admin).
 * Updates match status to 'confirmed', and updates item statuses to 'matched'.
 */
const confirmMatch = async (matchId, userId, userRole) => {
  const match = await Match.findById(matchId)
    .populate('lostItem')
    .populate('foundItem');

  if (!match) {
    const err = new Error('Match record not found');
    err.statusCode = 404;
    throw err;
  }

  // Check ownership
  const isOwner =
    (match.lostItem && match.lostItem.user.toString() === userId.toString()) ||
    (match.foundItem && match.foundItem.user.toString() === userId.toString());

  if (!isOwner && userRole !== 'admin') {
    const err = new Error('You are not authorized to confirm this match');
    err.statusCode = 403;
    throw err;
  }

  match.status = 'confirmed';
  await match.save();

  // Update item statuses
  await LostItem.findByIdAndUpdate(match.lostItem._id, { status: 'matched' });
  await FoundItem.findByIdAndUpdate(match.foundItem._id, { status: 'matched' });

  return match;
};

/**
 * Rejects a match.
 */
const rejectMatch = async (matchId, userId, userRole) => {
  const match = await Match.findById(matchId)
    .populate('lostItem')
    .populate('foundItem');

  if (!match) {
    const err = new Error('Match record not found');
    err.statusCode = 404;
    throw err;
  }

  const isOwner =
    (match.lostItem && match.lostItem.user.toString() === userId.toString()) ||
    (match.foundItem && match.foundItem.user.toString() === userId.toString());

  if (!isOwner && userRole !== 'admin') {
    const err = new Error('You are not authorized to reject this match');
    err.statusCode = 403;
    throw err;
  }

  match.status = 'rejected';
  await match.save();

  return match;
};

module.exports = {
  calculateTextSimilarity,
  calculateLocationSimilarity,
  calculateTimeSimilarity,
  calculateCategorySimilarity,
  calculateMatchScore,
  findPotentialMatches,
  findPotentialMatchesForFoundItem,
  getMatchesForLostItem,
  getMatchesForFoundItem,
  confirmMatch,
  rejectMatch,
};
