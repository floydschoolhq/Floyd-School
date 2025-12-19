const User = require('../models/User');
const Course = require('../models/Course');
const Lead = require('../models/Lead');
const SupportTicket = require('../models/SupportTicket');

/**
 * @desc    Get platform-wide statistics for Admin
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getPlatformStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalMentors = await User.countDocuments({ role: 'mentor' });
        const totalAssociates = await User.countDocuments({ role: 'growth_associate' });

        const activeCourses = await Course.countDocuments({ status: 'published' });
        const totalLeads = await Lead.countDocuments();

        const openTickets = await SupportTicket.countDocuments({ status: { $ne: 'resolved' } });

        // Fetch recent activity
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3).select('name role createdAt');
        const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(3).populate('mentor', 'name').select('title status createdAt');

        // Normalize events
        const events = [
            ...recentUsers.map(u => ({
                id: u._id,
                type: 'Growth',
                event: `New ${u.role} joined: ${u.name}`,
                time: u.createdAt,
                severity: 'Info'
            })),
            ...recentCourses.map(c => ({
                id: c._id,
                type: 'System',
                event: `Course ${c.status}: ${c.title}`,
                time: c.createdAt,
                severity: 'Low'
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalStudents,
                totalMentors,
                totalAssociates,
                activeCourses,
                totalLeads,
                openTickets,
                revenue: 124500, // Keep mock for now
                recentEvents: events
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    List all users for governance
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.listUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update user status (activate/deactivate)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private/Admin
 */
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (isActive !== undefined) user.isActive = isActive;
        if (role) user.role = role;

        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Create a new user (admin only)
 * @route   POST /api/admin/users
 * @access  Private/Admin
 */
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student'
        });

        // ... previous code
        if (user) {
            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all courses for governance
 * @route   GET /api/admin/courses
 * @access  Private/Admin
 */
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('mentor', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update course status (Approve/Reject)
 * @route   PATCH /api/admin/courses/:id/status
 * @access  Private/Admin
 */
exports.updateCourseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'published', 'draft', 'rejected'

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        course.status = status;
        await course.save();

        res.status(200).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all leads for intelligence
 * @route   GET /api/admin/leads
 * @access  Private/Admin
 */
exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, leads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Broadcast notification
 * @route   POST /api/admin/broadcast
 * @access  Private/Admin
 */
exports.broadcastNotification = async (req, res) => {
    try {
        const { title, message, type, targetGroup } = req.body;
        // targetGroup: 'all', 'students', 'mentors'

        let query = {};
        if (targetGroup === 'students') query = { role: 'student' };
        if (targetGroup === 'mentors') query = { role: 'mentor' };

        const users = await User.find(query).select('_id');

        const notifications = users.map(user => ({
            recipient: user._id,
            title,
            message,
            type: type || 'info', // info, warning, success, alert
            read: false
        }));

        const Notification = require('../models/Notification');
        await Notification.insertMany(notifications);

        // Real-time emit
        const io = req.app.get('io');
        if (targetGroup === 'all') {
            io.emit('notification:broadcast', { title, message, type });
        } else {
            // For specific groups, we might need room logic or just simple iteration if robust rooms aren't set
            // For now, simpler broadcast to all connected clients who can filter client-side or use existing room logic if implemented.
            // Assuming we want simple broadcast:
            io.emit('notification:broadcast', { title, message, type, targetGroup });
        }

        res.status(200).json({ success: true, count: notifications.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
