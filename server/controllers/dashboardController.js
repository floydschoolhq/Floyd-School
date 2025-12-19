const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Notification = require('../models/Notification');
const LiveClass = require('../models/LiveClass');
const SupportTicket = require('../models/SupportTicket');

// Get Student Dashboard Data
exports.getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;

        // Get enrolled courses
        const courses = await Course.find({ enrolledStudents: studentId })
            .populate('instructor', 'name email')
            .select('title description modules category');

        // Calculate overall progress
        let totalModules = 0;
        let completedModules = 0;
        courses.forEach(course => {
            totalModules += course.modules.length;
            completedModules += course.modules.filter(m => m.completed).length;
        });
        const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        // Get assignments for enrolled courses
        const courseIds = courses.map(c => c._id);
        const assignments = await Assignment.find({
            course: { $in: courseIds },
            status: 'published'
        })
            .populate('course', 'title')
            .sort({ dueDate: 1 })
            .limit(5);

        // Get ALL submissions for stats calculation
        const allSubmissions = await Submission.find({ student: studentId })
            .populate('assignment', 'title category')
            .sort({ submittedAt: -1 });

        // Calculate Skill Matrix
        const skillAcc = {};
        allSubmissions.forEach(sub => {
            if (sub.status === 'graded' && sub.assignment) {
                // Default to 'Development' if category is missing (legacy data)
                const cat = sub.assignment.category || 'Development';

                if (!skillAcc[cat]) skillAcc[cat] = { total: 0, count: 0 };
                skillAcc[cat].total += sub.grade || 0;
                skillAcc[cat].count += 1;
            }
        });

        const skillMatrix = Object.keys(skillAcc).map(cat => ({
            name: cat,
            score: Math.round(skillAcc[cat].total / skillAcc[cat].count)
        }));

        // Default if empty
        if (skillMatrix.length === 0) {
            skillMatrix.push(
                { name: 'Algorithms', score: 0 },
                { name: 'Debugging', score: 0 },
                { name: 'Development', score: 0 },
                { name: 'Database', score: 0 }
            );
        }

        // Get recent submissions for display
        const submissions = allSubmissions.slice(0, 5);

        // Get unread notifications
        const notifications = await Notification.find({
            recipient: studentId,
            isRead: false
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            courses,
            overallProgress,
            totalCourses: courses.length,
            completedModules,
            totalModules,
            assignments,
            submissions,
            notifications,
            skillMatrix,
            stats: {
                enrolledCourses: courses.length,
                pendingAssignments: assignments.filter(a => new Date(a.dueDate) > new Date()).length,
                completedAssignments: allSubmissions.filter(s => s.status === 'graded').length
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Mentor Dashboard Data
exports.getMentorDashboard = async (req, res) => {
    try {
        const mentorId = req.user._id;

        const myCourses = await Course.find({ instructor: mentorId });
        const courseIds = myCourses.map(c => c._id);

        const totalStudents = await User.countDocuments({ enrolledCourses: { $in: courseIds } });
        const pendingAssignments = await Submission.countDocuments({
            assignment: { $in: await Assignment.find({ course: { $in: courseIds } }).distinct('_id') },
            status: 'pending'
        });

        const activeSessions = await LiveClass.find({ mentor: mentorId, status: 'active' }).limit(5);

        res.json({
            success: true,
            stats: {
                activeCourses: myCourses.length,
                totalStudents: totalStudents || 0,
                pendingAssignments,
                overallRating: 4.9 // Mock
            },
            recentSessions: activeSessions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Growth Associate Dashboard Data
exports.getAssociateDashboard = async (req, res) => {
    try {
        const openTickets = await SupportTicket.countDocuments({ status: 'open' });
        const totalStudents = await User.countDocuments({ role: 'student' });

        res.json({
            success: true,
            stats: {
                activeStudents: totalStudents,
                avgEngagement: '88%',
                supportSLA: '14m',
                openTickets
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
