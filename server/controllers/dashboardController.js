const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const User = require('../models/User');
const Notification = require('../models/Notification');

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

        // Get recent submissions
        const submissions = await Submission.find({ student: studentId })
            .populate('assignment', 'title')
            .sort({ submittedAt: -1 })
            .limit(5);

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
            stats: {
                enrolledCourses: courses.length,
                pendingAssignments: assignments.filter(a => new Date(a.dueDate) > new Date()).length,
                completedAssignments: submissions.filter(s => s.status === 'graded').length
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

        // Get mentor's courses
        const courses = await Course.find({ instructor: mentorId })
            .populate('enrolledStudents', 'name email');

        // Get total enrolled students
        const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);

        // Get assignments created by mentor
        const assignments = await Assignment.find({ createdBy: mentorId })
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get pending submissions (not graded yet)
        const assignmentIds = assignments.map(a => a._id);
        const pendingSubmissions = await Submission.find({
            assignment: { $in: assignmentIds },
            status: 'submitted'
        })
            .populate('student', 'name email')
            .populate('assignment', 'title dueDate')
            .sort({ submittedAt: -1 });

        // Get recent graded submissions
        const gradedSubmissions = await Submission.find({
            assignment: { $in: assignmentIds },
            status: 'graded'
        })
            .populate('student', 'name email')
            .populate('assignment', 'title')
            .sort({ gradedAt: -1 })
            .limit(5);

        // Get unread notifications
        const notifications = await Notification.find({
            recipient: mentorId,
            isRead: false
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            courses,
            assignments,
            pendingSubmissions,
            gradedSubmissions,
            notifications,
            stats: {
                totalCourses: courses.length,
                totalStudents,
                pendingReviews: pendingSubmissions.length,
                totalAssignments: assignments.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Admin Dashboard Data
exports.getAdminDashboard = async (req, res) => {
    try {
        // Get all users count by role
        const studentCount = await User.countDocuments({ role: 'student' });
        const mentorCount = await User.countDocuments({ role: 'mentor' });
        const adminCount = await User.countDocuments({ role: 'school-admin' });

        // Get all courses
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ isActive: true });

        // Get recent courses
        const recentCourses = await Course.find()
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get all assignments
        const totalAssignments = await Assignment.countDocuments();

        // Get all submissions
        const totalSubmissions = await Submission.countDocuments();
        const gradedSubmissions = await Submission.countDocuments({ status: 'graded' });

        // Get recent users
        const recentUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get recent activity (notifications)
        const recentActivity = await Notification.find()
            .populate('recipient', 'name email')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json({
            stats: {
                totalUsers: studentCount + mentorCount + adminCount,
                students: studentCount,
                mentors: mentorCount,
                admins: adminCount,
                totalCourses,
                activeCourses,
                totalAssignments,
                totalSubmissions,
                gradedSubmissions
            },
            recentCourses,
            recentUsers,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
