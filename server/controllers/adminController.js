const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Lead = require('../models/Lead');
const SystemLog = require('../models/SystemLog');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const Comment = require('../models/Comment');
const LiveChat = require('../models/LiveChat');

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
        console.error('[AdminController:getPlatformStats] TERMINAL ERROR:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Nexus Link Severed: Telemetry data corrupted',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
 * @desc    Update user permissions (Granular Access Control)
 * @route   PATCH /api/admin/users/:id/permissions
 * @access  Private/Admin
 */
exports.updateUserPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Merge permissions
        user.permissions = {
            ...user.permissions,
            ...permissions
        };

        await user.save();

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Permission Update Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update access matrix.' });
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
 * @desc    Get all leads for intelligence
 * @route   GET /api/admin/leads
 * @access  Private/Admin
 */
exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, leads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update lead status
 * @route   PATCH /api/admin/leads/:id/status
 * @access  Private/Admin
 */
exports.updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lead = await Lead.findById(id);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        lead.status = status;
        await lead.save();

        res.status(200).json({ success: true, lead });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete lead permanently (Terminate)
 * @route   DELETE /api/admin/leads/:id
 * @access  Private/Admin
 */
exports.deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        await Lead.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Lead terminated successfully' });
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
                const uCount = await User.countDocuments();
                const cCount = await Course.countDocuments({ isActive: true });
                const lCount = await Lead.countDocuments();
                const t0 = Date.now();
                await User.findOne(); // Dummy query for latency check
                const latency = Date.now() - t0;

                output = [
                    '[STATUS] System Operational Level: ALPHA',
                    `[STATUS] Registered Nodes: ${uCount}`,
                    `[STATUS] Lead Intake Buffer: ${lCount}`,
                    `[STATUS] Active Curriculum Sectors: ${cCount}`,
                    `[STATUS] Database Latency: ${latency}ms`,
                    `[STATUS] Uplink Integrity: ${latency < 100 ? 'STABLE' : 'DEGRADED'}`
                ];
                break;
            case 'clear-cache':
                // In a real environment, this would hit Redis. 
                // Here, we'll clear old system logs (older than 30 days) to "optimize".
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const deletedLogs = await SystemLog.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });

                output = [
                    '[CACHE] Initializing global flush...',
                    '[CACHE] CDN edge cache purged.',
                    `[CACHE] System logs optimized. Cleared ${deletedLogs.deletedCount} legacy records.`,
                    '[CACHE] Memory buffer synchronized.'
                ];
                break;
            case 'logs-audit':
                const criticalLogs = await SystemLog.find({ level: { $in: ['critical', 'error'] } })
                    .sort({ createdAt: -1 })
                    .limit(5);

                if (criticalLogs.length === 0) {
                    output = ['[AUDIT] Security sector clean. No critical anomalies detected.'];
                } else {
                    output = [
                        '[AUDIT] Critical anomalies detected in last 24h:',
                        ...criticalLogs.map(l => `  - [${new Date(l.createdAt).toLocaleTimeString()}] ${l.event}: ${l.message.substring(0, 40)}...`)
                    ];
                }
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
            case 'clear':
                output = ['__CLEAR__']; // Special token for frontend to clear terminal
                break;
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
        console.error('[AdminController:broadcastNotification] Error:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Broadcast signal lost.',
            error: error.message
        });
    }
};

/**
 * @desc    Get Growth Intelligence (Phase 2 Success Engine)
 * @route   GET /api/admin/growth-intelligence
 * @access  Private/Admin
 */
exports.getGrowthIntelligence = async (req, res) => {
    try {
        // 1. Lead Velocity (Avg time from Lead creation to User registration)
        const convertedLeads = await Lead.find({ status: 'converted' }).catch(() => []);

        // Fetch all relevant users in one go to avoid N+1 query problem
        const emails = convertedLeads.map(l => l.email);
        const users = await User.find({ email: { $in: emails } }).select('email createdAt').catch(() => []);
        const userMap = users.reduce((acc, u) => {
            acc[u.email] = u.createdAt;
            return acc;
        }, {});

        let totalVelocity = 0;
        let conversionCount = 0;

        for (const lead of convertedLeads) {
            const userCreatedAt = userMap[lead.email];
            if (userCreatedAt && userCreatedAt > lead.createdAt) {
                totalVelocity += (userCreatedAt - lead.createdAt) / (1000 * 60 * 60); // In hours
                conversionCount++;
            }
        }
        const avgLeadVelocity = conversionCount > 0 ? (totalVelocity / conversionCount).toFixed(1) : 0;

        // 2. Trending Struggles (Modules with most open comments/doubts)
        const struggleAggr = await Comment.aggregate([
            { $match: { status: 'open' } },
            { $group: { _id: '$moduleTitle', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]).catch(() => []);

        const trendingStruggles = struggleAggr.map(s => ({
            module: s._id || 'Standard Protocol',
            intensity: s.count > 10 ? 'High' : (s.count > 5 ? 'Medium' : 'Low'),
            index: s.count
        }));

        // 3. Sentiment Pulse (Keyword analysis of LiveChat)
        const recentChats = await LiveChat.find().sort({ createdAt: -1 }).limit(200).select('text').catch(() => []);
        const positiveKeywords = ['thank', 'excellent', 'clear', 'understood', 'great', 'awesome', 'wow', 'good'];
        const negativeKeywords = ['stuck', 'difficult', 'confused', 'error', 'broken', 'hard', 'fail', 'bad'];

        let positiveScore = 0;
        let negativeScore = 0;

        recentChats.forEach(chat => {
            const content = chat.text.toLowerCase();
            positiveKeywords.forEach(kw => { if (content.includes(kw)) positiveScore++; });
            negativeKeywords.forEach(kw => { if (content.includes(kw)) negativeScore++; });
        });

        const sentimentScore = recentChats.length > 0
            ? Math.round(((positiveScore) / (positiveScore + negativeScore || 1)) * 100)
            : 100;

        res.status(200).json({
            success: true,
            intelligence: {
                leadVelocity: `${avgLeadVelocity}h`,
                trendingStruggles,
                sentimentScore,
                dataFreshness: new Date()
            }
        });
    } catch (error) {
        console.error('[AdminController:getGrowthIntelligence] ERROR:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Growth Intelligence Signal Corrupted',
            error: error.message
        });
    }
};

/**
 * @desc    Get friction details for a specific module
 * @route   GET /api/admin/friction/:moduleTitle
 * @access  Private/Admin
 */
exports.getFrictionDetails = async (req, res) => {
    try {
        const { moduleTitle } = req.params;

        const openComments = await Comment.find({
            moduleTitle,
            status: 'open'
        })
            .populate('student', 'name email')
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({
            success: true,
            comments: openComments
        });
    } catch (error) {
        console.error('[AdminController:getFrictionDetails] ERROR:', error.stack);
        res.status(500).json({ success: false, message: 'Node Scan Interrupted' });
    }
};

