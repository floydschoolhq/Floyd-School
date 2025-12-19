const User = require('../models/User');
const Course = require('../models/Course');
const SupportTicket = require('../models/SupportTicket');

/**
 * @desc    Get all students for registry
 * @route   GET /api/growth/students
 * @access  Private (Growth Associate, Admin)
 */
exports.getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('-password')
            .sort({ createdAt: -1 });

        // Enhance with enrollment data
        const enrichedStudents = await Promise.all(students.map(async (student) => {
            const enrollments = await Course.find({ enrolledStudents: student._id }).select('title _id');
            const openTickets = await SupportTicket.countDocuments({ student: student._id, status: { $ne: 'closed' } });

            return {
                ...student.toObject(),
                enrollments,
                openTickets
            };
        }));

        res.status(200).json({
            success: true,
            count: enrichedStudents.length,
            students: enrichedStudents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get escalated tickets
 * @route   GET /api/growth/escalations
 * @access  Private (Growth Associate, Admin)
 */
exports.getEscalations = async (req, res) => {
    try {
        // Fetch tickets that are open or specifically tagged as escalated (if we had that state)
        // For now, "open" tickets are the concern of growth associates if they aren't being handled.
        // Or we can filter by priority 'high'
        const tickets = await SupportTicket.find({
            status: { $in: ['open', 'in-progress'] },
            priority: 'high'
        })
            .populate('student', 'name email')
            .sort({ createdAt: 1 }); // Oldest first (urgent)

        res.status(200).json({
            success: true,
            count: tickets.length,
            tickets
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
