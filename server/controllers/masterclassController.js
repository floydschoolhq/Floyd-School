const Masterclass = require('../models/Masterclass');
const User = require('../models/User');

// @desc    Get all masterclasses
// @route   GET /api/masterclasses
// @access  Public
exports.getAllMasterclasses = async (req, res) => {
    try {
        const { status, category, upcoming } = req.query;

        let query = { isActive: true };

        if (status) query.status = status;
        if (category) query.category = category;
        if (upcoming === 'true') {
            query.scheduledDate = { $gte: new Date() };
            query.status = 'scheduled';
        }

        const masterclasses = await Masterclass.find(query)
            .populate('instructor', 'name email')
            .sort({ scheduledDate: 1 });

        res.json(masterclasses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch masterclasses', error: error.message });
    }
};

// @desc    Get single masterclass
// @route   GET /api/masterclasses/:id
// @access  Public
exports.getMasterclass = async (req, res) => {
    try {
        const masterclass = await Masterclass.findById(req.params.id)
            .populate('instructor', 'name email role')
            .populate('registeredStudents', 'name email');

        if (!masterclass) {
            return res.status(404).json({ message: 'Masterclass not found' });
        }

        res.json(masterclass);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch masterclass', error: error.message });
    }
};

// @desc    Create new masterclass
// @route   POST /api/masterclasses
// @access  Private (Mentor/Admin)
exports.createMasterclass = async (req, res) => {
    try {
        const {
            title,
            description,
            scheduledDate,
            startTime,
            endTime,
            duration,
            meetingLink,
            tags,
            category,
            maxAttendees,
            isFree
        } = req.body;

        // Get instructor details
        const instructor = await User.findById(req.user.id);

        const masterclass = await Masterclass.create({
            title,
            description,
            instructor: req.user.id,
            instructorName: instructor.name,
            instructorRole: instructor.role || 'Expert Mentor',
            instructorImage: instructor.profileImage || `https://i.pravatar.cc/150?u=${instructor.email}`,
            scheduledDate,
            startTime,
            endTime,
            duration,
            meetingLink,
            tags: tags || [],
            category: category || 'Other',
            maxAttendees: maxAttendees || 500,
            isFree: isFree !== undefined ? isFree : true
        });

        res.status(201).json({
            message: 'Masterclass created successfully',
            masterclass
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create masterclass', error: error.message });
    }
};

// @desc    Update masterclass
// @route   PUT /api/masterclasses/:id
// @access  Private (Mentor/Admin)
exports.updateMasterclass = async (req, res) => {
    try {
        const masterclass = await Masterclass.findById(req.params.id);

        if (!masterclass) {
            return res.status(404).json({ message: 'Masterclass not found' });
        }

        // Check ownership (mentor can only edit their own, admin can edit any)
        if (req.user.role !== 'admin' && masterclass.instructor.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this masterclass' });
        }

        const updatedMasterclass = await Masterclass.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Masterclass updated successfully',
            masterclass: updatedMasterclass
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update masterclass', error: error.message });
    }
};

// @desc    Delete masterclass
// @route   DELETE /api/masterclasses/:id
// @access  Private (Admin only)
exports.deleteMasterclass = async (req, res) => {
    try {
        const masterclass = await Masterclass.findById(req.params.id);

        if (!masterclass) {
            return res.status(404).json({ message: 'Masterclass not found' });
        }

        await masterclass.deleteOne();

        res.json({ message: 'Masterclass deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete masterclass', error: error.message });
    }
};

// @desc    Register student for masterclass
// @route   POST /api/masterclasses/:id/register
// @access  Private (Student)
exports.registerStudent = async (req, res) => {
    try {
        const masterclass = await Masterclass.findById(req.params.id);

        if (!masterclass) {
            return res.status(404).json({ message: 'Masterclass not found' });
        }

        if (masterclass.status !== 'scheduled') {
            return res.status(400).json({ message: 'Cannot register for this masterclass' });
        }

        await masterclass.registerStudent(req.user.id);

        res.json({
            message: 'Successfully registered for masterclass',
            masterclass
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unregister student from masterclass
// @route   POST /api/masterclasses/:id/unregister
// @access  Private (Student)
exports.unregisterStudent = async (req, res) => {
    try {
        const masterclass = await Masterclass.findById(req.params.id);

        if (!masterclass) {
            return res.status(404).json({ message: 'Masterclass not found' });
        }

        await masterclass.unregisterStudent(req.user.id);

        res.json({
            message: 'Successfully unregistered from masterclass',
            masterclass
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get registered attendees
// @route   GET /api/masterclasses/:id/attendees
// @access  Private (Mentor/Admin)
exports.getAttendees = async (req, res) => {
    try {
        const masterclass = await Masterclass.findById(req.params.id)
            .populate('registeredStudents', 'name email createdAt');

        if (!masterclass) {
            return res.status(404).json({ message: 'Masterclass not found' });
        }

        res.json({
            count: masterclass.attendeeCount,
            attendees: masterclass.registeredStudents
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch attendees', error: error.message });
    }
};

// @desc    Update masterclass status
// @route   PATCH /api/masterclasses/:id/status
// @access  Private (Mentor/Admin)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['scheduled', 'live', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const masterclass = await Masterclass.findById(req.params.id);

        if (!masterclass) {
            return res.status(404).json({ message: 'Masterclass not found' });
        }

        masterclass.status = status;
        await masterclass.save();

        res.json({
            message: `Masterclass status updated to ${status}`,
            masterclass
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update status', error: error.message });
    }
};
