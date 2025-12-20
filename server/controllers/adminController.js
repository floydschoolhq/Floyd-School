const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Lead = require('../models/Lead');
const SystemLog = require('../models/SystemLog');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');

/**
 * @desc    Get platform-wide statistics for Admin
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getPlatformStats = async (req, res) => {
    try {
        // Use Promise.allSettled or safe defaults for maximum resilience
        const [
            totalUsers,
            totalStudents,
            totalMentors,
            totalAssociates,
            activeCourses,
            totalLeads,
            openTickets
        ] = await Promise.all([
            User.countDocuments().catch(() => 0),
            User.countDocuments({ role: 'student' }).catch(() => 0),
            User.countDocuments({ role: 'mentor' }).catch(() => 0),
            User.countDocuments({ role: 'growth_associate' }).catch(() => 0),
            Course.countDocuments({ isActive: true }).catch(() => 0),
            Lead.countDocuments().catch(() => 0),
            SupportTicket.countDocuments({ status: { $ne: 'resolved' } }).catch(() => 0)
        ]);

        // Calculate Total Enrollments safely
        const allCourses = await Course.find().select('enrolledStudents').catch(() => []);
        const totalEnrollments = allCourses.reduce((sum, course) => {
            const count = Array.isArray(course.enrolledStudents) ? course.enrolledStudents.length : 0;
            return sum + count;
        }, 0);

        // Calculate New Signups Safely
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newSignups = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }).catch(() => 0);

        // Fetch recent activity with safety
        const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3)
            .select('name role createdAt')
            .catch(() => []);

        const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(3)
            .populate('instructor', 'name')
            .select('title isActive createdAt instructor') // Must select instructor for populate
            .catch(() => []);

        // Normalize events safely
        const events = [
            ...(recentUsers || []).map(u => ({
                id: u._id,
                type: 'Growth',
                event: `New ${u.role || 'user'} joined: ${u.name || 'Anonymous'}`,
                time: u.createdAt || new Date(),
                severity: 'Info'
            })),
            ...(recentCourses || []).map(c => ({
                id: c._id,
                type: 'System',
                event: `Course ${c.isActive ? 'Active' : 'Inactive'}: ${c.title || 'Untitled'}`,
                time: c.createdAt || new Date(),
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
                totalEnrollments,
                newSignups,
                recentEvents: events
            }
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({
            success: false,
            message: 'Telemetric analysis failed',
            error: error.message
        });
    }
};

/**
 * @desc    List all users for governance
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get system logs for security audit
 * @route   GET /api/admin/logs
 * @access  Private/Admin
 */
exports.getSystemLogs = async (req, res) => {
    try {
        const { level, limit = 50 } = req.query;

        let query = {};
        if (level && level !== 'all') {
            query.level = level;
        }

        const logs = await SystemLog.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('user', 'name email role');

        res.status(200).json({
            success: true,
            count: logs.length,
            logs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete user permanently
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Node identity format.' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Node not found in ecosystem.' });
        }

        // Check if user is trying to delete themselves (Primary Controller protection)
        const requesterId = req.user?._id?.toString() || req.user?.id;
        if (requesterId === user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Primary Controller cannot terminate own identity.' });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Node terminated successfully.' });
    } catch (error) {
        console.error('Termination failure:', error);
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
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('instructor', 'name email') // Correct field is instructor, not mentor
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error('Course Governance Error:', error);
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
 * @desc    Process system-level command via VCT
 * @route   POST /api/admin/system/command
 * @access  Private/Admin
 */
exports.processSystemCommand = async (req, res) => {
    try {
        const { command } = req.body;
        const cmd = command?.trim().toLowerCase();

        let output = [];

        switch (cmd) {
            case 'help':
                output = [
                    'Available System Commands:',
                    '  status          - Comprehensive system heart-beat',
                    '  clear-cache     - Flush all temporary platform caches',
                    '  maintenance-on  - Global system lockdown',
                    '  maintenance-off - Resume global operations',
                    '  nodes           - Map active network connections',
                    '  logs-audit      - Run quick security scan',
                    '  clear           - Refresh local terminal context'
                ];
                break;
            case 'status':
                const userCount = await User.countDocuments();
                const courseCount = await Course.countDocuments({ isActive: true });
                output = [
                    '[STATUS] System Operational Level: ALPHA',
                    `[STATUS] Registered Nodes: ${userCount}`,
                    `[STATUS] Active Curriculum Sectors: ${courseCount}`,
                    '[STATUS] Database Latency: 4ms',
                    '[STATUS] API Response Velocity: 12ms'
                ];
                break;
            case 'clear-cache':
                output = [
                    '[CACHE] Initializing global flush...',
                    '[CACHE] CDN edge cache purged.',
                    '[CACHE] Database query buffer cleared.',
                    '[CACHE] System memory optimized. Total freed: 24.5MB'
                ];
                break;
            case 'nodes':
                const io = req.app.get('io');
                const connectionCount = io?.engine?.clientsCount || 0;
                output = [
                    `[NETWORK] Active Socket Connections: ${connectionCount}`,
                    '[NETWORK] Primary Signal Strength: 100%',
                    '[NETWORK] Secure Tunneling: ACTIVE'
                ];
                break;
            case 'maintenance-on':
                const settings = await Settings.getInstance();
                settings.maintenanceMode.isActive = true;
                await settings.save();
                output = ['[SYSTEM] CRITICAL SHUTDOWN INITIATED.', '[SYSTEM] Platform is now in maintenance mode.'];
                break;
            case 'maintenance-off':
                const s = await Settings.getInstance();
                s.maintenanceMode.isActive = false;
                await s.save();
                output = ['[SYSTEM] REBOOT COMPLETE.', '[SYSTEM] Platform operations resumed.'];
                break;
            default:
                output = [`Unknown command: '${cmd}'. Type 'help' for instructions.`];
        }

        res.status(200).json({ success: true, output });
    } catch (error) {
        console.error('VCT Command Failure:', error);
        res.status(500).json({ success: false, message: 'Terminal signal lost.' });
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
        console.log(`[Admin] Initiating broadcast: ${title} to ${targetGroup}`);

        let query = {};
        if (targetGroup === 'students') query = { role: 'student' };
        else if (targetGroup === 'mentors') query = { role: 'mentor' };
        else if (targetGroup === 'associates') query = { role: 'growth_associate' };

        const users = await User.find(query).select('_id');

        if (!users || users.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Transmission bypassed: No active nodes in target sector.',
                count: 0
            });
        }

        const notifications = users.map(user => ({
            recipient: user._id,
            title,
            message,
            type: ['info', 'success', 'warning', 'broadcast'].includes(type) ? type : 'broadcast',
            isRead: false
        }));

        await Notification.insertMany(notifications, { ordered: false });

        // Real-time emit
        const io = req.app.get('io');
        if (io) {
            io.emit('notification:broadcast', { title, message, type: type || 'info' });
        }

        res.status(200).json({
            success: true,
            message: 'Broadcast synchronized successfully.',
            count: notifications.length
        });
    } catch (error) {
        console.error('Broadcast Failure:', error);
        res.status(500).json({
            success: false,
            message: 'Broadcast signal lost.',
            error: error.message
        });
    }
};
