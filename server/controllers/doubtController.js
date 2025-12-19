const Doubt = require('../models/Doubt');

// Get all doubts for a live class
exports.getDoubtsByClass = async (req, res) => {
    try {
        const doubts = await Doubt.find({ liveClass: req.params.classId })
            .sort({ createdAt: -1 });
        res.json(doubts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new doubt (student only)
exports.createDoubt = async (req, res) => {
    try {
        const { liveClassId, question } = req.body;
        const doubt = await Doubt.create({
            student: req.user._id,
            studentName: req.user.name,
            liveClass: liveClassId,
            question
        });

        // Emit Socket.io event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.emit('doubt:new', doubt);
        }

        res.status(201).json(doubt);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Resolve a doubt (mentor only)
exports.resolveDoubt = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        doubt.isResolved = true;
        doubt.resolvedBy = req.user._id;
        await doubt.save();

        // Emit Socket.io event
        const io = req.app.get('io');
        if (io) {
            io.emit('doubt:resolved', doubt);
        }

        res.json(doubt);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get current student's doubt for a class
exports.getMyDoubt = async (req, res) => {
    try {
        const doubt = await Doubt.findOne({
            liveClass: req.params.classId,
            student: req.user._id
        }).sort({ createdAt: -1 });

        if (!doubt) {
            return res.status(404).json({ message: 'No doubt found' });
        }
        res.json(doubt);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a doubt (terminate)
exports.deleteDoubt = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        // Allow student (owner) or mentor/admin to delete
        if (doubt.student.toString() !== req.user._id.toString() && req.user.role !== 'mentor' && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await doubt.deleteOne();

        // Emit Socket.io event
        const io = req.app.get('io');
        if (io) {
            io.emit('doubt:deleted', req.params.id);
        }

        res.json({ message: 'Doubt terminated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
