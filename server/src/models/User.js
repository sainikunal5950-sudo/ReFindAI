'use strict';
const mongoose = require('mongoose');
// User model — schema for registered users
// TODO: define schema in Module 2
const UserSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
