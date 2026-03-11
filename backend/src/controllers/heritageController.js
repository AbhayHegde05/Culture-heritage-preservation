const HeritageSite = require('../models/HeritageSite');
const { body, validationResult } = require('express-validator');

// @desc    Get all heritage sites
// @route   GET /api/heritage
// @access  Public
exports.getHeritageSites = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const city = req.query.city;
    const state = req.query.state;

    // Build query
    const query = { status: 'active' };
    
    if (category) {
      query.category = category;
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }

    const sites = await HeritageSite.find(query)
      .populate('contributedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await HeritageSite.countDocuments(query);

    res.status(200).json({
      success: true,
      count: sites.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: sites
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single heritage site
// @route   GET /api/heritage/:id
// @access  Public
exports.getHeritageSite = async (req, res, next) => {
  try {
    const site = await HeritageSite.findById(req.params.id)
      .populate('contributedBy', 'name email')
      .populate('reviews.user', 'name');

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    res.status(200).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new heritage site
// @route   POST /api/heritage
// @access  Private
exports.createHeritageSite = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Add contributed by user
    req.body.contributedBy = req.user.id;

    const site = await HeritageSite.create(req.body);

    res.status(201).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update heritage site
// @route   PUT /api/heritage/:id
// @access  Private
exports.updateHeritageSite = async (req, res, next) => {
  try {
    let site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Check if user is the contributor or admin
    if (site.contributedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this site'
      });
    }

    site = await HeritageSite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete heritage site
// @route   DELETE /api/heritage/:id
// @access  Private/Admin
exports.deleteHeritageSite = async (req, res, next) => {
  try {
    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    await site.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to heritage site
// @route   POST /api/heritage/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const site = await HeritageSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Heritage site not found'
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = site.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this site'
      });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      visitDate: req.body.visitDate,
      images: req.body.images || []
    };

    site.reviews.push(review);
    await site.updateAverageRating();

    res.status(201).json({
      success: true,
      data: site
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby heritage sites
// @route   GET /api/heritage/nearby
// @access  Public
exports.getNearbySites = async (req, res, next) => {
  try {
    const { lat, lng, maxDistance = 50000 } = req.query; // maxDistance in meters (default 50km)

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const sites = await HeritageSite.find({
      status: 'active',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    }).limit(20);

    res.status(200).json({
      success: true,
      count: sites.length,
      data: sites
    });
  } catch (error) {
    next(error);
  }
};

// Validation middleware
exports.validateHeritageSite = [
  body('name').trim().notEmpty().withMessage('Site name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['temple', 'lake', 'monument', 'fort', 'palace', 'museum', 'natural_site', 'archaeological_site', 'other']).withMessage('Invalid category'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('history.established').notEmpty().withMessage('Establishment period is required'),
  body('history.historicalSignificance').notEmpty().withMessage('Historical significance is required')
];

exports.validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required')
];
