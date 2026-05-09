const express = require('express');
const router = express.Router();
const { 
    getCoupons, 
    createCoupon, 
    validateCoupon, 
    deleteCoupon, 
    toggleCouponStatus 
} = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route to validate coupon
router.post('/validate', validateCoupon);

// Admin routes
router.use(protect, adminOnly);
router.get('/', getCoupons);
router.post('/', createCoupon);
router.delete('/:id', deleteCoupon);
router.patch('/:id/toggle', toggleCouponStatus);

module.exports = router;
