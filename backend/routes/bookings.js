import express from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { mongoose } from '../db/connection.js';
import { Experience, ExperienceSchedule, Booking } from '../db/models.js';

const router = express.Router();

// POST /bookings - Accept booking details and store them
router.post('/', [
  body('experienceId').notEmpty().withMessage('Experience ID is required'),
  body('scheduleId').notEmpty().withMessage('Schedule ID is required'),
  body('fullName').trim().isLength({ min: 2 }).withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('quantity').isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      experienceId,
      scheduleId,
      fullName,
      email,
      quantity,
      promoCode = null,
      totalAmount
    } = req.body;

    // Check if database is available
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database not available. Please try again later.'
      });
    }

    // MongoDB booking logic using transactions
    const session = await mongoose.startSession();
    
    try {
      let result;
      
      await session.withTransaction(async () => {
        // Check slot availability
        const schedule = await ExperienceSchedule.findOne({
          _id: scheduleId,
          experience_id: experienceId
        }).session(session);
        
        if (!schedule) {
          throw new Error('Schedule not found');
        }
        
        if (schedule.slots_available < quantity) {
          throw new Error(`Only ${schedule.slots_available} slots available`);
        }
        
        // Create booking
        const referenceId = `HUF${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        const booking = new Booking({
          reference_id: referenceId,
          experience_id: experienceId,
          schedule_id: scheduleId,
          full_name: fullName,
          email,
          quantity,
          promo_code: promoCode,
          total_amount: totalAmount,
          status: 'confirmed'
        });
        
        await booking.save({ session });
        
        // Update available slots
        await ExperienceSchedule.findByIdAndUpdate(
          scheduleId,
          { $inc: { slots_available: -quantity } },
          { session }
        );
        
        result = { bookingId: booking._id, referenceId };
      });
      
      res.json({
        success: true,
        data: {
          bookingId: result.bookingId,
          referenceId: result.referenceId,
          message: 'Booking confirmed successfully'
        }
      });
      
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
    
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create booking'
    });
  }
});

export { router as bookingsRouter };