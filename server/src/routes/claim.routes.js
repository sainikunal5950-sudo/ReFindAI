'use strict';

const express = require('express');
const router  = express.Router();

const {
  submitClaim,
  getClaimsForFoundItem,
  getMyClaims,
  approveClaim,
  rejectClaim,
} = require('../controllers/claim.controller');

const { protect } = require('../middleware/auth.middleware');

// All claim routes require authentication
router.use(protect);

router.post(  '/',                             submitClaim);
router.get(   '/my',                           getMyClaims);
router.get(   '/found-item/:foundItemId',      getClaimsForFoundItem);
router.patch( '/:claimId/approve',             approveClaim);
router.patch( '/:claimId/reject',              rejectClaim);

module.exports = router;
