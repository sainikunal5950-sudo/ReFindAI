'use strict';

const express = require('express');
const router  = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notification.controller');

const { protect } = require('../middleware/auth.middleware');

// All notification routes are protected
router.use(protect);

router.get(  '/',           getMyNotifications);
router.patch('/read-all',   markAllAsRead); // Mount before /:id/read
router.patch('/:id/read',   markAsRead);

module.exports = router;
