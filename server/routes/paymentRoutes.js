const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    createOrder,
    verifyPayment,
    initiateRefund,
    handlePaymentCancellation,
    initiateRefund,
    handlePaymentCancellation,
    getPaymentStatus,
    getEnrollment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public endpoints (order creation needs user details but not auth)
router.post('/create-order', createOrder);

// Payment verification (called by Razorpay handler - no auth needed since we verify signature)
router.post('/verify-payment', verifyPayment);
router.post('/verify', verifyPayment);

// PROTECTED: Refund and cancel must require authentication + admin role
router.post('/refund', protect, authorize('admin'), initiateRefund);
router.post('/cancel', protect, authorize('admin'), handlePaymentCancellation);

// Protected endpoints (authentication required)
router.get('/status/:enrollmentId', protect, getPaymentStatus);
router.get('/enrollment/:courseId', protect, getEnrollment);

module.exports = router;
