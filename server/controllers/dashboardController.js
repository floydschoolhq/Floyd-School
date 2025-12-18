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
