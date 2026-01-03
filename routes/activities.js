const express = require('express');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/activities
// @desc    Search activities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, type, minCost, maxCost, minDuration, maxDuration, search } = req.query;

    let query = {};

    if (city) {
      query.city = city;
    }

    if (type) {
      query.type = type;
    }

    if (minCost || maxCost) {
      query.cost = {};
      if (minCost) query.cost.$gte = Number(minCost);
      if (maxCost) query.cost.$lte = Number(maxCost);
    }

    if (minDuration || maxDuration) {
      query.duration = {};
      if (minDuration) query.duration.$gte = Number(minDuration);
      if (maxDuration) query.duration.$lte = Number(maxDuration);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const activities = await Activity.find(query)
      .populate('city', 'name country')
      .sort({ rating: -1 })
      .limit(100);

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/activities/:id
// @desc    Get single activity
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('city', 'name country');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/activities
// @desc    Create activity (for seeding/admin)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const activity = await Activity.create(req.body);

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

