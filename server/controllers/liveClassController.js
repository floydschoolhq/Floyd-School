const LiveClass = require('../models/LiveClass');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Start a live class
// @route   POST /api/live-classes/start
// @access  Private/Mentor
exports.startLiveClass = async (req, res) => {
    try {
        const { title, topic, platform, meetingLink, duration } = req.body;

        // Basic validation
        if (!title || !topic) {
            return res.status(400).json({ message: 'Please provide title and topic' });
        }

        // Check for already active class by this mentor
        const activeClass = await LiveClass.findOne({ mentor: req.user._id, status: 'active' });
        if (activeClass) {
            return res.status(400).json({ message: 'You already have an active live class.' });
        }

        let liveClassData = {
            title,
            topic,
            platform: platform || 'other',
            mentor: req.user._id,
            mentorName: req.user.name,
            status: 'active',
            duration: duration || 3600 // Default to 1 hour if not provided
        };

        if (platform !== 'premiere' && !meetingLink) {
            return res.status(400).json({ message: 'Meeting link is required for external platforms' });
        }
        liveClassData.meetingLink = meetingLink;

        const liveClass = await LiveClass.create(liveClassData);

        // Emit Socket.io event for real-time notification
        const io = req.app.get('io');
        if (io) {
            io.emit('liveClass:started', liveClass);
        }

        // Create notification for all students (optional: only enrolled students)
        const students = await User.find({ role: 'student' });
        // Use Promise.all for faster notification creation if student count is large
        // But keep it simple for now or use Notification.insertMany for true batching

        // Background notification task (non-blocking)
        (async () => {
            const notifications = students.map(student => ({
                recipient: student._id,
                type: 'live_class_started',
                title: 'Live Class Started!',
                message: `${req.user.name} has started a live class: ${title}`,
                relatedId: liveClass._id,
                relatedModel: 'LiveClass'
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        })().catch(err => console.error('Notification Error:', err));


        res.status(201).json(liveClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
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

        if (liveClass.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
        // Find if there's any active class
        const liveClass = await LiveClass.findOne({ status: 'active' }).sort({ startedAt: -1 });

        if (liveClass) {
            const now = new Date();
            const startedAt = new Date(liveClass.startedAt);
            const durationInMs = (liveClass.duration || 3600) * 1000;

            if (now > new Date(startedAt.getTime() + durationInMs)) {
                // Class has expired, move to ended
                liveClass.status = 'ended';
                liveClass.endedAt = new Date(startedAt.getTime() + durationInMs);
                await liveClass.save();

                // Emit socket event
                const io = req.app.get('io');
                if (io) {
                    io.emit('liveClass:ended', liveClass._id);
                }

                return res.json(null);
            }
        }

        res.json(liveClass);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get ended live classes for archive
// @route   GET /api/live-classes/recordings
// @access  Private
exports.getEndedLiveClasses = async (req, res) => {
    try {
        const liveClasses = await LiveClass.find({ status: 'ended' }).sort({ endedAt: -1 });
        res.json(liveClasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllActiveLiveClasses = async (req, res) => {
    try {
        const liveClasses = await LiveClass.find({ status: 'active' }).sort({ startedAt: -1 });
        res.json(liveClasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a live class
// @route   DELETE /api/live-classes/:id
// @access  Private (Mentor/Admin)
exports.deleteLiveClass = async (req, res) => {
    try {
        const liveClass = await LiveClass.findById(req.params.id);

        if (!liveClass) {
            return res.status(404).json({ message: 'Live class not found' });
        }

        // Check ownership (mentor can only delete their own, admin can delete any)
        if (liveClass.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this class' });
        }

        await liveClass.deleteOne();
        res.json({ message: 'Live class deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

