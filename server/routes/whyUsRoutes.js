const express = require('express');
const router = express.Router();
const WhyUs = require('../models/WhyUs');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/why-us
// @desc    Get Why Us section data (returns the active one or latest)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const data = await WhyUs.findOne({ isActive: true }).sort({ createdAt: -1 });
        if (!data) {
            return res.status(404).json({ message: 'Why Us data not found' });
        }
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/why-us
// @desc    Create or Update Why Us data
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        // For simplicity in this project context, we'll just create a new one and set others to inactive, 
        // or just update if we decide to maintain a singleton structure.
        // Let's go with creating a new one for now to keep history if needed.

        // Deactivate previous
        await WhyUs.updateMany({}, { isActive: false });

        const newData = new WhyUs(req.body);
        const savedData = await newData.save();

        res.json(savedData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
