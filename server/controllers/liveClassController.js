const LiveClass = require('../models/LiveClass');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Start a live class
// @route   POST /api/live-classes/start
// @access  Private/Mentor
exports.startLiveClass = async (req, res) => {
    try {
        const { title, topic, platform, meetingLink, duration, courseId, moduleId } = req.body;

        // Basic validation
        if (!title || !topic) {
            return res.status(400).json({ message: 'Please provide title and topic' });
        }
        if (!courseId) {
            return res.status(400).json({ message: 'Please provide a course ID' });
        }

        const Course = require('../models/Course');
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check for already active class for this course
        const activeClass = await LiveClass.findOne({ course: courseId, status: 'active' });
        if (activeClass) {
            return res.status(400).json({ message: 'This course already has an active live class.' });
        }

        let liveClassData = {
            title,
            topic,
            platform: platform || 'other',
            mentor: req.user._id,
            mentorName: req.user.name,
            course: courseId,
            module: moduleId || undefined,
            status: 'active',
            duration: duration || 3600 // Default to 1 hour if not provided
        };

        if (platform !== 'premiere' && !meetingLink) {
            return res.status(400).json({ message: 'Meeting link is required for external platforms' });
        }
        liveClassData.meetingLink = meetingLink;

        const liveClass = await LiveClass.create(liveClassData);
        // Populate course info for real-time socket events
        const populatedLiveClass = await LiveClass.findById(liveClass._id).populate('course', 'title');

        // Emit Socket.io event for real-time notification
        const io = req.app.get('io');
        if (io) {
            io.emit('liveClass:started', populatedLiveClass);
        }

        // Create notification only for enrolled students
        const students = await User.find({ role: 'student', _id: { $in: course.enrolledStudents } });

        // Background notification task (non-blocking)
        (async () => {
            const notifications = students.map(student => ({
                recipient: student._id,
                type: 'live_class_started',
                title: 'Live Class Started!',
                message: `${req.user.name} has started a live class for ${course.title}: ${title}`,
                relatedId: liveClass._id,
                relatedModel: 'LiveClass'
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        })().catch(err => console.error('Notification Error:', err));

        res.status(201).json(populatedLiveClass);
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
        let query = { status: 'active' };

        if (req.query.courseId) {
            query.course = req.query.courseId;
        } else if (req.user && req.user.role === 'student') {
            const Course = require('../models/Course');
            const enrolledCourses = await Course.find({ enrolledStudents: req.user._id }).select('_id');
            const courseIds = enrolledCourses.map(c => c._id);
            query.course = { $in: courseIds };
        }

        // Find if there's any active class
        const liveClass = await LiveClass.findOne(query)
            .sort({ startedAt: -1 })
            .populate('course', 'title');

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
        let query = { status: 'ended' };

        if (req.query.courseId) {
            query.course = req.query.courseId;
        } else if (req.user && req.user.role === 'student') {
            const Course = require('../models/Course');
            const enrolledCourses = await Course.find({ enrolledStudents: req.user._id }).select('_id');
            const courseIds = enrolledCourses.map(c => c._id);
            query.course = { $in: courseIds };
        }

        const liveClasses = await LiveClass.find(query)
            .sort({ endedAt: -1 })
            .populate('course', 'title');
        res.json(liveClasses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllActiveLiveClasses = async (req, res) => {
    try {
        const liveClasses = await LiveClass.find({ status: 'active' })
            .sort({ startedAt: -1 })
            .populate('course', 'title');
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

        // Both Mentors and Admins have permission to delete live classes.
        // We've authorized ('mentor', 'admin') at the route level, so if we are here,
        // the user has one of these roles.

        await liveClass.deleteOne();
        res.json({ message: 'Live class deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

