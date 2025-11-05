import mongoose from 'mongoose';

// Experience Schema
const experienceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: false
  },
  short_description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    maxlength: 255
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image_url: {
    type: String,
    required: false
  },
  category: {
    type: String,
    maxlength: 100
  },
  min_age: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Experience Schedule Schema
const experienceScheduleSchema = new mongoose.Schema({
  experience_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    maxlength: 20
  },
  slots_available: {
    type: Number,
    required: true,
    min: 0
  },
  total_slots: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Only createdAt for schedules
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
  reference_id: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  experience_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExperienceSchedule',
    required: true
  },
  full_name: {
    type: String,
    required: true,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    maxlength: 255
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  promo_code: {
    type: String,
    maxlength: 50
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    default: 'confirmed',
    enum: ['confirmed', 'pending', 'cancelled', 'completed']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create indexes for better performance
experienceSchema.index({ category: 1 });
experienceSchema.index({ location: 1 });
experienceSchema.index({ price: 1 });

experienceScheduleSchema.index({ experience_id: 1 });
experienceScheduleSchema.index({ date: 1 });
experienceScheduleSchema.index({ experience_id: 1, date: 1 });

// Note: reference_id index is automatically created by 'unique: true' in schema
bookingSchema.index({ email: 1 });
bookingSchema.index({ experience_id: 1 });
bookingSchema.index({ schedule_id: 1 });

// Create models
const Experience = mongoose.model('Experience', experienceSchema);
const ExperienceSchedule = mongoose.model('ExperienceSchedule', experienceScheduleSchema);
const Booking = mongoose.model('Booking', bookingSchema);

export { Experience, ExperienceSchedule, Booking };