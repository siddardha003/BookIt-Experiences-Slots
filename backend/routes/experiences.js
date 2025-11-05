import express from 'express';
import { mongoose } from '../db/connection.js';
import { Experience, ExperienceSchedule } from '../db/models.js';

const router = express.Router();

// POST /experiences/seed - Create sample experiences (development only)
router.post('/seed', async (req, res) => {
  try {
    // Check if database is available
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not available. Please try again later.'
      });
    }

    const sampleExperiences = [
      {
        name: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking. Scenic routes, trained guides, and safety briefing.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi',
        price: 999,
        image_url: '/frame-9.png',
        category: 'water-sports',
        min_age: 10
      },
      {
        name: 'Nandi Hills Sunrise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Early morning trek to witness breathtaking sunrise views from Nandi Hills.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Bangalore',
        price: 899,
        image_url: '/frame-9-2.png',
        category: 'trekking',
        min_age: 12
      },
      {
        name: 'Coffee Trail',
        description: 'Explore the beautiful coffee plantations with expert guides. Learn about coffee cultivation, taste fresh brews, and enjoy the scenic mountain views.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Coorg',
        price: 1299,
        image_url: '/frame-9-1.png',
        category: 'adventure',
        min_age: 8
      },
      {
        name: 'Kayaking',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking through pristine waters.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Udupi, Karnataka',
        price: 999,
        image_url: '/frame-9-4.png',
        category: 'water-sports',
        min_age: 10
      },
      {
        name: 'Nandi Hills Sunrise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the magical sunrise from one of Karnataka\'s most popular hill stations.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Bangalore',
        price: 899,
        image_url: '/frame-9-5.png',
        category: 'trekking',
        min_age: 12
      },
      {
        name: 'Boat Cruise',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Enjoy a relaxing cruise through scenic waterways with professional guides.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Sunderban',
        price: 999,
        image_url: '/frame-9-3.png',
        category: 'water-sports',
        min_age: 5
      },
      {
        name: 'Bunjee Jumping',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Experience the ultimate adrenaline rush with professional bungee jumping.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Manali',
        price: 2499,
        image_url: '/frame-9-6.png',
        category: 'extreme-sports',
        min_age: 18
      },
      {
        name: 'Coffee Trail',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Explore lush coffee plantations and learn about the coffee-making process.',
        short_description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        location: 'Coorg',
        price: 1299,
        image_url: '/frame-9-7.png',
        category: 'adventure',
        min_age: 8
      }
    ];

    // Clear existing experiences and schedules
    await Experience.deleteMany({});
    await ExperienceSchedule.deleteMany({});
    
    // Insert new experiences
    const insertedExperiences = await Experience.insertMany(sampleExperiences);
    
    // Create sample schedules for the experiences
    const sampleSchedules = [
      // Experience 1 - Kayaking (Udupi)
      { experience_id: insertedExperiences[0]._id, date: new Date('2025-11-06'), time: '07:00 am', slots_available: 4, total_slots: 4 },
      { experience_id: insertedExperiences[0]._id, date: new Date('2025-11-06'), time: '09:00 am', slots_available: 3, total_slots: 3 },
      { experience_id: insertedExperiences[0]._id, date: new Date('2025-11-06'), time: '11:00 am', slots_available: 5, total_slots: 5 },
      { experience_id: insertedExperiences[0]._id, date: new Date('2025-11-07'), time: '09:00 am', slots_available: 2, total_slots: 3 },
      
      // Experience 2 - Nandi Hills Sunrise (Bangalore)
      { experience_id: insertedExperiences[1]._id, date: new Date('2025-11-06'), time: '05:00 am', slots_available: 3, total_slots: 4 },
      { experience_id: insertedExperiences[1]._id, date: new Date('2025-11-06'), time: '05:30 am', slots_available: 2, total_slots: 3 },
      { experience_id: insertedExperiences[1]._id, date: new Date('2025-11-07'), time: '05:00 am', slots_available: 4, total_slots: 4 },
      
      // Experience 3 - Coffee Trail (Coorg)
      { experience_id: insertedExperiences[2]._id, date: new Date('2025-11-06'), time: '06:00 am', slots_available: 2, total_slots: 3 },
      { experience_id: insertedExperiences[2]._id, date: new Date('2025-11-06'), time: '08:00 am', slots_available: 1, total_slots: 2 },
      { experience_id: insertedExperiences[2]._id, date: new Date('2025-11-07'), time: '06:00 am', slots_available: 3, total_slots: 3 },
      
      // Experience 4 - Kayaking (Udupi, Karnataka)
      { experience_id: insertedExperiences[3]._id, date: new Date('2025-11-06'), time: '08:00 am', slots_available: 3, total_slots: 4 },
      { experience_id: insertedExperiences[3]._id, date: new Date('2025-11-06'), time: '10:00 am', slots_available: 2, total_slots: 3 },
      { experience_id: insertedExperiences[3]._id, date: new Date('2025-11-07'), time: '08:00 am', slots_available: 4, total_slots: 4 },
      
      // Experience 5 - Nandi Hills Sunrise (Bangalore - Second)
      { experience_id: insertedExperiences[4]._id, date: new Date('2025-11-06'), time: '05:00 am', slots_available: 2, total_slots: 4 },
      { experience_id: insertedExperiences[4]._id, date: new Date('2025-11-06'), time: '05:30 am', slots_available: 3, total_slots: 3 },
      { experience_id: insertedExperiences[4]._id, date: new Date('2025-11-07'), time: '05:00 am', slots_available: 1, total_slots: 4 },
      
      // Experience 6 - Boat Cruise (Sunderban)
      { experience_id: insertedExperiences[5]._id, date: new Date('2025-11-06'), time: '08:00 am', slots_available: 3, total_slots: 4 },
      { experience_id: insertedExperiences[5]._id, date: new Date('2025-11-06'), time: '10:00 am', slots_available: 2, total_slots: 3 },
      { experience_id: insertedExperiences[5]._id, date: new Date('2025-11-07'), time: '08:00 am', slots_available: 4, total_slots: 4 },
      
      // Experience 7 - Bunjee Jumping (Manali)
      { experience_id: insertedExperiences[6]._id, date: new Date('2025-11-06'), time: '10:00 am', slots_available: 1, total_slots: 2 },
      { experience_id: insertedExperiences[6]._id, date: new Date('2025-11-06'), time: '02:00 pm', slots_available: 2, total_slots: 2 },
      { experience_id: insertedExperiences[6]._id, date: new Date('2025-11-07'), time: '10:00 am', slots_available: 1, total_slots: 2 },
      
      // Experience 8 - Coffee Trail (Coorg - Second)
      { experience_id: insertedExperiences[7]._id, date: new Date('2025-11-06'), time: '07:00 am', slots_available: 2, total_slots: 3 },
      { experience_id: insertedExperiences[7]._id, date: new Date('2025-11-06'), time: '09:00 am', slots_available: 3, total_slots: 3 },
      { experience_id: insertedExperiences[7]._id, date: new Date('2025-11-07'), time: '07:00 am', slots_available: 2, total_slots: 3 }
    ];

    // Insert schedules
    const insertedSchedules = await ExperienceSchedule.insertMany(sampleSchedules);
    
    res.json({
      success: true,
      message: `Created ${insertedExperiences.length} sample experiences and ${insertedSchedules.length} schedules`,
      data: insertedExperiences.map(exp => ({
        id: exp._id,
        name: exp.name,
        location: exp.location,
        price: exp.price
      }))
    });
  } catch (error) {
    console.error('Error seeding experiences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to seed experiences'
    });
  }
});

// GET /experiences - Return list of experiences
router.get('/', async (req, res) => {
  try {
    const { search, category, location } = req.query;
    
    // Check if database is available
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not available. Please try again later.'
      });
    }

    // Build search query
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { short_description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const experiences = await Experience.find(query, {
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
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid experience ID format'
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