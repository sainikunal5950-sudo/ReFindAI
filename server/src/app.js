'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const errorMiddleware = require('./middleware/error.middleware');

// ─── Route imports ────────────────────────────────────────────────────────────
const authRoutes      = require('./routes/auth.routes');
const userRoutes      = require('./routes/user.routes');
const lostItemRoutes  = require('./routes/lostItem.routes');
const foundItemRoutes = require('./routes/foundItem.routes');
const matchRoutes        = require('./routes/match.routes');
const claimRoutes        = require('./routes/claim.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes        = require('./routes/admin.routes');

const app = express();

// ─── Global Middlewares ────────────────────────────────────────────────────────
app.use(cors());                 // Enable CORS for all origins (lock down in production)
app.use(express.json());         // Parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev'));           // HTTP request logger

// ─── Serve Static Uploads ──────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/lost-items',    lostItemRoutes);
app.use('/api/found-items',   foundItemRoutes);
app.use('/api/matches',       matchRoutes);
app.use('/api/claims',        claimRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
