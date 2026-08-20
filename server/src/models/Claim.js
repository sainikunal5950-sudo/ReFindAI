'use strict';
const mongoose = require('mongoose');
// Claim model — schema for item claim requests
// TODO: define schema in Module 5
const ClaimSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Claim', ClaimSchema);
