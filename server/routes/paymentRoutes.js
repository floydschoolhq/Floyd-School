const express = require('express');
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    initiateRefund,
    handlePaymentCancellation,
    getPaymentStatus,
    getEnrollment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints (no authentication required)
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);
router.post('/verify', verifyPayment); // Add this route for frontend compatibility
router.post('/refund', initiateRefund);
router.post('/cancel', handlePaymentCancellation);

// Protected endpoints (authentication required)
router.get('/status/:enrollmentId', protect, getPaymentStatus);
router.get('/enrollment/:courseId', protect, getEnrollment);

module.exports = router;

module.exports = router;
