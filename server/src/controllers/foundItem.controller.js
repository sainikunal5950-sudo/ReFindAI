'use strict';

const foundItemService  = require('../services/foundItem.service');
const { sendSuccess }   = require('../utils/response');
const { ALLOWED_CATEGORIES } = require('../models/FoundItem');

/**
 * Validates found item creation input fields.
 */
const validateFoundItemInput = ({ title, description, category, location, date }) => {
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
    errors.push('Date found is required');
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
 * POST /api/found-items
 * Create a new found item report.
 */
const createFoundItem = async (req, res, next) => {
  try {
    validateFoundItemInput(req.body);

    const { title, description, category, location, date, handoverLocation } = req.body;

    // Collect uploaded file URLs
    const uploadedImages = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        uploadedImages.push(`/uploads/found-items/${file.filename}`);
      });
    } else if (req.body.images) {
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      uploadedImages.push(...imgs);
    }

    // Match exact category casing
    const matchedCategory =
      ALLOWED_CATEGORIES.find((c) => c.toLowerCase() === category.trim().toLowerCase()) ||
      category.trim();

    const item = await foundItemService.createFoundItem(req.user._id, {
      title: title.trim(),
      description: description.trim(),
      category: matchedCategory,
      location: location.trim(),
      date: new Date(date),
      handoverLocation: handoverLocation ? handoverLocation.trim() : '',
      images: uploadedImages.slice(0, 5),
    });

    sendSuccess(res, 201, 'Found item report created successfully', { item });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/found-items
 * List all found items with search, category/location/date filters, and pagination.
 */
const getAllFoundItems = async (req, res, next) => {
  try {
    const { category, location, status, startDate, endDate, search, page, limit } = req.query;

    const result = await foundItemService.getAllFoundItems(
      { category, location, status, startDate, endDate, search },
      { page, limit }
    );

    sendSuccess(res, 200, 'Found items retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/found-items/my
 * Get all found items reported by the logged-in user.
 */
const getMyFoundItems = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await foundItemService.getMyFoundItems(req.user._id, { page, limit });

    sendSuccess(res, 200, 'Your found item reports retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/found-items/:id
 * Get single found item details by ID.
 */
const getFoundItemById = async (req, res, next) => {
  try {
    const item = await foundItemService.getFoundItemById(req.params.id);
    sendSuccess(res, 200, 'Found item details retrieved successfully', { item });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/found-items/:id
 * Update a found item report (owner or admin only).
 */
const updateFoundItem = async (req, res, next) => {
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
      const newImages = req.files.map((f) => `/uploads/found-items/${f.filename}`);
      if (updatePayload.images) {
        const existing = Array.isArray(updatePayload.images)
          ? updatePayload.images
          : [updatePayload.images];
        updatePayload.images = [...existing, ...newImages].slice(0, 5);
      } else {
        updatePayload.images = newImages.slice(0, 5);
      }
    }

    const updatedItem = await foundItemService.updateFoundItem(
      req.params.id,
      req.user._id,
      req.user.role,
      updatePayload
    );

    sendSuccess(res, 200, 'Found item report updated successfully', { item: updatedItem });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/found-items/:id
 * Delete a found item report (owner or admin only).
 */
const deleteFoundItem = async (req, res, next) => {
  try {
    const deletedItem = await foundItemService.deleteFoundItem(
      req.params.id,
      req.user._id,
      req.user.role
    );

    sendSuccess(res, 200, 'Found item report deleted successfully', {
      item: { id: deletedItem._id, title: deletedItem.title },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFoundItem,
  getAllFoundItems,
  getMyFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
};
