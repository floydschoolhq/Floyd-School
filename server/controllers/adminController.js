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
                revenue: 124500 // Mock for now
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
