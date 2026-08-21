'use strict';

const express = require('express');
const router  = express.Router();

const {
  getProfile,
  updateProfile,
  uploadAvatar: uploadAvatarController,
  getAllUsers,
  getUserById,
  deleteUser,
  blockUser,
} = require('../controllers/user.controller');

const { protect }      = require('../middleware/auth.middleware');
const { authorize }    = require('../middleware/role.middleware');
const { uploadAvatar } = require('../middleware/upload.middleware');

// ─── Current User Profile Routes (Protected) ──────────────────────────────────
router.get( '/me',        protect, getProfile);
router.put( '/me',        protect, updateProfile);
router.post('/me/avatar', protect, uploadAvatar.single('avatar'), uploadAvatarController);

// ─── Admin Management Routes (Protected + Admin Only) ─────────────────────────
router.get(   '/',         protect, authorize('admin'), getAllUsers);
router.get(   '/:id',      protect, authorize('admin'), getUserById);
router.delete('/:id',      protect, authorize('admin'), deleteUser);
router.patch( '/:id/block', protect, authorize('admin'), blockUser);

module.exports = router;
