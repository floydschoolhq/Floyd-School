const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    razorpayOrderId: {
        type: String,
        sparse: true
    },
    razorpayPaymentId: {
        type: String,
        sparse: true
    },
    razorpaySignature: {
        type: String,
        sparse: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    userDetails: {
        fullName: String,
        email: String,
        phone: String
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    completionDate: Date,
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Compound unique index to prevent duplicate enrollments
enrollmentSchema.index({ student: 1, course: 1 }, { unique: false });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
