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

        // Step 1: Fetch core data concurrently
        const [rawCourses, allSubmissions, notifications] = await Promise.all([
            Course.find({
                enrolledStudents: studentId,
                status: 'published'
            })
                .populate('instructor', 'name email')
                .select('title description modules category'),

            Submission.find({ student: studentId })
                .populate('assignment', 'title category')
                .sort({ submittedAt: -1 }),

            Notification.find({
                recipient: studentId,
                isRead: false
            })
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        // Fetch and inject personalized student progress
        const UserProgress = require('../models/UserProgress');
        const progresses = await UserProgress.find({ student: studentId, course: { $in: rawCourses.map(c => c._id) } });
        const progressMap = new Map();
        progresses.forEach(p => {
            if (p && p.course) {
                progressMap.set(p.course.toString(), (p.completedModules || []).map(m => m.toString()));
            }
        });

        const courses = rawCourses.map(c => {
            const courseObj = c.toObject();
            const completedList = progressMap.get(courseObj._id.toString()) || [];
            if (courseObj.modules && Array.isArray(courseObj.modules)) {
                courseObj.modules = courseObj.modules.map(m => ({
                    ...m,
                    completed: completedList.includes(m._id.toString())
                }));
            }
            return courseObj;
        });

        // Step 2: Calculate overall progress from courses
        let totalModules = 0;
        let completedModules = 0;
        if (courses && Array.isArray(courses)) {
            courses.forEach(course => {
                if (course.modules && Array.isArray(course.modules)) {
                    totalModules += course.modules.length;
                    completedModules += course.modules.filter(m => m && m.completed).length;
                }
            });
        }
        const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        // Step 3: Get assignments based on fetched courses
        const courseIds = courses.map(c => c._id);
        const assignments = await Assignment.find({
            course: { $in: courseIds },
            status: 'published'
        })
            .populate('course', 'title')
            .sort({ dueDate: 1 })
            .limit(5);

        // Step 4: Calculate Skill Matrix from submissions
        const skillAcc = {};
        if (allSubmissions && Array.isArray(allSubmissions)) {
            allSubmissions.forEach(sub => {
                if (sub && sub.status === 'graded' && sub.assignment) {
                    const cat = sub.assignment.category || 'Development';
                    if (!skillAcc[cat]) skillAcc[cat] = { total: 0, count: 0 };
                    skillAcc[cat].total += sub.grade || 0;
                    skillAcc[cat].count += 1;
                }
            });
        }

        const skillMatrix = Object.keys(skillAcc).map(cat => ({
            name: cat,
            score: Math.round(skillAcc[cat].total / skillAcc[cat].count)
        }));

        if (skillMatrix.length === 0) {
            skillMatrix.push(
                { name: 'Algorithms', score: 0 },
                { name: 'Debugging', score: 0 },
                { name: 'Development', score: 0 },
                { name: 'Database', score: 0 }
            );
        }

        res.json({
            courses,
            overallProgress,
            totalCourses: courses.length,
            completedModules,
            totalModules,
            assignments,
            submissions: allSubmissions.slice(0, 5),
            notifications,
            skillMatrix,
            stats: {
                enrolledCourses: courses.length,
                pendingAssignments: assignments.filter(a => new Date(a.dueDate) > new Date()).length,
                completedAssignments: allSubmissions.filter(s => s.status === 'graded').length
            }
        });
    } catch (error) {
        console.error('Student Dashboard Error:', error);
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

        // Calculate At-Risk Students
        const allStudents = await User.find({ role: 'student' }).select('name lastLogin email createdAt');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        const riskData = allStudents.filter(s => s).map(student => {
            const lastLogin = student.lastLogin ? new Date(student.lastLogin) : (student.createdAt ? new Date(student.createdAt) : new Date());
            const diffDays = Math.floor((now - lastLogin) / oneDay);

            let risk = 'Low';
            let reason = 'Active recently';

            if (diffDays > 14) {
                risk = 'High';
                reason = 'Protocol breached: Long-term inactivity';
            } else if (diffDays > 7) {
                risk = 'High';
                reason = `Inactive for ${diffDays} days`;
            } else if (diffDays > 3) {
                risk = 'Medium';
                reason = `Absent for ${diffDays} days`;
            }

            return {
                name: student.name,
                risk,
                lastActive: diffDays === 0 ? 'Today' : `${diffDays} days ago`,
                reason,
                diffDays
            };
        });

        // Filter only Medium/High risk and sort by inactivity
        const atRiskStudents = riskData
            .filter(s => s.risk !== 'Low')
            .sort((a, b) => b.diffDays - a.diffDays)
            .slice(0, 5); // Show top 5

        res.json({
            success: true,
            stats: {
                activeStudents: totalStudents,
                avgEngagement: '88%',
                supportSLA: '14m',
                openTickets
            },
            atRiskStudents
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
