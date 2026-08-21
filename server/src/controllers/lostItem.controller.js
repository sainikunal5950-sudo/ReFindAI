'use strict';

const lostItemService   = require('../services/lostItem.service');
const { sendSuccess }   = require('../utils/response');
const { ALLOWED_CATEGORIES } = require('../models/LostItem');

/**
 * Validates lost item creation input fields.
 */
const validateLostItemInput = ({ title, description, category, location, date }) => {
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Title is required and must be at least 3 characters');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters');
  }

  if (!category || typeof category !== 'string') {
    errors.push('Category is required');
  } else {
    const isCategoryValid = ALLOWED_CATEGORIES.some(
      (c) => c.toLowerCase() === category.trim().toLowerCase()
    );
    if (!isCategoryValid) {
      errors.push(`Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
    }
  }

  if (!location || typeof location !== 'string' || location.trim().length < 2) {
    errors.push('Location is required and must be at least 2 characters');
  }

  if (!date) {
    errors.push('Date of loss is required');
  } else {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Please provide a valid date format');
    } else {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (parsedDate > tomorrow) {
        errors.push('Date cannot be in the future');
      }
    }
  }

  if (errors.length > 0) {
    const err = new Error(errors.join('. '));
    err.statusCode = 400;
    err.errors = errors;
    throw err;
  }
};

/**
 * POST /api/lost-items
 * Create a new lost item report.
 */
const createLostItem = async (req, res, next) => {
  try {
    validateLostItemInput(req.body);

    const { title, description, category, location, date } = req.body;

    // Collect uploaded file URLs
    const uploadedImages = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        uploadedImages.push(`/uploads/lost-items/${file.filename}`);
      });
    } else if (req.body.images) {
      // If client passed image URLs directly
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      uploadedImages.push(...imgs);
    }

    // Match exact category casing
    const matchedCategory =
      ALLOWED_CATEGORIES.find((c) => c.toLowerCase() === category.trim().toLowerCase()) ||
      category.trim();

    const item = await lostItemService.createLostItem(req.user._id, {
      title: title.trim(),
      description: description.trim(),
      category: matchedCategory,
      location: location.trim(),
      date: new Date(date),
      images: uploadedImages.slice(0, 5),
    });

    sendSuccess(res, 201, 'Lost item report created successfully', { item });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/lost-items
 * List all lost items with search, category/location/date filters, and pagination.
 */
const getAllLostItems = async (req, res, next) => {
  try {
    const { category, location, status, startDate, endDate, search, page, limit } = req.query;

    const result = await lostItemService.getAllLostItems(
      { category, location, status, startDate, endDate, search },
      { page, limit }
    );

    sendSuccess(res, 200, 'Lost items retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/lost-items/my
 * Get all lost items created by the logged-in user.
 */
const getMyLostItems = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await lostItemService.getMyLostItems(req.user._id, { page, limit });

    sendSuccess(res, 200, 'Your lost item reports retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/lost-items/:id
 * Get single lost item details by ID.
 */
const getLostItemById = async (req, res, next) => {
  try {
    const item = await lostItemService.getLostItemById(req.params.id);
    sendSuccess(res, 200, 'Lost item details retrieved successfully', { item });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/lost-items/:id
 * Update a lost item report (owner or admin only).
 */
const updateLostItem = async (req, res, next) => {
  try {
    const updatePayload = { ...req.body };

    // Format date if provided
    if (updatePayload.date) {
      const parsedDate = new Date(updatePayload.date);
      if (isNaN(parsedDate.getTime())) {
        const err = new Error('Please provide a valid date format');
        err.statusCode = 400;
        throw err;
      }
      updatePayload.date = parsedDate;
    }

    // Format category if provided
    if (updatePayload.category) {
      const matched = ALLOWED_CATEGORIES.find(
        (c) => c.toLowerCase() === updatePayload.category.trim().toLowerCase()
      );
      if (!matched) {
        const err = new Error(`Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(', ')}`);
        err.statusCode = 400;
        throw err;
      }
      updatePayload.category = matched;
    }

    // Handle new uploaded files if provided
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImages = req.files.map((f) => `/uploads/lost-items/${f.filename}`);
      if (updatePayload.images) {
        const existing = Array.isArray(updatePayload.images)
          ? updatePayload.images
          : [updatePayload.images];
        updatePayload.images = [...existing, ...newImages].slice(0, 5);
      } else {
        updatePayload.images = newImages.slice(0, 5);
      }
    }

    const updatedItem = await lostItemService.updateLostItem(
      req.params.id,
      req.user._id,
      req.user.role,
      updatePayload
    );

    sendSuccess(res, 200, 'Lost item report updated successfully', { item: updatedItem });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/lost-items/:id
 * Delete a lost item report (owner or admin only).
 */
const deleteLostItem = async (req, res, next) => {
  try {
    const deletedItem = await lostItemService.deleteLostItem(
      req.params.id,
      req.user._id,
      req.user.role
    );

    sendSuccess(res, 200, 'Lost item report deleted successfully', {
      item: { id: deletedItem._id, title: deletedItem.title },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createLostItem,
  getAllLostItems,
  getMyLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
};
