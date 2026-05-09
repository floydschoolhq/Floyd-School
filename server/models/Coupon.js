const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'fixed'
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minPurchaseAmount: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number, // Only relevant for percentage type
        default: null
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usageCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
    const now = new Date();
    if (!this.isActive) return false;
    if (this.expiryDate < now) return false;
    if (this.usageLimit !== null && this.usageCount >= this.usageLimit) return false;
    return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
