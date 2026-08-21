'use strict';

const express = require('express');
const router  = express.Router();

const {
  getDashboardStats,
  getAllLostItemsAdmin,
  getAllFoundItemsAdmin,
  removeItem,
  flagItem,
  getAllClaimsAdmin,
  getAllMatchesAdmin,
  getAdminLogs,
} = require('../controllers/admin.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// Strict Admin-Only Security Barrier
router.use(protect);
router.use(authorize('admin'));

router.get(   '/stats',                   getDashboardStats);
router.get(   '/lost-items',              getAllLostItemsAdmin);
router.get(   '/found-items',             getAllFoundItemsAdmin);
router.delete('/items/:type/:id',         removeItem);
router.patch( '/items/:type/:id/flag',    flagItem);
router.get(   '/claims',                  getAllClaimsAdmin);
router.get(   '/matches',                 getAllMatchesAdmin);
router.get(   '/logs',                    getAdminLogs);

module.exports = router;
