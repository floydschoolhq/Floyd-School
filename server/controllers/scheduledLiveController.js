const ScheduledLive = require('../models/ScheduledLive');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.createScheduledLive = async (req, res) => {
    try {
        const { title, description, videoUrl, scheduledStart, scheduledEnd, maxParticipants, course, module, classNumber } = req.body;

        if (!title || !videoUrl || !scheduledStart || !course) {
            return res.status(400).json({ message: 'Title, video URL, scheduled start time, and course are required' });
        }

        const scheduledLive = await ScheduledLive.create({
            title,
            description: description || '',
            mentor: req.user._id,
            mentorName: req.user.name,
            course,
            module: module || null,
            classNumber: Number(classNumber) || 1,
            videoUrl,
            status: 'scheduled',
            scheduledStart: new Date(scheduledStart),
            scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
            maxParticipants: maxParticipants || 500
        });

        const populatedScheduledLive = await ScheduledLive.findById(scheduledLive._id)
            .populate('course', 'title');

        res.status(201).json({
            success: true,
            data: populatedScheduledLive
        });
    } catch (error) {
        console.error('[CreateScheduledLive] Error:', error);
        res.status(500).json({ message: error.message || 'Failed to create scheduled live' });
    }
};

exports.getAllScheduledLives = async (req, res) => {
    try {
        const { status, courseId } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }
        if (courseId) {
            query.course = courseId;
        }

        const scheduledLives = await ScheduledLive.find(query)
            .sort({ scheduledStart: 1 })
            .populate('mentor', 'name email')
            .populate('course', 'title');

        res.json(scheduledLives);
    } catch (error) {
        console.error('[GetAllScheduledLives] Error:', error);
        res.status(500).json({ message: 'Failed to fetch scheduled lives' });
    }
};

exports.getUpcomingScheduledLives = async (req, res) => {
    try {
        const now = new Date();
        let query = {
            $or: [
                { status: 'scheduled', scheduledStart: { $gte: now } },
                { status: 'live' }
            ]
        };

        if (req.query.courseId) {
            query.course = req.query.courseId;
        } else if (req.user && req.user.role === 'student') {
            const User = require('../models/User');
            const studentUser = await User.findById(req.user._id).select('permissions.grantedCourses');
            const grantedIds = studentUser?.permissions?.grantedCourses || [];

            const Course = require('../models/Course');
            const enrolledCourses = await Course.find({ enrolledStudents: req.user._id }).select('_id');
            const enrolledIds = enrolledCourses.map(c => c._id);

            const courseIds = [...new Set([...grantedIds.map(id => id.toString()), ...enrolledIds.map(id => id.toString())])];
            query.course = { $in: courseIds };
        }

        const scheduledLives = await ScheduledLive.find(query)
            .sort({ scheduledStart: 1 })
            .limit(20)
            .populate('mentor', 'name')
            .populate('course', 'title');

        res.json(scheduledLives);
    } catch (error) {
        console.error('[GetUpcomingScheduledLives] Error:', error);
        res.status(500).json({ message: 'Failed to fetch upcoming lives' });
    }
};

exports.getScheduledLiveById = async (req, res) => {
    try {
        const scheduledLive = await ScheduledLive.findById(req.params.id)
            .populate('mentor', 'name email');

        if (!scheduledLive) {
            return res.status(404).json({ message: 'Scheduled live not found' });
        }

        res.json(scheduledLive);
    } catch (error) {
        console.error('[GetScheduledLiveById] Error:', error);
        res.status(500).json({ message: 'Failed to fetch scheduled live' });
    }
};

exports.updateScheduledLive = async (req, res) => {
    try {
        const { title, description, scheduledStart, scheduledEnd, maxParticipants, status } = req.body;

        const scheduledLive = await ScheduledLive.findById(req.params.id);

        if (!scheduledLive) {
            return res.status(404).json({ message: 'Scheduled live not found' });
        }

        if (scheduledLive.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this scheduled live' });
        }

        if (title) scheduledLive.title = title;
        if (description !== undefined) scheduledLive.description = description;
        if (scheduledStart) scheduledLive.scheduledStart = new Date(scheduledStart);
        if (scheduledEnd) scheduledLive.scheduledEnd = new Date(scheduledEnd);
        if (maxParticipants) scheduledLive.maxParticipants = maxParticipants;
        if (status) scheduledLive.status = status;

        await scheduledLive.save();

        res.json({
            success: true,
            data: scheduledLive
        });
    } catch (error) {
        console.error('[UpdateScheduledLive] Error:', error);
        res.status(500).json({ message: 'Failed to update scheduled live' });
    }
};

exports.deleteScheduledLive = async (req, res) => {
    try {
        const scheduledLive = await ScheduledLive.findById(req.params.id);

        if (!scheduledLive) {
            return res.status(404).json({ message: 'Scheduled live not found' });
        }

        if (scheduledLive.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this scheduled live' });
        }

        await ScheduledLive.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Scheduled live deleted successfully' });
    } catch (error) {
        console.error('[DeleteScheduledLive] Error:', error);
        res.status(500).json({ message: error.message || 'Failed to delete scheduled live' });
    }
};

exports.startLiveNow = async (req, res) => {
    try {
        const scheduledLive = await ScheduledLive.findById(req.params.id);

        if (!scheduledLive) {
            return res.status(404).json({ message: 'Scheduled live not found' });
        }

        if (scheduledLive.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if there is already an active live session for this course
        const activeLiveForCourse = await ScheduledLive.findOne({
            course: scheduledLive.course,
            status: 'live',
            _id: { $ne: scheduledLive._id }
        });

        if (activeLiveForCourse) {
            return res.status(400).json({ 
                message: `There is already an active live session ("${activeLiveForCourse.title}") running for this course. Please end it before starting a new one.` 
            });
        }

        scheduledLive.status = 'live';
        scheduledLive.actualStart = new Date();
        await scheduledLive.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('scheduledLive:started', scheduledLive);

            const Course = require('../models/Course');
            const course = await Course.findById(scheduledLive.course);

            let students = [];
            if (course) {
                students = await User.find({ role: 'student', _id: { $in: course.enrolledStudents } });
            } else {
                students = await User.find({ role: 'student' });
            }

            const notifications = students.map(student => ({
                recipient: student._id,
                type: 'scheduled_live_started',
                title: 'Live Session Started!',
                message: `${scheduledLive.title} is now live`,
                relatedId: scheduledLive._id,
                relatedModel: 'ScheduledLive'
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications).catch(err => console.error('Notification Error:', err));
            }
        }

        res.json({
            success: true,
            data: scheduledLive
        });
    } catch (error) {
        console.error('[StartLiveNow] Error:', error);
        res.status(500).json({ message: 'Failed to start live' });
    }
};

exports.endLive = async (req, res) => {
    try {
        const scheduledLive = await ScheduledLive.findById(req.params.id);

        if (!scheduledLive) {
            return res.status(404).json({ message: 'Scheduled live not found' });
        }

        if (scheduledLive.mentor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        scheduledLive.status = 'ended';
        scheduledLive.actualEnd = new Date();
        await scheduledLive.save();

        // Sync ending live with the module's video URL
        if (scheduledLive.module) {
            const Course = require('../models/Course');
            const course = await Course.findById(scheduledLive.course);
            if (course) {
                const moduleIndex = course.modules.findIndex(m => m._id.toString() === scheduledLive.module.toString());
                if (moduleIndex !== -1) {
                    course.modules[moduleIndex].videoUrl = scheduledLive.videoUrl;
                    await course.save();
                }
            }
        }

        const io = req.app.get('io');
        if (io) {
            io.emit('scheduledLive:ended', scheduledLive._id);
        }

        res.json({ success: true, message: 'Live session ended' });
    } catch (error) {
        console.error('[EndLive] Error:', error);
        res.status(500).json({ message: 'Failed to end live' });
    }
};

exports.checkAndUpdateStatus = async () => {
    try {
        const now = new Date();

        const toStart = await ScheduledLive.find({
            status: 'scheduled',
            scheduledStart: { $lte: now }
        });

        for (const live of toStart) {
            live.status = 'live';
            live.actualStart = now;
            await live.save();

            console.log(`[ScheduledLive] Auto-started: ${live.title}`);
        }

        const toEnd = await ScheduledLive.find({
            status: 'live',
            scheduledEnd: { $lte: now }
        });

        for (const live of toEnd) {
            live.status = 'ended';
            live.actualEnd = now;
            await live.save();

            console.log(`[ScheduledLive] Auto-ended: ${live.title}`);
        }
    } catch (error) {
        console.error('[CheckAndUpdateStatus] Error:', error);
    }
};
