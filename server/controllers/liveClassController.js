const LiveClass = require('../models/LiveClass');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Start a live class
// @route   POST /api/live-classes/start
// @access  Private/Mentor
exports.startLiveClass = async (req, res) => {
    try {
        const { title, topic, meetingLink } = req.body;

        // Basic validation
        if (!title || !topic || !meetingLink) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Check for already active class by this mentor
        const activeClass = await LiveClass.findOne({ mentor: req.user._id, status: 'active' });
        if (activeClass) {
            return res.status(400).json({ message: 'You already have an active live class.' });
        }

        const liveClass = await LiveClass.create({
            title,
            topic,
            meetingLink,
            mentor: req.user._id,
            mentorName: req.user.name,
            status: 'active'
        });

        // Emit Socket.io event for real-time notification
        const io = req.app.get('io');
        if (io) {
            io.emit('liveClass:started', liveClass);
        }

        // Create notification for all students (optional: only enrolled students)
        const students = await User.find({ role: 'student' });
        for (const student of students) {
            await Notification.createAndEmit({
                recipient: student._id,
                type: 'live_class_started',
                title: 'Live Class Started!',
                message: `${req.user.name} has started a live class: ${title} `,
                relatedId: liveClass._id,
                relatedModel: null
            }, io);
        }

        res.status(201).json(liveClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    End a live class
// @route   PUT /api/live-classes/:id/end
// @access  Private/Mentor
exports.endLiveClass = async (req, res) => {
    try {
        const liveClass = await LiveClass.findById(req.params.id);

        if (!liveClass) {
            return res.status(404).json({ message: 'Live class not found' });
        }

        if (liveClass.mentor.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        liveClass.status = 'ended';
        liveClass.endedAt = Date.now();
        await liveClass.save();

        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.emit('liveClass:ended', liveClass._id);
        }

        res.json({ message: 'Live class ended' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get active live class
// @route   GET /api/live-classes/active
// @access  Private
exports.getActiveLiveClass = async (req, res) => {
    try {
        // Find if there's any active class (simplification: showing the latest active one)
        const liveClass = await LiveClass.findOne({ status: 'active' }).sort({ startedAt: -1 });
        res.json(liveClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
