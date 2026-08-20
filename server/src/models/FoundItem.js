'use strict';
const mongoose = require('mongoose');
// FoundItem model — schema for found item reports
// TODO: define schema in Module 3
const FoundItemSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('FoundItem', FoundItemSchema);
