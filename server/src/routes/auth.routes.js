'use strict';

const express = require('express');
const router  = express.Router();

const { register, login, logout, getMe } = require('../controllers/auth.controller');
const { protect }                         = require('../middleware/auth.middleware');

/**
 * Auth Routes — /api/auth
 *
 * POST /api/auth/register  → Create a new user account
 * POST /api/auth/login     → Authenticate and receive a JWT
 * POST /api/auth/logout    → Invalidate session / clear cookie
 * GET  /api/auth/me        → Get current user profile (protected)
 */
router.post('/register', register);
router.post('/login',    login);
router.post('/logout',   logout);
router.get( '/me',       protect, getMe);

module.exports = router;
