const Coupon = require('../models/Coupon');
const Course = require('../models/Course');

// @desc    Get all coupons (Admin only)
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().populate('applicableCourses', 'title');
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Create a new coupon (Admin only)
exports.createCoupon = async (req, res) => {
    try {
        const { 
            code, 
            discountType, 
            discountValue, 
            expiryDate, 
            usageLimit, 
            minPurchaseAmount,
            applicableCourses 
        } = req.body;

        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            expiryDate,
            usageLimit,
            minPurchaseAmount,
            applicableCourses: applicableCourses || []
        });

        res.status(201).json({ success: true, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Validate a coupon code
exports.validateCoupon = async (req, res) => {
    try {
        const { code, courseId, amount } = req.body;
        
        if (!code) {
            return res.status(400).json({ success: false, message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({ success: false, message: 'Coupon has expired or reached its usage limit' });
        }

        if (amount < coupon.minPurchaseAmount) {
            return res.status(400).json({ 
                success: false, 
                message: `Minimum purchase amount for this coupon is ₹${coupon.minPurchaseAmount}` 
            });
        }

        // Check if course is applicable (if specified)
        if (coupon.applicableCourses && coupon.applicableCourses.length > 0) {
            if (!courseId || !coupon.applicableCourses.includes(courseId)) {
                return res.status(400).json({ success: false, message: 'This coupon is not applicable to this course' });
            }
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (amount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
        } else {
            discount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed amount
        discount = Math.min(discount, amount);
        const finalAmount = amount - discount;

        res.json({
            success: true,
            discount,
            finalAmount,
            couponCode: coupon.code,
            message: 'Coupon applied successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete a coupon (Admin only)
exports.deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Toggle coupon status (Admin only)
exports.toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json({ success: true, message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`, coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
