'use strict';

const express = require('express');
const router  = express.Router();

const {
  getMatchesForLostItem,
  getMatchesForFoundItem,
  getMyMatches,
  confirmMatch,
  rejectMatch,
} = require('../controllers/match.controller');

const { protect } = require('../middleware/auth.middleware');

// All match routes are protected
router.use(protect);

router.get('/my',                  getMyMatches);
router.get('/lost/:lostItemId',    getMatchesForLostItem);
router.get('/found/:foundItemId',  getMatchesForFoundItem);
router.patch('/:matchId/confirm',  confirmMatch);
router.patch('/:matchId/reject',   rejectMatch);

module.exports = router;
