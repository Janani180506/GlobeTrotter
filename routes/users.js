const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDestinations', 'name country image');

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, photo, language } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (photo !== undefined) user.photo = photo;
    if (language) user.language = language;

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users/saved-destinations
// @desc    Add saved destination
// @access  Private
router.post('/saved-destinations', protect, async (req, res) => {
  try {
    const { cityId } = req.body;

    if (!cityId) {
      return res.status(400).json({ message: 'Please provide cityId' });
    }

    const user = await User.findById(req.user._id);

    if (!user.savedDestinations.includes(cityId)) {
      user.savedDestinations.push(cityId);
      await user.save();
    }

    await user.populate('savedDestinations', 'name country image');

    res.json({
      success: true,
      data: user.savedDestinations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/users/saved-destinations/:cityId
// @desc    Remove saved destination
// @access  Private
router.delete('/saved-destinations/:cityId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.savedDestinations = user.savedDestinations.filter(
      (id) => id.toString() !== req.params.cityId
    );

    await user.save();
    await user.populate('savedDestinations', 'name country image');

    res.json({
      success: true,
      data: user.savedDestinations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

