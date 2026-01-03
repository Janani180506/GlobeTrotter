const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  region: {
    type: String,
    trim: true,
  },
  costIndex: {
    type: Number,
    default: 50,
    min: 0,
    max: 100,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  timezone: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('City', citySchema);

