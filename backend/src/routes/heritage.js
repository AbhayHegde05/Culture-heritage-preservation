const express = require('express');
const {
  getHeritageSites,
  getHeritageSite,
  createHeritageSite,
  updateHeritageSite,
  deleteHeritageSite,
  addReview,
  getNearbySites,
  validateHeritageSite,
  validateReview
} = require('../controllers/heritageController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getHeritageSites);
router.get('/nearby', getNearbySites);
router.get('/:id', getHeritageSite);

// Protected routes
router.post('/', protect, validateHeritageSite, createHeritageSite);
router.put('/:id', protect, updateHeritageSite);
router.post('/:id/reviews', protect, validateReview, addReview);

// Admin routes
router.delete('/:id', protect, authorize('admin'), deleteHeritageSite);

module.exports = router;
