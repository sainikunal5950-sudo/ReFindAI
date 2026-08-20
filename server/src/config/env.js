'use strict';

const dotenv = require('dotenv');
const path = require('path');

/**
 * Loads environment variables from the .env file located at the server root.
 * Call this as early as possible — before any other module reads process.env.
 */
const loadEnv = () => {
  const envPath = path.resolve(__dirname, '../../.env');
  const result = dotenv.config({ path: envPath });

  if (result.error) {
    console.warn(`⚠️  No .env file found at ${envPath}. Falling back to system environment variables.`);
  }
};

module.exports = loadEnv;
