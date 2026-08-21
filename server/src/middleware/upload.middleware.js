'use strict';

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Ensure root and sub-upload directories exist
const uploadDir          = path.join(__dirname, '../../uploads');
const lostItemUploadDir  = path.join(uploadDir, 'lost-items');
const foundItemUploadDir = path.join(uploadDir, 'found-items');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(lostItemUploadDir)) {
  fs.mkdirSync(lostItemUploadDir, { recursive: true });
}
if (!fs.existsSync(foundItemUploadDir)) {
  fs.mkdirSync(foundItemUploadDir, { recursive: true });
}

// ─── Avatar Storage ────────────────────────────────────────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${req.user ? req.user._id : 'user'}-${uniqueSuffix}${ext}`);
  },
});

// ─── Lost Item Images Storage ──────────────────────────────────────────────────
const lostItemStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, lostItemUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `lost-${req.user ? req.user._id : 'item'}-${uniqueSuffix}${ext}`);
  },
});

// ─── Found Item Images Storage ─────────────────────────────────────────────────
const foundItemStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, foundItemUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `found-${req.user ? req.user._id : 'item'}-${uniqueSuffix}${ext}`);
  },
});

// File filter (images only)
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error('Only image files (JPEG, JPG, PNG, WEBP, GIF) are allowed');
    err.statusCode = 400;
    cb(err, false);
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter: imageFileFilter,
});

const uploadLostItemImages = multer({
  storage: lostItemStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per image
    files: 5,                  // Max 5 images
  },
  fileFilter: imageFileFilter,
});

const uploadFoundItemImages = multer({
  storage: foundItemStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per image
    files: 5,                  // Max 5 images
  },
  fileFilter: imageFileFilter,
});

module.exports = {
  uploadAvatar,
  uploadLostItemImages,
  uploadFoundItemImages,
};
