const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
    createOrder,
    verifyPayment,
    initiateRefund,
    handlePaymentCancellation,
    getPaymentStatus,
    getEnrollment,
    handleRazorpayWebhook
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rate limiting for payment endpoints (prevent spam and attacks)
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 payment attempts per 15 minutes
    message: {
        success: false,
        message: 'Too many payment attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Public endpoints (order creation needs user details but not auth)
router.post('/create-order', paymentLimiter, createOrder);
router.post('/verify-payment', paymentLimiter, verifyPayment);
router.post('/verify', paymentLimiter, verifyPayment);

// Razorpay webhooks (server-to-server verification - CRITICAL for payment security)
router.post('/webhook', rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Max 10 webhook requests per minute
    message: {
        success: false,
        message: 'Too many webhook requests.'
    }
}), handleRazorpayWebhook);

// PROTECTED: Refund and cancel must require authentication + admin role
router.post('/refund', protect, authorize('admin'), initiateRefund);
router.post('/cancel', protect, handlePaymentCancellation);

// Protected endpoints (authentication required)
router.get('/status/:enrollmentId', protect, getPaymentStatus);
router.get('/enrollment/:courseId', protect, getEnrollment);

module.exports = router;
