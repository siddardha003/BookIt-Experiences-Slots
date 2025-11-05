import express from 'express';
import { mongoose } from '../db/connection.js';
import { Experience, ExperienceSchedule } from '../db/models.js';

const router = express.Router();

// GET /experiences - Return list of experiences
router.get('/', async (req, res) => {
  try {
    // Check if database is available
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not available. Please try again later.'
      });
    }

    const experiences = await Experience.find({}, {
      name: 1,
      short_description: 1,
      location: 1,
      price: 1,
      image_url: 1,
      category: 1
    }).sort({ _id: 1 });
    
    res.json({
      success: true,
      data: experiences.map(exp => ({
        id: exp._id,
        name: exp.name,
        short_description: exp.short_description,
        location: exp.location,
        price: exp.price,
        image_url: exp.image_url,
        category: exp.category
      }))
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experiences'
    });
  }
});

// GET /experiences/:id - Return details and slot availability
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if database is available
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not available. Please try again later.'
      });
    }
    
    // Get experience details using MongoDB ObjectId
    const experience = await Experience.findById(id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }
    
    // Get available schedules
    const currentDate = new Date();
    const schedules = await ExperienceSchedule.find({
      experience_id: id,
      date: { $gte: currentDate }
    }, {
      date: 1,
      time: 1,
      slots_available: 1,
      total_slots: 1
    }).sort({ date: 1, time: 1 });
    
    res.json({
      success: true,
      data: {
        id: experience._id,
        name: experience.name,
        description: experience.description,
        short_description: experience.short_description,
        location: experience.location,
        price: experience.price,
        image_url: experience.image_url,
        category: experience.category,
        min_age: experience.min_age,
        schedules: schedules.map(schedule => ({
          id: schedule._id,
          date: schedule.date,
          time: schedule.time,
          slots_available: schedule.slots_available,
          total_slots: schedule.total_slots
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching experience details:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experience details'
    });
  }
});

export { router as experiencesRouter };