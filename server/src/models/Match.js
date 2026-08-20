'use strict';
const mongoose = require('mongoose');
// Match model — schema for AI-generated matches between lost & found items
// TODO: define schema in Module 4
const MatchSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Match', MatchSchema);
