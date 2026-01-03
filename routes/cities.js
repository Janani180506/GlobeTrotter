const express = require('express');
const City = require('../models/City');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cities
// @desc    Search cities
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, country, region, minCost, maxCost, sortBy = 'popularity' } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }

    if (minCost || maxCost) {
      query.costIndex = {};
      if (minCost) query.costIndex.$gte = Number(minCost);
      if (maxCost) query.costIndex.$lte = Number(maxCost);
    }

    let sort = {};
    if (sortBy === 'popularity') {
      sort = { popularity: -1 };
    } else if (sortBy === 'cost') {
      sort = { costIndex: 1 };
    } else if (sortBy === 'name') {
      sort = { name: 1 };
    }

    const cities = await City.find(query).sort(sort).limit(100);

    res.json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/cities/popular
// @desc    Get popular cities
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const cities = await City.find().sort({ popularity: -1 }).limit(10);

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/cities/:id
// @desc    Get single city
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.json({
      success: true,
      data: city,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/cities
// @desc    Create city (for seeding/admin)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const city = await City.create(req.body);

    res.status(201).json({
      success: true,
      data: city,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

