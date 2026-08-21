'use strict';

const express = require('express');
const router  = express.Router();

const {
  createFoundItem,
  getAllFoundItems,
  getMyFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
} = require('../controllers/foundItem.controller');

const { protect }               = require('../middleware/auth.middleware');
const { uploadFoundItemImages } = require('../middleware/upload.middleware');

// ─── Public Routes ────────────────────────────────────────────────────────────
router.get('/',    getAllFoundItems);
router.get('/my',  protect, getMyFoundItems); // Place before /:id route so 'my' is not captured as :id
router.get('/:id', getFoundItemById);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.post(  '/',    protect, uploadFoundItemImages.array('images', 5), createFoundItem);
router.put(   '/:id', protect, uploadFoundItemImages.array('images', 5), updateFoundItem);
router.delete('/:id', protect, deleteFoundItem);

module.exports = router;
