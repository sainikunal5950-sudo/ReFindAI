'use strict';
const mongoose = require('mongoose');
// LostItem model — schema for lost item reports
// TODO: define schema in Module 3
const LostItemSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('LostItem', LostItemSchema);
