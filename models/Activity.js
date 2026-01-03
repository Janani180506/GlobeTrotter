const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'nightlife', 'shopping', 'nature', 'other'],
  },
  description: {
    type: String,
    default: '',
  },
  cost: {
    type: Number,
    default: 0,
    min: 0,
  },
  duration: {
    type: Number,
    default: 60,
    min: 15,
  },
  image: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  address: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Activity', activitySchema);

