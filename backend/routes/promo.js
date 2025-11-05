import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Predefined promo codes
const PROMO_CODES = {
  'SAVE10': {
    type: 'percentage',
    value: 10,
    description: '10% off on your booking'
  },
  'FLAT100': {
    type: 'fixed',
    value: 100,
    description: '₹100 off on your booking'
  },
  'WELCOME20': {
    type: 'percentage',
    value: 20,
    description: '20% off for new users'
  }
};

// POST /promo/validate - Validate promo codes
router.post('/validate', [
  body('promoCode').trim().isLength({ min: 1 }).withMessage('Promo code is required'),
  body('amount').isNumeric().withMessage('Amount is required')
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

    const { promoCode, amount } = req.body;
    const upperPromoCode = promoCode.toUpperCase();
    
    const promo = PROMO_CODES[upperPromoCode];
    
    if (!promo) {
      return res.status(400).json({
        success: false,
        error: 'Invalid promo code'
      });
    }
    
    let discount = 0;
    let finalAmount = amount;
    
    if (promo.type === 'percentage') {
      discount = Math.round((amount * promo.value) / 100);
    } else if (promo.type === 'fixed') {
      discount = Math.min(promo.value, amount); // Don't let discount exceed amount
    }
    
    finalAmount = Math.max(0, amount - discount);
    
    res.json({
      success: true,
      data: {
        promoCode: upperPromoCode,
        discount,
        finalAmount,
        description: promo.description
      }
    });
    
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate promo code'
    });
  }
});

export { router as promoRouter };