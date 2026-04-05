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

        // Get course details
        const course = await Course.findById(courseId);
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
            course: courseId,
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
            course: courseId,
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
// @route   POST /api/payments/verify-payment
// @access  Public
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            enrollmentId
        } = req.body;

        // Validate inputs
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !enrollmentId) {
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

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Update enrollment record
        const enrollment = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            {
                paymentStatus: 'completed',
                razorpayPaymentId,
                razorpaySignature,
                status: 'active'
            },
            { new: true }
        ).populate('course', 'title');

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        // If user is authenticated, link enrollment to their account
        if (req.user && req.user.id) {
            // Update enrollment with student ID
            enrollment.student = req.user.id;
            await enrollment.save();

            // Add student to course's enrolledStudents
            const course = await Course.findById(enrollment.course._id);
            if (course && !course.enrolledStudents.includes(req.user.id)) {
                course.enrolledStudents.push(req.user.id);
                await course.save();
            }

            // Update user profile to include course enrollment
            await User.findByIdAndUpdate(
                req.user.id,
                { $addToSet: { enrolledCourses: enrollment.course._id } },
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            enrollment: {
                _id: enrollment._id,
                courseName: enrollment.course.title,
                paymentStatus: enrollment.paymentStatus,
                enrollmentDate: enrollment.enrollmentDate
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
    getPaymentStatus,
    getEnrollment
};
