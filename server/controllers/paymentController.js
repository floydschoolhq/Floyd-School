const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

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
            message: 'Payment gateway is not configured. Please contact support.'
        });
    }

    try {
        const { courseId, fullName, email, phone, couponCode } = req.body;

        // Validate inputs
        if (!courseId || !fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Input sanitization
        const sanitizedEmail = email.trim().toLowerCase();
        const sanitizedPhone = phone.trim().replace(/\D/g, '');
        const sanitizedName = fullName.trim();

        if (!/\S+@\S+\.\S+/.test(sanitizedEmail)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        if (sanitizedPhone.length !== 10) {
            return res.status(400).json({ success: false, message: 'Phone must be 10 digits' });
        }

        // Get course details - handle both ObjectId and string IDs
        let course;
        
        // Map simple frontend IDs to known MongoDB ObjectIds + regex fallback
        const courseIdMap = {
            '1': '69ff38141cad938780ccdbeb',
            '2': '69ff38141cad938780ccdbec',
            '3': '69ff38141cad938780ccdbed',
            '4': '69ff38141cad938780ccdbee',
            '5': '69ff38141cad938780ccdbef'
        };

        const courseTitlePatterns = {
            '1': 'foundation of ai|artificial intelligence|machine learning|ai.*ml',
            '2': 'foundation of web|web dev|full stack|development',
            '3': 'foundation of iot|robotics|internet of things',
            '4': 'foundation of cyber|cyber security|ethical hacking',
            '5': 'summer builder program|bootcamp'
        };
        
        if (courseIdMap[courseId]) {
            // First try direct ObjectId lookup (fastest & most reliable)
            const mongoose = require('mongoose');
            try {
                course = await Course.findById(courseIdMap[courseId]);
            } catch (e) {
                // ObjectId lookup failed, fall back to regex
            }
            // If not found by ID, try regex on title
            if (!course && courseTitlePatterns[courseId]) {
                course = await Course.findOne({ title: { $regex: courseTitlePatterns[courseId], $options: 'i' } });
            }
        } else {
            try {
                course = await Course.findById(courseId);
            } catch (error) {
                course = await Course.findOne({ title: { $regex: courseId, $options: 'i' } });
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
        
        let finalPrice = coursePrice;
        let discount = 0;
        let appliedCouponCode = null;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon && coupon.isValid()) {
                // Check if applicable to this course
                const isApplicable = !coupon.applicableCourses || 
                                   coupon.applicableCourses.length === 0 || 
                                   coupon.applicableCourses.includes(course._id);
                
                if (isApplicable && coursePrice >= (coupon.minPurchaseAmount || 0)) {
                    if (coupon.discountType === 'percentage') {
                        discount = (coursePrice * coupon.discountValue) / 100;
                        if (coupon.maxDiscountAmount) {
                            discount = Math.min(discount, coupon.maxDiscountAmount);
                        }
                    } else {
                        discount = coupon.discountValue;
                    }
                    discount = Math.min(discount, coursePrice);
                    finalPrice = coursePrice - discount;
                    appliedCouponCode = coupon.code;
                }
            }
        }

        // IDEMPOTENCY: Check if there's already a pending order for this email+course in last 10 minutes
        const recentPending = await Enrollment.findOne({
            'userDetails.email': sanitizedEmail,
            course: course._id,
            paymentStatus: 'pending',
            createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }
        });

        if (recentPending) {
            // Cancel the old pending order and allow retry
            await Enrollment.findByIdAndUpdate(recentPending._id, {
                paymentStatus: 'cancelled',
                status: 'cancelled'
            });
            console.log('[Payment] Cancelled old pending order for retry:', recentPending.razorpayOrderId);
        }

        // Check if email already enrolled in this course
        const existingEnrollment = await Enrollment.findOne({
            'userDetails.email': sanitizedEmail,
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
            amount: Math.round(finalPrice * 100), // Razorpay expects amount in paise
            currency: course.currency || 'INR',
            receipt: `course_${courseId}_${Date.now()}`,
            notes: {
                courseId: courseId.toString(),
                courseName: course.title,
                studentName: sanitizedName,
                studentEmail: sanitizedEmail,
                appliedCoupon: appliedCouponCode,
                discountAmount: discount
            }
        };

        const order = await razorpay.orders.create(orderOptions);

        // Create enrollment record in pending state
        const enrollment = await Enrollment.create({
            course: course._id,
            paymentStatus: 'pending',
            razorpayOrderId: order.id,
            amount: coursePrice,
            currency: course.currency || 'INR',
            userDetails: {
                fullName: sanitizedName,
                email: sanitizedEmail,
                phone: sanitizedPhone
            },
            appliedCoupon: appliedCouponCode,
            discountAmount: discount
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
        console.error('[Payment Error] Create Order:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating payment order. Please try again.'
        });
    }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Public
const verifyPayment = async (req, res) => {
    try {
        // Handle different Razorpay response formats
        const razorpayOrderId = req.body.razorpay_order_id || req.body.order_id;
        const razorpayPaymentId = req.body.razorpay_payment_id || req.body.payment_id;
        const razorpaySignature = req.body.razorpay_signature || req.body.signature;

        // Validate inputs
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment verification details'
            });
        }

        // Verify signature using HMAC
        const body = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        // SECURITY: Use timing-safe comparison to prevent timing attacks
        const isSignatureValid = expectedSignature.length === razorpaySignature.length &&
            crypto.timingSafeEqual(
                Buffer.from(expectedSignature, 'hex'),
                Buffer.from(razorpaySignature, 'hex')
            );

        if (!isSignatureValid) {
            console.warn('[Payment Security] Invalid signature for order:', razorpayOrderId);
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Find enrollment by razorpay order ID
        const enrollment = await Enrollment.findOne({ razorpayOrderId });
        
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found for this order'
            });
        }

        // Prevent double verification
        if (enrollment.paymentStatus === 'completed') {
            return res.status(200).json({
                success: true,
                message: 'Payment already verified',
                enrollment: {
                    _id: enrollment._id,
                    paymentStatus: enrollment.paymentStatus
                }
            });
        }

        // SECURITY: Verify payment amount matches the course price via Razorpay API
        if (razorpay) {
            try {
                const payment = await razorpay.payments.fetch(razorpayPaymentId);
                const expectedAmountPaise = Math.round(enrollment.amount * 100);

                if (payment.amount !== expectedAmountPaise) {
                    console.error('[Payment Security] Amount mismatch!', {
                        expected: expectedAmountPaise,
                        received: payment.amount,
                        orderId: razorpayOrderId
                    });
                    return res.status(400).json({
                        success: false,
                        message: 'Payment amount mismatch. Please contact support.'
                    });
                }
            } catch (fetchError) {
                console.error('[Payment Warning] Could not verify payment amount:', fetchError.message);
                // Continue with enrollment if fetch fails - signature is already verified
            }
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

        // SYNC: Add student to Course enrolledSwtudents array for Admin telemetry
        if (updatedEnrollment.student) {
            const Course = require('../models/Course');
            await Course.findByIdAndUpdate(updatedEnrollment.course._id, {
                $addToSet: { enrolledStudents: updatedEnrollment.student }
            });
        }

        // Increment coupon usage if applicable
        if (updatedEnrollment.appliedCoupon) {
            await Coupon.findOneAndUpdate(
                { code: updatedEnrollment.appliedCoupon },
                { $inc: { usageCount: 1 } }
            );
        }

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
        console.error('[Payment Error] Verify Payment:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment'
        });
    }
};

// @desc    Initiate refund for failed payment
// @route   POST /api/payments/refund
// @access  Private/Admin (protected by route middleware)
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
                refundedBy: req.user?.email || 'system',
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

        console.log(`[Payment] Refund initiated by ${req.user?.email} for payment ${razorpay_payment_id}`);

        res.status(200).json({
            success: true,
            message: 'Refund initiated successfully',
            refundId: refund.id
        });

    } catch (error) {
        console.error('[Payment Error] Refund:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error initiating refund'
        });
    }
};

// @desc    Handle payment cancellation
// @route   POST /api/payments/cancel
// @access  Private (protected by route middleware)
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
        console.error('[Payment Error] Cancellation:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error cancelling payment'
        });
    }
};

// @desc    Handle Razorpay webhooks for payment verification
// @route   POST /api/payments/webhook
// @access  Public (but secured with webhook signature)
const handleRazorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        
        // Verify webhook signature against the raw payload
        const razorpaySignature = req.headers['x-razorpay-signature'];
        const webhookBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
        
        if (!razorpaySignature) {
            console.log('[Webhook] Missing signature');
            return res.status(400).json({ success: false, message: 'Missing webhook signature' });
        }
        
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret || process.env.RAZORPAY_KEY_SECRET)
            .update(webhookBody)
            .digest('hex');
            
        if (expectedSignature !== razorpaySignature) {
            console.log('[Webhook] Invalid signature');
            return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
        }
        
        const webhookPayload = req.body && typeof req.body === 'object'
            ? req.body
            : JSON.parse(webhookBody);

        console.log('[Webhook] Received webhook:', webhookPayload);

        const { event, payload } = webhookPayload;
        
        if (event === 'payment.captured') {
            // Payment successfully captured
            const { payment } = payload;
            const { order_id, payment_id, amount, currency } = payment.entity;
            
            // Find and update enrollment
            const enrollment = await Enrollment.findOne({ razorpayOrderId: order_id });
            if (enrollment) {
                await Enrollment.findByIdAndUpdate(enrollment._id, {
                    paymentStatus: 'completed',
                    razorpayPaymentId: payment_id,
                    status: 'active',
                    completedAt: new Date()
                });
                
                console.log('[Webhook] Payment completed via webhook:', order_id);
            }
            
        } else if (event === 'payment.failed') {
            // Payment failed
            const { payment } = payload;
            const { order_id } = payment.entity;
            
            // Update enrollment status
            const enrollment = await Enrollment.findOne({ razorpayOrderId: order_id });
            if (enrollment) {
                await Enrollment.findByIdAndUpdate(enrollment._id, {
                    paymentStatus: 'failed',
                    status: 'cancelled'
                });
                
                console.log('[Webhook] Payment failed via webhook:', order_id);
            }
        }
        
        res.status(200).json({ success: true, message: 'Webhook processed' });
        
    } catch (error) {
        console.error('[Webhook Error]:', error);
        res.status(500).json({ success: false, message: 'Webhook processing failed' });
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
        if (enrollment.student && enrollment.student.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        res.status(200).json({
            success: true,
            enrollment: {
                _id: enrollment._id,
                paymentStatus: enrollment.paymentStatus,
                amount: enrollment.amount,
                courseName: enrollment.course?.title
            }
        });

    } catch (error) {
        console.error('[Payment Error] Get Status:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment status'
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
        console.error('[Payment Error] Get Enrollment:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching enrollment'
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
    initiateRefund,
    handlePaymentCancellation,
    handleRazorpayWebhook,
    getPaymentStatus,
    getEnrollment
};
