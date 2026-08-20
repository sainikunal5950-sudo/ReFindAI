'use strict';

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the MONGO_URI from environment variables.
 * Logs a success message on connection, or exits the process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser and useUnifiedTopology are no longer required in
      // Mongoose 7+, but kept here as a safety default for older versions.
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
