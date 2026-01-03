const express = require('express');
const Trip = require('../models/Trip');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

const router = express.Router();

// @route   GET /api/trips
// @desc    Get all trips for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id })
      .populate('stops.city', 'name country costIndex image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('stops.city', 'name country costIndex image description coordinates')
      .populate('stops.activities.activity', 'name type description cost duration image rating address');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user owns the trip or if it's public
    if (trip.user.toString() !== req.user._id.toString() && !trip.isPublic) {
      return res.status(403).json({ message: 'Not authorized to access this trip' });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/trips
// @desc    Create new trip
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, startDate, endDate, coverPhoto } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide name, startDate, and endDate' });
    }

    const trip = await Trip.create({
      user: req.user._id,
      name,
      description,
      startDate,
      endDate,
      coverPhoto,
    });

    res.status(201).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this trip' });
    }

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('stops.city')
      .populate('stops.activities.activity');

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this trip' });
    }

    await trip.deleteOne();

    res.json({
      success: true,
      message: 'Trip deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/trips/:id/stops
// @desc    Add stop to trip
// @access  Private
router.post('/:id/stops', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { city, arrivalDate, departureDate, order } = req.body;

    if (!city || !arrivalDate || !departureDate) {
      return res.status(400).json({ message: 'Please provide city, arrivalDate, and departureDate' });
    }

    const maxOrder = trip.stops.length > 0 ? Math.max(...trip.stops.map(s => s.order)) : -1;
    const newOrder = order !== undefined ? order : maxOrder + 1;

    trip.stops.push({
      city,
      arrivalDate,
      departureDate,
      order: newOrder,
    });

    await trip.save();
    await trip.populate('stops.city');

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/trips/:id/stops/:stopId
// @desc    Update stop
// @access  Private
router.put('/:id/stops/:stopId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }

    Object.assign(stop, req.body);
    await trip.save();
    await trip.populate('stops.city');

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/trips/:id/stops/:stopId
// @desc    Delete stop
// @access  Private
router.delete('/:id/stops/:stopId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    trip.stops.id(req.params.stopId).deleteOne();
    await trip.save();

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/trips/:id/stops/:stopId/activities
// @desc    Add activity to stop
// @access  Private
router.post('/:id/stops/:stopId/activities', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }

    const { activity, date, time, cost, notes } = req.body;

    if (!activity || !date) {
      return res.status(400).json({ message: 'Please provide activity and date' });
    }

    stop.activities.push({
      activity,
      date,
      time,
      cost,
      notes,
    });

    await trip.save();
    await trip.populate('stops.activities.activity');

    // Recalculate budget
    calculateBudget(trip);
    await trip.save();

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/trips/:id/stops/:stopId/activities/:activityId
// @desc    Remove activity from stop
// @access  Private
router.delete('/:id/stops/:stopId/activities/:activityId', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }

    stop.activities.id(req.params.activityId).deleteOne();
    await trip.save();

    // Recalculate budget
    calculateBudget(trip);
    await trip.save();

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/trips/:id/share
// @desc    Generate share token for trip
// @access  Private
router.post('/:id/share', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const shareToken = crypto.randomBytes(32).toString('hex');
    trip.shareToken = shareToken;
    trip.isPublic = true;
    await trip.save();

    res.json({
      success: true,
      shareToken,
      shareUrl: `${req.protocol}://${req.get('host')}/trip/${shareToken}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/trips/share/:token
// @desc    Get public trip by share token
// @access  Public
router.get('/share/:token', async (req, res) => {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token })
      .populate('stops.city', 'name country costIndex image description')
      .populate('stops.activities.activity', 'name type description cost duration image rating');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate budget
function calculateBudget(trip) {
  let transport = 0;
  let accommodation = 0;
  let activities = 0;
  let meals = 0;

  trip.stops.forEach((stop) => {
    if (stop.transport && stop.transport.cost) {
      transport += stop.transport.cost;
    }
    if (stop.accommodation && stop.accommodation.cost) {
      accommodation += stop.accommodation.cost;
    }
    stop.activities.forEach((act) => {
      if (act.cost) {
        activities += act.cost;
      }
    });
    // Estimate meals: $30 per day per person (can be customized)
    const days = Math.ceil((stop.departureDate - stop.arrivalDate) / (1000 * 60 * 60 * 24));
    meals += days * 30;
  });

  const total = transport + accommodation + activities + meals;

  trip.budget = {
    total,
    transport,
    accommodation,
    activities,
    meals,
  };
}

// @route   GET /api/trips/:id/budget
// @desc    Get budget breakdown
// @access  Private
router.get('/:id/budget', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('stops.city')
      .populate('stops.activities.activity');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    calculateBudget(trip);
    await trip.save();

    const days = Math.ceil((trip.endDate - trip.startDate) / (1000 * 60 * 60 * 24));
    const avgCostPerDay = days > 0 ? trip.budget.total / days : 0;

    res.json({
      success: true,
      data: {
        ...trip.budget,
        avgCostPerDay: Math.round(avgCostPerDay * 100) / 100,
        days,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

