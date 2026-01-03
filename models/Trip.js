const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  activities: [
    {
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
      },
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: String,
        default: '',
      },
      cost: {
        type: Number,
        default: 0,
      },
      notes: {
        type: String,
        default: '',
      },
    },
  ],
  accommodation: {
    name: String,
    cost: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['hotel', 'hostel', 'airbnb', 'other'],
    },
  },
  transport: {
    type: {
      type: String,
      enum: ['flight', 'train', 'bus', 'car', 'other'],
    },
    cost: {
      type: Number,
      default: 0,
    },
  },
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a trip name'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  coverPhoto: {
    type: String,
    default: '',
  },
  stops: [stopSchema],
  budget: {
    total: {
      type: Number,
      default: 0,
    },
    transport: {
      type: Number,
      default: 0,
    },
    accommodation: {
      type: Number,
      default: 0,
    },
    activities: {
      type: Number,
      default: 0,
    },
    meals: {
      type: Number,
      default: 0,
    },
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

tripSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Trip', tripSchema);

