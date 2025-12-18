const express = require('express');
const router = express.Router();
const Masterclass = require('../models/Masterclass');

// @route   GET /api/masterclasses
// @desc    Get all upcoming masterclasses
// @access  Public
router.get('/', async (req, res) => {
    try {
        const classes = await Masterclass.find().sort({ date: 1 });
        res.json(classes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
