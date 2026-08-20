'use strict';

// Load env variables first — before any other import reads process.env
const loadEnv = require('./config/env');
loadEnv();

const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * Bootstrap function: connect to DB then start the HTTP server.
 */
const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`   Health check → http://localhost:${PORT}/api/health`);
  });
};

start();
