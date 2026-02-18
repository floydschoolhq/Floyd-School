const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// @route   POST /api/leads
// @desc    Create a new lead (Newsletter or Inquiry)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email, name, phone, type, source, experience, topic, institutionName, designation } = req.body;

        // Simple validation
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if lead already exists for this type (optional logic, maybe we want duplicates for new inquiries)
        // For now, let's just save every interaction or use upsert if needed. 
        // We'll treat every request as a new signal of interest.

        const newLead = new Lead({
            email,
            name,
            phone,
            type,
            source,
            experience,
            topic,
            institutionName,
            designation
        });

        const savedLead = await newLead.save();

        res.status(201).json({
            success: true,
            data: savedLead,
            message: 'Thank you! We will be in touch soon.'
        });

    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error. Please try again later.'
        });
    }
});

const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/leads
// @desc    Get all leads
// @access  Private (Admin, Mentor, Associate)
router.get('/', protect, authorize('admin', 'mentor', 'growth_associate'), async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   PATCH /api/leads/:id/status
// @desc    Update lead status
// @access  Private (Admin, Mentor, Associate)
router.patch('/:id/status', protect, authorize('admin', 'mentor', 'growth_associate'), async (req, res) => {
    try {
        const { status } = req.body;
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({ message: 'Lead not found' });
        }

        lead.status = status;
        await lead.save();

        res.json({ success: true, lead });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;

