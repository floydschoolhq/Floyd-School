const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');

// @route   GET /api/mentors
// @desc    Get all active mentors
// @access  Public
router.get('/', async (req, res) => {
    try {
        const mentors = await Mentor.find({ isActive: true });
        res.json(mentors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/mentors
// @desc    Add a mentor (Seed/Admin)
// @access  Public (for now)
router.post('/', async (req, res) => {
    try {
        const mentor = await Mentor.create(req.body);
        res.status(201).json(mentor);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

module.exports = router;
