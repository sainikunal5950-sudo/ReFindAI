'use strict';
const mongoose = require('mongoose');
// Notification model — schema for in-app notifications
// TODO: define schema in Module 5
const NotificationSchema = new mongoose.Schema({}, { timestamps: true });
module.exports = mongoose.model('Notification', NotificationSchema);
