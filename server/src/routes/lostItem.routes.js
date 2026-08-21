'use strict';

const express = require('express');
const router  = express.Router();

const {
  createLostItem,
  getAllLostItems,
  getMyLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
} = require('../controllers/lostItem.controller');

const { protect }              = require('../middleware/auth.middleware');
const { uploadLostItemImages } = require('../middleware/upload.middleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.get('/',    getAllLostItems);
router.get('/my',  protect, getMyLostItems); // Place before /:id route so 'my' is not captured as :id
router.get('/:id', getLostItemById);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.post(  '/',    protect, uploadLostItemImages.array('images', 5), createLostItem);
router.put(   '/:id', protect, uploadLostItemImages.array('images', 5), updateLostItem);
router.delete('/:id', protect, deleteLostItem);

module.exports = router;
