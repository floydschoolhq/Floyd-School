const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// Initialize Razorpay instance
const razorpayKeyId = process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.trim() : '';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET ? process.env.RAZORPAY_KEY_SECRET.trim() : '';
const hasRazorpayCredentials = Boolean(razorpayKeyId && razorpayKeySecret);

if (!hasRazorpayCredentials) {
    console.warn('[Payment Warning] Razorpay keys are missing or empty. Order creation will be disabled until credentials are configured.');
}

const razorpay = hasRazorpayCredentials
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret
    })
    : null;

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Public
const createOrder = async (req, res) => {
    if (!hasRazorpayCredentials || !razorpay) {
        return res.status(500).json({
            success: false,
            message: 'Payment gateway is not configured. Please provide Razorpay credentials.'
        });
    }

    try {
        const { courseId, fullName, email, phone } = req.body;

        // Validate inputs
        if (!courseId || !fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Get course details - handle both ObjectId and string IDs
        let course;
        
        // If courseId is a simple string like "1", "2", etc., map to actual course
        const courseMapping = {
            '1': 'AI & Machine Learning',
            '2': 'Development (Web/App)', 
            '3': 'IoT & Robotics',
            '4': 'Cyber Security'
        };
        
        if (courseMapping[courseId]) {
            // Find course by title for fallback data
            course = await Course.findOne({ title: courseMapping[courseId] });
        } else {
            // Try to find by ObjectId first
            try {
                course = await Course.findById(courseId);
            } catch (error) {
                // If ObjectId conversion fails, try finding by title
                course = await Course.findOne({ title: courseId });
            }
        }
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Validate course pricing
        const coursePrice = Number(course.price ?? 0);
        if (!Number.isFinite(coursePrice) || coursePrice <= 0) {
            console.error('[Payment Error] Invalid course price for course:', courseId, 'price:', course.price);
            return res.status(400).json({
                success: false,
                message: 'Course price is not configured. Contact support.'
            });
        }

        // Check if email already enrolled in this course
        const existingEnrollment = await Enrollment.findOne({
            'userDetails.email': email,
            course: course._id,
            paymentStatus: 'completed'
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: 'This email is already enrolled in this course'
            });
        }

        // Create Razorpay order
        const orderOptions = {
            amount: Math.round(coursePrice * 100), // Razorpay expects amount in paise
            currency: course.currency || 'INR',
            receipt: `course_${courseId}_${Date.now()}`,
            notes: {
                courseId: courseId.toString(),
                courseName: course.title,
                studentName: fullName,
                studentEmail: email
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        // Create enrollment record in pending state (without user ID initially)
        const enrollment = await Enrollment.create({
            course: course._id,
            paymentStatus: 'pending',
            razorpayOrderId: order.id,
            amount: coursePrice,
            currency: course.currency || 'INR',
            userDetails: {
                fullName,
                email,
                phone
            }
        });

        res.status(200).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            enrollmentId: enrollment._id,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        const razorpayError = error.error || {};
        console.error('[Payment Error] Create Order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment order',
            detail: razorpayError.description || razorpayError.reason || error.message,
            raw: razorpayError
        });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Public
const verifyPayment = async (req, res) => {
    try {
        console.log('[Payment Debug] Verification request received:', req.body);
        
        // Handle different Razorpay response formats
        const razorpayOrderId = req.body.razorpay_order_id || req.body.order_id;
        const razorpayPaymentId = req.body.razorpay_payment_id || req.body.payment_id;
        const razorpaySignature = req.body.razorpay_signature || req.body.signature;

        console.log('[Payment Debug] Extracted values:', {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature: razorpaySignature ? 'present' : 'missing'
        });

        // Validate inputs
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            console.log('[Payment Debug] Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details'
            });
        }

        // Verify signature
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        console.log('[Payment Debug] Signature verification:', {
            body,
            expectedSignature,
            receivedSignature: razorpaySignature,
            match: expectedSignature === razorpaySignature
        });

        if (expectedSignature !== razorpaySignature) {
            console.log('[Payment Debug] Signature mismatch');
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Find enrollment by razorpay order ID
        console.log('[Payment Debug] Looking for enrollment with order ID:', razorpayOrderId);
        const enrollment = await Enrollment.findOne({ razorpayOrderId });
        console.log('[Payment Debug] Found enrollment:', enrollment ? 'yes' : 'no');
        
        if (!enrollment) {
            console.log('[Payment Debug] Enrollment not found');
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found for this order'
            });
        }

        // Update enrollment record
        const updatedEnrollment = await Enrollment.findByIdAndUpdate(
            enrollment._id,
            {
                paymentStatus: 'completed',
                razorpayPaymentId,
                razorpaySignature,
                status: 'active'
            },
            { new: true }
        ).populate('course', 'title');

        console.log('[Payment Debug] Enrollment updated successfully');

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            enrollment: {
                _id: updatedEnrollment._id,
                courseName: updatedEnrollment.course.title,
                paymentStatus: updatedEnrollment.paymentStatus,
                enrollmentDate: updatedEnrollment.enrollmentDate
            }
        });

    } catch (error) {
        console.error('[Payment Error] Verify Payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
};

// @desc    Initiate refund for failed payment
// @route   POST /api/payments/refund
// @access  Public
const initiateRefund = async (req, res) => {
    try {
        const { razorpay_payment_id, amount, reason } = req.body;

        if (!razorpay_payment_id || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Missing refund details'
            });
        }

        // Create refund
        const refund = await razorpay.payments.refund(razorpay_payment_id, {
            amount: amount,
            notes: {
                reason: reason || 'Payment verification failed',
                timestamp: new Date().toISOString()
            }
        });

        // Update enrollment status to refunded
        await Enrollment.findOneAndUpdate(
            { razorpayPaymentId: razorpay_payment_id },
            { 
                paymentStatus: 'refunded',
                status: 'cancelled'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Refund initiated successfully',
            refundId: refund.id
        });

    } catch (error) {
        console.error('[Payment Error] Refund:', error);
        res.status(500).json({
            success: false,
            message: 'Error initiating refund',
            error: error.message
        });
    }
};

// @desc    Handle payment cancellation
// @route   POST /api/payments/cancel
// @access  Public
const handlePaymentCancellation = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing order ID'
            });
        }

        // Update enrollment status to cancelled
        await Enrollment.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { 
                paymentStatus: 'cancelled',
                status: 'cancelled'
            }
        );

        res.status(200).json({
            success: true,
            message: 'Payment cancelled successfully'
        });

    } catch (error) {
        console.error('[Payment Error] Cancellation:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling payment',
            error: error.message
        });
    }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:enrollmentId
// @access  Private
const getPaymentStatus = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const userId = req.user.id;

        const enrollment = await Enrollment.findById(enrollmentId)
            .populate('course', 'title');

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        // Verify ownership
        if (enrollment.student.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        res.status(200).json({
            success: true,
            enrollment
        });

    } catch (error) {
        console.error('[Payment Error] Get Status:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status',
            error: error.message
        });
    }
};

// @desc    Get enrollment by user and course
// @route   GET /api/payments/enrollment/:courseId
// @access  Private
const getEnrollment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const enrollment = await Enrollment.findOne({
            student: userId,
            course: courseId,
            paymentStatus: 'completed'
        }).populate('course', 'title price');

        res.status(200).json({
            success: true,
            isEnrolled: !!enrollment,
            enrollment: enrollment || null
        });

    } catch (error) {
        console.error('[Payment Error] Get Enrollment:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollment',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    initiateRefund,
    handlePaymentCancellation,
    getPaymentStatus,
    getEnrollment
};
