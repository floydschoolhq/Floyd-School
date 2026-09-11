const User = require('../models/User');
const School = require('../models/School');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Material = require('../models/Material');
const ClassGuide = require('../models/ClassGuide');
const Notification = require('../models/Notification');
const { generateUniqueRollNumber } = require('../utils/rollNumberGenerator');
const { generateStudentId } = require('../utils/studentIdGenerator');

// Helper: resolve batches assigned to this mentor (or all for admin)
async function getMentorBatchesQuery(req) {
    if (req.user.role === 'admin') {
        return {};
    }
    // Check if mentor is instructor of batches
    const mentorBatches = await Batch.find({ instructor: req.user._id }).select('_id');
    if (mentorBatches.length > 0) {
        return { _id: { $in: mentorBatches.map(b => b._id) } };
    }
    // If no batches explicitly assigned, check if user has school assigned
    if (req.user.school) {
        return { school: req.user.school };
    }
    // Fallback: Return all active batches so mentor has access to classroom operations
    return { status: 'active' };
}

// @desc    Get mentor dashboard statistics and quick overview
// @route   GET /api/mentor/offline/dashboard
// @access  Private (mentor, admin)
const getDashboardStats = async (req, res) => {
    try {
        const batchQuery = await getMentorBatchesQuery(req);
        const batches = await Batch.find(batchQuery).populate('school', 'name code city address');
        const batchIds = batches.map(b => b._id);

        // Unique schools
        const schoolMap = new Map();
        batches.forEach(b => {
            if (b.school) {
                schoolMap.set(b.school._id.toString(), b.school);
            }
        });
        const schools = Array.from(schoolMap.values());

        // Total students
        const totalStudents = await User.countDocuments({
            batch: { $in: batchIds },
            role: 'school_student'
        });

        // Today's classes based on day of week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const todayIndex = new Date().getDay();
        const todayFull = daysOfWeek[todayIndex];
        const todayShort = shortDays[todayIndex];

        const todaysClasses = batches.filter(b => {
            if (!Array.isArray(b.scheduleDays) || b.scheduleDays.length === 0) return false;
            return b.scheduleDays.some(d =>
                d.toLowerCase().includes(todayFull.toLowerCase()) ||
                d.toLowerCase().includes(todayShort.toLowerCase())
            );
        }).map(b => ({
            _id: b._id,
            name: b.name,
            code: b.code,
            schoolName: b.school?.name || 'Partner School',
            roomVenue: b.roomVenue || 'Lab 101',
            scheduleTime: b.scheduleTime || '10:00 AM - 11:30 AM',
            subject: b.subject || 'Robotics & STEM Lab',
            studentsCount: b.students?.length || 0
        }));

        // Upcoming classes (all batches formatted for schedule)
        const upcomingClasses = batches.map(b => ({
            _id: b._id,
            name: b.name,
            code: b.code,
            schoolName: b.school?.name || 'Partner School',
            roomVenue: b.roomVenue || 'Lab 101',
            scheduleDays: b.scheduleDays || ['Mon', 'Wed'],
            scheduleTime: b.scheduleTime || '10:00 AM - 11:30 AM',
            subject: b.subject || 'Robotics & STEM Lab',
            studentsCount: b.students?.length || 0
        }));

        // Pending quiz responses (total quiz submissions in these batches)
        const quizzes = await Quiz.find({ batch: { $in: batchIds } }).select('_id');
        const quizIds = quizzes.map(q => q._id);
        const totalQuizSubmissions = await QuizSubmission.countDocuments({ quiz: { $in: quizIds } });

        // Pending homework submissions (submissions waiting for grading or total submitted)
        const assignments = await Assignment.find({ batch: { $in: batchIds } }).select('_id');
        const assignmentIds = assignments.map(a => a._id);
        const pendingHomeworkSubmissions = await Submission.countDocuments({
            assignment: { $in: assignmentIds },
            status: { $in: ['submitted', 'Submitted'] }
        });
        const totalHomeworkSubmissions = await Submission.countDocuments({
            assignment: { $in: assignmentIds }
        });

        // Today's attendance
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

        const todayAttendanceLogs = await Attendance.find({
            batch: { $in: batchIds },
            date: { $gte: startOfDay, $lt: endOfDay }
        });

        let todayPresent = 0;
        let todayTotal = 0;
        todayAttendanceLogs.forEach(log => {
            log.records.forEach(r => {
                todayTotal++;
                if (r.status === 'present' || r.status === 'late') {
                    todayPresent++;
                }
            });
        });

        const todayAttendanceRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 100;

        // Pending student self-registrations waiting for mentor approval
        const pendingRegistrationsCount = await User.countDocuments({
            role: 'school_student',
            approvalStatus: 'pending'
        });

        res.json({
            success: true,
            data: {
                mentor: {
                    _id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role
                },
                stats: {
                    totalSchools: schools.length,
                    totalBatches: batches.length,
                    totalStudents,
                    todaysClassesCount: todaysClasses.length,
                    pendingQuizResponses: totalQuizSubmissions,
                    pendingHomeworkSubmissions,
                    totalHomeworkSubmissions,
                    todayPresent,
                    todayTotal,
                    todayAttendanceRate,
                    pendingRegistrationsCount
                },
                schools: schools.map(s => ({ _id: s._id, name: s.name, code: s.code, city: s.city })),
                batches: batches.map(b => ({
                    _id: b._id,
                    name: b.name,
                    code: b.code,
                    schoolName: b.school?.name || 'Partner School',
                    studentsCount: b.students?.length || 0,
                    subject: b.subject,
                    scheduleDays: b.scheduleDays,
                    scheduleTime: b.scheduleTime,
                    roomVenue: b.roomVenue
                })),
                todaysClasses,
                upcomingClasses
            }
        });
    } catch (error) {
        console.error('[mentorOffline:getDashboardStats] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to load dashboard statistics' });
    }
};

// @desc    Get all batches assigned to the mentor
// @route   GET /api/mentor/offline/batches
// @access  Private (mentor, admin)
const getMyBatches = async (req, res) => {
    try {
        const batchQuery = await getMentorBatchesQuery(req);
        const batches = await Batch.find(batchQuery)
            .populate('school', 'name code city address')
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 });

        const batchData = await Promise.all(batches.map(async (b) => {
            const studentCount = await User.countDocuments({ batch: b._id, role: 'school_student' });
            const sessionCount = await Attendance.countDocuments({ batch: b._id });
            return {
                _id: b._id,
                name: b.name,
                code: b.code || 'BATCH',
                school: b.school ? {
                    _id: b.school._id,
                    name: b.school.name,
                    code: b.school.code,
                    city: b.school.city
                } : null,
                subject: b.subject || 'Robotics & STEM Lab',
                scheduleDays: b.scheduleDays || ['Mon', 'Wed'],
                scheduleTime: b.scheduleTime || '10:00 AM - 11:30 AM',
                roomVenue: b.roomVenue || 'Lab 101',
                academicYear: b.academicYear || '2025-2026',
                status: b.status || 'active',
                studentsCount: studentCount,
                sessionCount,
                instructor: b.instructor ? {
                    _id: b.instructor._id,
                    name: b.instructor.name,
                    email: b.instructor.email
                } : null
            };
        }));

        res.json({
            success: true,
            data: batchData
        });
    } catch (error) {
        console.error('[mentorOffline:getMyBatches] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch batches' });
    }
};

// @desc    Get single batch details including roster & statistics
// @route   GET /api/mentor/offline/batches/:id
// @access  Private (mentor, admin)
const getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id)
            .populate('school', 'name code city address')
            .populate('instructor', 'name email');

        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        // Get enrolled students
        const students = await User.find({ batch: batch._id, role: 'school_student' })
            .select('-password -sessionToken')
            .sort({ offlineRollNo: 1, name: 1 });

        // Calculate attendance stats for this batch
        const logs = await Attendance.find({ batch: batch._id }).sort({ date: -1 });
        const totalSessions = logs.length;

        const studentsWithStats = students.map(s => {
            let attendedCount = 0;
            logs.forEach(l => {
                const rec = l.records.find(r => r.student.toString() === s._id.toString());
                if (rec && (rec.status === 'present' || rec.status === 'late')) {
                    attendedCount++;
                }
            });
            const attendancePercentage = totalSessions > 0
                ? Math.round((attendedCount / totalSessions) * 100)
                : 100;

            return {
                _id: s._id,
                name: s.name,
                email: s.email,
                offlineRollNo: s.offlineRollNo || 'Pending',
                grade: s.grade || 'Grade 10',
                section: s.section || 'A',
                studentMobile: s.studentMobile || '',
                fatherName: s.fatherName || '',
                fatherMobile: s.fatherMobile || '',
                attendancePercentage,
                attendedCount,
                totalSessions
            };
        });

        // Quizzes and homework for this batch
        const quizzesCount = await Quiz.countDocuments({ batch: batch._id });
        const homeworkCount = await Assignment.countDocuments({ batch: batch._id });
        const materialsCount = await Material.countDocuments({ batch: batch._id });

        res.json({
            success: true,
            data: {
                batch: {
                    _id: batch._id,
                    name: batch.name,
                    code: batch.code,
                    school: batch.school,
                    subject: batch.subject,
                    scheduleDays: batch.scheduleDays,
                    scheduleTime: batch.scheduleTime,
                    roomVenue: batch.roomVenue,
                    status: batch.status,
                    totalSessions,
                    quizzesCount,
                    homeworkCount,
                    materialsCount
                },
                students: studentsWithStats,
                recentAttendance: logs.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('[mentorOffline:getBatchById] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch batch details' });
    }
};

// @desc    Get students for mentor's batches with search and filters
// @route   GET /api/mentor/offline/students
// @access  Private (mentor, admin)
const getStudents = async (req, res) => {
    try {
        const { batchId, search, approvalStatus } = req.query;
        const batchQuery = await getMentorBatchesQuery(req);
        const mentorBatches = await Batch.find(batchQuery).select('_id');
        const allowedBatchIds = mentorBatches.map(b => b._id);

        const query = {
            role: 'school_student'
        };

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        } else if (approvalStatus !== 'pending') {
            query.batch = { $in: allowedBatchIds };
        }

        if (approvalStatus && approvalStatus !== 'all') {
            query.approvalStatus = approvalStatus;
        }

        if (search) {
            const regex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: regex },
                { email: regex },
                { offlineRollNo: regex },
                { studentMobile: regex },
                { fatherName: regex }
            ];
        }

        const students = await User.find(query)
            .select('-password -sessionToken')
            .populate('batch', 'name code')
            .populate('school', 'name code city')
            .sort({ approvalStatus: -1, offlineRollNo: 1, name: 1 });

        // Calculate attendance % for each student
        const formatted = await Promise.all(students.map(async (s) => {
            let attendancePercentage = 100;
            let attendedCount = 0;
            let totalSessions = 0;

            if (s.batch) {
                const logs = await Attendance.find({ batch: s.batch._id });
                totalSessions = logs.length;
                logs.forEach(l => {
                    const rec = l.records.find(r => r.student.toString() === s._id.toString());
                    if (rec && (rec.status === 'present' || rec.status === 'late')) {
                        attendedCount++;
                    }
                });
                attendancePercentage = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 100;
            }

            return {
                _id: s._id,
                name: s.name,
                email: s.email,
                offlineRollNo: s.offlineRollNo || 'Pending',
                grade: s.grade || 'Grade 10',
                section: s.section || 'A',
                studentMobile: s.studentMobile || '',
                fatherName: s.fatherName || 'N/A',
                fatherMobile: s.fatherMobile || '',
                school: s.school ? { _id: s.school._id, name: s.school.name, code: s.school.code } : null,
                batch: s.batch ? { _id: s.batch._id, name: s.batch.name, code: s.batch.code } : null,
                approvalStatus: s.approvalStatus,
                attendancePercentage,
                attendedCount,
                totalSessions
            };
        }));

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('[mentorOffline:getStudents] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch students' });
    }
};

// @desc    Get detailed student profile with academic history
// @route   GET /api/mentor/offline/students/:id
// @access  Private (mentor, admin)
const getStudentProfile = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .select('-password -sessionToken')
            .populate('school', 'name code city address')
            .populate('batch', 'name code subject roomVenue scheduleTime scheduleDays');

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Attendance history
        let attendanceLogs = [];
        let attendancePercentage = 100;
        let attendedCount = 0;
        let totalSessions = 0;

        if (student.batch) {
            const logs = await Attendance.find({
                batch: student.batch._id,
                'records.student': student._id
            }).sort({ date: -1 });

            totalSessions = await Attendance.countDocuments({ batch: student.batch._id });

            attendanceLogs = logs.map(l => {
                const rec = l.records.find(r => r.student.toString() === student._id.toString());
                if (rec && (rec.status === 'present' || rec.status === 'late')) {
                    attendedCount++;
                }
                return {
                    _id: l._id,
                    date: l.date,
                    topicCovered: l.topicCovered,
                    status: rec?.status || 'present',
                    remarks: rec?.remarks || ''
                };
            });

            attendancePercentage = totalSessions > 0 ? Math.round((attendedCount / totalSessions) * 100) : 100;
        }

        // Quiz submissions
        const quizSubmissions = await QuizSubmission.find({ student: student._id })
            .populate('quiz', 'title totalMarks timeLimitMinutes')
            .sort({ submittedAt: -1 });

        const formattedQuizzes = quizSubmissions.map(qs => ({
            _id: qs._id,
            quizTitle: qs.quiz?.title || 'Quiz',
            score: qs.score,
            totalMarks: qs.totalMarks,
            percentage: qs.percentage,
            submittedAt: qs.submittedAt
        }));

        // Homework submissions
        const homeworkSubmissions = await Submission.find({ student: student._id })
            .populate('assignment', 'title dueDate maxMarks maxPoints')
            .sort({ submittedAt: -1 });

        const formattedHomework = homeworkSubmissions.map(hs => ({
            _id: hs._id,
            assignmentTitle: hs.assignment?.title || 'Assignment',
            dueDate: hs.assignment?.dueDate,
            submittedAt: hs.submittedAt,
            status: hs.status,
            marksObtained: hs.marksObtained !== undefined ? hs.marksObtained : hs.grade,
            maxMarks: hs.assignment?.maxMarks || hs.assignment?.maxPoints || 100,
            feedback: hs.feedback || '',
            fileUrl: hs.fileUrl || hs.attachments?.[0]?.url
        }));

        res.json({
            success: true,
            data: {
                student: {
                    _id: student._id,
                    name: student.name,
                    email: student.email,
                    offlineRollNo: student.offlineRollNo || 'Pending Allotment',
                    grade: student.grade || 'Grade 10',
                    section: student.section || 'A',
                    studentMobile: student.studentMobile || '',
                    fatherName: student.fatherName || 'N/A',
                    fatherMobile: student.fatherMobile || '',
                    school: student.school,
                    batch: student.batch,
                    approvalStatus: student.approvalStatus,
                    createdAt: student.createdAt
                },
                academics: {
                    attendancePercentage,
                    attendedCount,
                    totalSessions,
                    quizzesTaken: formattedQuizzes.length,
                    homeworkSubmitted: formattedHomework.length
                },
                attendanceHistory: attendanceLogs,
                quizSubmissions: formattedQuizzes,
                homeworkSubmissions: formattedHomework
            }
        });
    } catch (error) {
        console.error('[mentorOffline:getStudentProfile] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch student profile' });
    }
};

// @desc    Get attendance logs for mentor's batch
// @route   GET /api/mentor/offline/attendance
// @access  Private (mentor, admin)
const getAttendanceLogs = async (req, res) => {
    try {
        const { batchId, date } = req.query;
        const query = {};

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        } else {
            const batchQuery = await getMentorBatchesQuery(req);
            const batches = await Batch.find(batchQuery).select('_id');
            query.batch = { $in: batches.map(b => b._id) };
        }

        if (date) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            query.date = {
                $gte: d,
                $lt: new Date(d.getTime() + 24 * 60 * 60 * 1000)
            };
        }

        const logs = await Attendance.find(query)
            .populate('batch', 'name code roomVenue scheduleTime')
            .populate('school', 'name code')
            .populate('records.student', 'name offlineRollNo grade section studentMobile')
            .sort({ date: -1 });

        const formatted = logs.map(log => {
            let presentCount = 0;
            let absentCount = 0;
            let lateCount = 0;
            let holidayCount = 0;

            const records = log.records.map(r => {
                if (r.status === 'present') presentCount++;
                else if (r.status === 'absent') absentCount++;
                else if (r.status === 'late') lateCount++;
                else if (r.status === 'holiday') holidayCount++;

                return {
                    studentId: r.student ? {
                        _id: r.student._id,
                        name: r.student.name,
                        offlineRollNo: r.student.offlineRollNo || 'Pending',
                        grade: r.student.grade,
                        section: r.student.section,
                        mobile: r.student.studentMobile
                    } : null,
                    status: r.status,
                    remarks: r.remarks || ''
                };
            }).filter(r => r.studentId !== null);

            const total = records.length;
            const percentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

            return {
                _id: log._id,
                date: log.date,
                topicCovered: log.topicCovered,
                batch: log.batch ? {
                    _id: log.batch._id,
                    name: log.batch.name,
                    code: log.batch.code,
                    roomVenue: log.batch.roomVenue,
                    scheduleTime: log.batch.scheduleTime
                } : null,
                school: log.school ? {
                    _id: log.school._id,
                    name: log.school.name,
                    code: log.school.code
                } : null,
                stats: {
                    total,
                    presentCount,
                    absentCount,
                    lateCount,
                    holidayCount,
                    percentage
                },
                records
            };
        });

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('[mentorOffline:getAttendanceLogs] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance logs' });
    }
};

// @desc    Mentor marks attendance for offline session
// @route   POST /api/mentor/offline/mark-attendance
// @access  Private (mentor, admin)
const markAttendance = async (req, res) => {
    try {
        const { batchId, date, topicCovered, records } = req.body;

        if (!batchId || !date || !Array.isArray(records)) {
            return res.status(400).json({ success: false, message: 'Batch ID, date, and attendance records are required.' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);

        const attendanceRecords = records.map(r => ({
            student: r.studentId || r.student,
            status: r.status || 'present',
            remarks: r.remarks || ''
        }));

        let log = await Attendance.findOne({
            batch: batchId,
            date: {
                $gte: sessionDate,
                $lt: new Date(sessionDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (log) {
            log.records = attendanceRecords;
            log.topicCovered = topicCovered || log.topicCovered;
            log.markedBy = req.user._id;
            await log.save();
        } else {
            log = await Attendance.create({
                school: batch.school || req.user.school,
                batch: batchId,
                date: sessionDate,
                topicCovered: topicCovered || 'Practical STEM Experiment',
                markedBy: req.user._id,
                records: attendanceRecords
            });
        }

        // Notify real-time listeners via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.emit('attendance:updated', {
                batchId,
                batchName: batch.name,
                date: sessionDate,
                topicCovered: log.topicCovered
            });
        }

        res.json({
            success: true,
            message: 'Attendance recorded successfully!',
            data: log
        });
    } catch (error) {
        console.error('[mentorOffline:markAttendance] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to record attendance' });
    }
};

// @desc    Get attendance analytics for mentor with low-attendance warnings
// @route   GET /api/mentor/offline/attendance/analytics
// @access  Private (mentor, admin)
const getAttendanceAnalytics = async (req, res) => {
    try {
        const { batchId } = req.query;
        const query = {};

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        } else {
            const batchQuery = await getMentorBatchesQuery(req);
            const batches = await Batch.find(batchQuery).select('_id');
            query.batch = { $in: batches.map(b => b._id) };
        }

        const logs = await Attendance.find(query).populate('batch', 'name code').populate('records.student', 'name offlineRollNo');

        let totalSessions = logs.length;
        let totalPresent = 0;
        let totalLate = 0;
        let totalAbsent = 0;
        let totalRecords = 0;

        // Map student wise counts
        const studentStats = new Map();

        logs.forEach(l => {
            l.records.forEach(r => {
                totalRecords++;
                if (r.status === 'present') totalPresent++;
                else if (r.status === 'late') totalLate++;
                else if (r.status === 'absent') totalAbsent++;

                if (r.student) {
                    const sId = r.student._id.toString();
                    if (!studentStats.has(sId)) {
                        studentStats.set(sId, {
                            studentId: sId,
                            name: r.student.name,
                            rollNo: r.student.offlineRollNo || 'Pending',
                            attended: 0,
                            total: 0
                        });
                    }
                    const stat = studentStats.get(sId);
                    stat.total++;
                    if (r.status === 'present' || r.status === 'late') {
                        stat.attended++;
                    }
                }
            });
        });

        const overallPercentage = totalRecords > 0
            ? Math.round(((totalPresent + totalLate) / totalRecords) * 100)
            : 0;

        // Filter low-attendance students (< 75%)
        const lowAttendanceStudents = Array.from(studentStats.values())
            .map(s => ({
                ...s,
                percentage: s.total > 0 ? Math.round((s.attended / s.total) * 100) : 100
            }))
            .filter(s => s.total >= 2 && s.percentage < 75);

        res.json({
            success: true,
            data: {
                totalSessions,
                totalRecords,
                totalPresent,
                totalLate,
                totalAbsent,
                overallPercentage,
                lowAttendanceStudents
            }
        });
    } catch (error) {
        console.error('[mentorOffline:getAttendanceAnalytics] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to load analytics' });
    }
};

// @desc    Update single attendance log
// @route   PUT /api/mentor/offline/attendance/:logId
// @access  Private (mentor, admin)
const updateAttendanceLog = async (req, res) => {
    try {
        const log = await Attendance.findById(req.params.logId);
        if (!log) {
            return res.status(404).json({ success: false, message: 'Attendance log not found' });
        }

        const { topicCovered, records } = req.body;
        if (topicCovered) log.topicCovered = topicCovered;
        if (Array.isArray(records)) {
            log.records = records.map(r => ({
                student: r.studentId || r.student,
                status: r.status || 'present',
                remarks: r.remarks || ''
            }));
        }
        log.markedBy = req.user._id;
        await log.save();

        res.json({
            success: true,
            message: 'Attendance log updated successfully!',
            data: log
        });
    } catch (error) {
        console.error('[mentorOffline:updateAttendanceLog] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Update failed' });
    }
};

// @desc    Get quizzes for mentor batches
// @route   GET /api/mentor/offline/quizzes
// @access  Private (mentor, admin)
const getQuizzes = async (req, res) => {
    try {
        const { batchId } = req.query;
        const query = {};

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        } else {
            const batchQuery = await getMentorBatchesQuery(req);
            const batches = await Batch.find(batchQuery).select('_id');
            query.batch = { $in: batches.map(b => b._id) };
        }

        const quizzes = await Quiz.find(query)
            .select('+questions.correctOption') // Mentor can see correct answers!
            .populate('batch', 'name code')
            .populate('school', 'name code')
            .sort({ createdAt: -1 });

        const formatted = await Promise.all(quizzes.map(async (q) => {
            const totalSubmissions = await QuizSubmission.countDocuments({ quiz: q._id });
            const totalEnrolled = q.batch ? await User.countDocuments({ batch: q.batch._id, role: 'school_student' }) : 0;

            return {
                _id: q._id,
                title: q.title,
                description: q.description,
                batch: q.batch ? { _id: q.batch._id, name: q.batch.name, code: q.batch.code } : null,
                school: q.school ? { _id: q.school._id, name: q.school.name } : null,
                totalMarks: q.totalMarks,
                timeLimitMinutes: q.timeLimitMinutes,
                questionsCount: q.questions.length,
                status: q.status,
                createdAt: q.createdAt,
                totalSubmissions,
                totalEnrolled
            };
        }));

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('[mentorOffline:getQuizzes] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
    }
};

// @desc    Get single quiz with questions & correct options for mentor
// @route   GET /api/mentor/offline/quizzes/:id
// @access  Private (mentor, admin)
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .select('+questions.correctOption')
            .populate('batch', 'name code')
            .populate('school', 'name code');

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        console.error('[mentorOffline:getQuizById] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch quiz' });
    }
};

// @desc    Create new quiz for an offline batch
// @route   POST /api/mentor/offline/quizzes
// @access  Private (mentor, admin)
const createQuiz = async (req, res) => {
    try {
        const { title, description, batchId, totalMarks, timeLimitMinutes, questions, status } = req.body;

        if (!title || !batchId || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Title, batch, and at least one question are required'
            });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Classroom batch not found' });
        }

        // Validate questions
        for (const q of questions) {
            if (!q.questionText || !Array.isArray(q.options) || q.options.length < 2 || q.correctOption === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Each question must have text, at least two options, and a specified correct option index.'
                });
            }
        }

        const quiz = await Quiz.create({
            title: title.trim(),
            description: description || '',
            school: batch.school || req.user.school,
            batch: batch._id,
            totalMarks: Number(totalMarks) || (questions.length * 10),
            timeLimitMinutes: Number(timeLimitMinutes) || 15,
            questions: questions.map(q => ({
                questionText: q.questionText.trim(),
                options: q.options.map(opt => String(opt).trim()),
                correctOption: Number(q.correctOption)
            })),
            createdBy: req.user._id,
            status: status || 'published'
        });

        // Notify students via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.emit('quiz:created', {
                quizId: quiz._id,
                title: quiz.title,
                batchId: batch._id,
                batchName: batch.name
            });
        }

        res.status(201).json({
            success: true,
            message: 'Quiz created and published successfully!',
            data: quiz
        });
    } catch (error) {
        console.error('[mentorOffline:createQuiz] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create quiz' });
    }
};

// @desc    Update an existing quiz
// @route   PUT /api/mentor/offline/quizzes/:id
// @access  Private (mentor, admin)
const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const { title, description, totalMarks, timeLimitMinutes, questions, status } = req.body;
        if (title) quiz.title = title.trim();
        if (description !== undefined) quiz.description = description;
        if (totalMarks) quiz.totalMarks = Number(totalMarks);
        if (timeLimitMinutes) quiz.timeLimitMinutes = Number(timeLimitMinutes);
        if (status) quiz.status = status;

        if (Array.isArray(questions)) {
            quiz.questions = questions.map(q => ({
                questionText: q.questionText.trim(),
                options: q.options.map(opt => String(opt).trim()),
                correctOption: Number(q.correctOption)
            }));
        }

        await quiz.save();

        res.json({
            success: true,
            message: 'Quiz updated successfully!',
            data: quiz
        });
    } catch (error) {
        console.error('[mentorOffline:updateQuiz] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to update quiz' });
    }
};

// @desc    Delete quiz
// @route   DELETE /api/mentor/offline/quizzes/:id
// @access  Private (mentor, admin)
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        await Quiz.deleteOne({ _id: quiz._id });
        await QuizSubmission.deleteMany({ quiz: quiz._id });

        res.json({
            success: true,
            message: 'Quiz deleted successfully!'
        });
    } catch (error) {
        console.error('[mentorOffline:deleteQuiz] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete quiz' });
    }
};

// @desc    Get all student responses for a quiz
// @route   GET /api/mentor/offline/quizzes/:id/responses
// @access  Private (mentor, admin)
const getQuizResponses = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .select('+questions.correctOption')
            .populate('batch', 'name code');

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const submissions = await QuizSubmission.find({ quiz: quiz._id })
            .populate('student', 'name offlineRollNo email grade section')
            .sort({ score: -1, submittedAt: -1 });

        const formatted = submissions.map(sub => ({
            _id: sub._id,
            student: sub.student ? {
                _id: sub.student._id,
                name: sub.student.name,
                offlineRollNo: sub.student.offlineRollNo || 'Pending',
                grade: sub.student.grade,
                section: sub.student.section,
                email: sub.student.email
            } : null,
            score: sub.score,
            totalMarks: sub.totalMarks,
            percentage: sub.percentage,
            submittedAt: sub.submittedAt,
            answersCount: sub.answers?.length || 0
        })).filter(s => s.student !== null);

        res.json({
            success: true,
            data: {
                quiz: {
                    _id: quiz._id,
                    title: quiz.title,
                    totalMarks: quiz.totalMarks,
                    batchName: quiz.batch?.name || 'Offline Batch',
                    totalQuestions: quiz.questions.length
                },
                responses: formatted
            }
        });
    } catch (error) {
        console.error('[mentorOffline:getQuizResponses] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch quiz responses' });
    }
};

// @desc    Get detailed quiz submission with question review for a student
// @route   GET /api/mentor/offline/quizzes/:id/responses/:studentId
// @access  Private (mentor, admin)
const getQuizResponseDetail = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).select('+questions.correctOption');
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const submission = await QuizSubmission.findOne({
            quiz: req.params.id,
            student: req.params.studentId
        }).populate('student', 'name offlineRollNo email grade section');

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        // Build question-by-question review
        const answerMap = new Map();
        submission.answers.forEach(a => answerMap.set(Number(a.questionIndex), Number(a.selectedOption)));

        const review = quiz.questions.map((q, idx) => {
            const selectedOpt = answerMap.get(idx);
            const isCorrect = selectedOpt !== undefined && selectedOpt === q.correctOption;
            return {
                questionIndex: idx,
                questionText: q.questionText,
                options: q.options,
                selectedOption: selectedOpt !== undefined ? selectedOpt : null,
                correctOption: q.correctOption,
                isCorrect
            };
        });

        res.json({
            success: true,
            data: {
                student: submission.student,
                score: submission.score,
                totalMarks: submission.totalMarks,
                percentage: submission.percentage,
                submittedAt: submission.submittedAt,
                review
            }
        });
    } catch (error) {
        console.error('[mentorOffline:getQuizResponseDetail] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to load response detail' });
    }
};

// @desc    Get homework assignments for mentor batches
// @route   GET /api/mentor/offline/homework
// @access  Private (mentor, admin)
const getHomework = async (req, res) => {
    try {
        const { batchId } = req.query;
        const query = {};

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        } else {
            const batchQuery = await getMentorBatchesQuery(req);
            const batches = await Batch.find(batchQuery).select('_id');
            query.batch = { $in: batches.map(b => b._id) };
        }

        const assignments = await Assignment.find(query)
            .populate('batch', 'name code')
            .populate('school', 'name code')
            .sort({ dueDate: 1, createdAt: -1 });

        const formatted = await Promise.all(assignments.map(async (a) => {
            const totalSubmissions = await Submission.countDocuments({ assignment: a._id });
            const gradedSubmissions = await Submission.countDocuments({
                assignment: a._id,
                status: { $in: ['graded', 'Graded'] }
            });
            const totalEnrolled = a.batch ? await User.countDocuments({ batch: a.batch._id, role: 'school_student' }) : 0;

            return {
                _id: a._id,
                title: a.title,
                description: a.description,
                dueDate: a.dueDate,
                maxMarks: a.maxMarks || a.maxPoints || 100,
                status: a.status,
                batch: a.batch ? { _id: a.batch._id, name: a.batch.name, code: a.batch.code } : null,
                school: a.school ? { _id: a.school._id, name: a.school.name } : null,
                attachments: a.attachments,
                totalSubmissions,
                gradedSubmissions,
                totalEnrolled
            };
        }));

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('[mentorOffline:getHomework] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch homework assignments' });
    }
};

// @desc    Create new homework assignment
// @route   POST /api/mentor/offline/homework
// @access  Private (mentor, admin)
const createHomework = async (req, res) => {
    try {
        const { title, description, batchId, dueDate, maxMarks, attachments, status } = req.body;

        if (!title || !batchId || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Title, batch, and deadline date are required.'
            });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Classroom batch not found' });
        }

        const assignment = await Assignment.create({
            title: title.trim(),
            description: description || 'Complete the hands-on lab exercise.',
            school: batch.school || req.user.school,
            batch: batch._id,
            dueDate: new Date(dueDate),
            maxMarks: Number(maxMarks) || 100,
            maxPoints: Number(maxMarks) || 100,
            attachments: Array.isArray(attachments) ? attachments : [],
            createdBy: req.user._id,
            status: status || 'published'
        });

        // Notify socket
        const io = req.app.get('io');
        if (io) {
            io.emit('homework:created', {
                homeworkId: assignment._id,
                title: assignment.title,
                batchId: batch._id,
                batchName: batch.name
            });
        }

        res.status(201).json({
            success: true,
            message: 'Homework assigned successfully!',
            data: assignment
        });
    } catch (error) {
        console.error('[mentorOffline:createHomework] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create homework' });
    }
};

// @desc    Update homework assignment
// @route   PUT /api/mentor/offline/homework/:id
// @access  Private (mentor, admin)
const updateHomework = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Homework assignment not found' });
        }

        const { title, description, dueDate, maxMarks, status, attachments } = req.body;
        if (title) assignment.title = title.trim();
        if (description !== undefined) assignment.description = description;
        if (dueDate) assignment.dueDate = new Date(dueDate);
        if (maxMarks) {
            assignment.maxMarks = Number(maxMarks);
            assignment.maxPoints = Number(maxMarks);
        }
        if (status) assignment.status = status;
        if (Array.isArray(attachments)) assignment.attachments = attachments;

        await assignment.save();

        res.json({
            success: true,
            message: 'Homework updated successfully!',
            data: assignment
        });
    } catch (error) {
        console.error('[mentorOffline:updateHomework] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Update failed' });
    }
};

// @desc    Delete homework assignment
// @route   DELETE /api/mentor/offline/homework/:id
// @access  Private (mentor, admin)
const deleteHomework = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Homework not found' });
        }

        await Assignment.deleteOne({ _id: assignment._id });
        await Submission.deleteMany({ assignment: assignment._id });

        res.json({
            success: true,
            message: 'Homework deleted successfully!'
        });
    } catch (error) {
        console.error('[mentorOffline:deleteHomework] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete homework' });
    }
};

// @desc    Get student submissions for a homework assignment
// @route   GET /api/mentor/offline/homework/:id/submissions
// @access  Private (mentor, admin)
const getHomeworkSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id).populate('batch', 'name code');
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        const submissions = await Submission.find({ assignment: assignment._id })
            .populate('student', 'name offlineRollNo email grade section')
            .sort({ submittedAt: -1 });

        const formatted = submissions.map(s => ({
            _id: s._id,
            student: s.student ? {
                _id: s.student._id,
                name: s.student.name,
                offlineRollNo: s.student.offlineRollNo || 'Pending',
                grade: s.student.grade,
                section: s.student.section,
                email: s.student.email
            } : null,
            content: s.content,
            fileUrl: s.fileUrl || (s.attachments?.[0]?.url),
            submittedAt: s.submittedAt,
            status: s.status === 'graded' ? 'Graded' : 'Submitted',
            marksObtained: s.marksObtained !== undefined ? s.marksObtained : s.grade,
            feedback: s.feedback || ''
        })).filter(s => s.student !== null);

        res.json({
            success: true,
            data: {
                assignment: {
                    _id: assignment._id,
                    title: assignment.title,
                    dueDate: assignment.dueDate,
                    maxMarks: assignment.maxMarks || assignment.maxPoints || 100,
                    batchName: assignment.batch?.name || 'Offline Batch'
                },
                submissions: formatted
            }
        });
    } catch (error) {
        console.error('[mentorOffline:getHomeworkSubmissions] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
    }
};

// @desc    Evaluate and grade a student homework submission
// @route   POST /api/mentor/offline/homework/:id/grade
// @access  Private (mentor, admin)
const gradeHomework = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const { studentId, marksObtained, feedback } = req.body;

        if (!studentId || marksObtained === undefined) {
            return res.status(400).json({ success: false, message: 'Student ID and marks are required' });
        }

        const submission = await Submission.findOne({
            assignment: assignmentId,
            student: studentId
        });

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission record not found' });
        }

        submission.marksObtained = Number(marksObtained);
        submission.grade = Number(marksObtained);
        submission.feedback = feedback || 'Evaluated by offline mentor';
        submission.status = 'graded';
        submission.gradedBy = req.user._id;
        submission.gradedAt = new Date();
        await submission.save();

        const assignment = await Assignment.findById(assignmentId);

        // Send notification to student
        await Notification.create({
            recipient: studentId,
            type: 'info',
            title: 'Homework Evaluated',
            message: `Your homework "${assignment?.title || 'Assignment'}" has been graded: ${marksObtained}/${assignment?.maxMarks || 100}. Feedback: "${submission.feedback}".`
        });

        // Emit socket event to student
        const io = req.app.get('io');
        if (io) {
            io.to(studentId.toString()).emit('assignment:graded', {
                assignmentId,
                marksObtained,
                feedback: submission.feedback
            });
        }

        res.json({
            success: true,
            message: 'Homework graded successfully!',
            data: submission
        });
    } catch (error) {
        console.error('[mentorOffline:gradeHomework] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Grading failed' });
    }
};

// @desc    Get offline class materials for mentor batches
// @route   GET /api/mentor/offline/materials
// @access  Private (mentor, admin)
const getMaterials = async (req, res) => {
    try {
        const { batchId } = req.query;
        const query = {};

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        } else {
            const batchQuery = await getMentorBatchesQuery(req);
            const batches = await Batch.find(batchQuery).select('_id');
            query.batch = { $in: batches.map(b => b._id) };
        }

        const materials = await Material.find(query)
            .populate('batch', 'name code')
            .populate('school', 'name code')
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: materials
        });
    } catch (error) {
        console.error('[mentorOffline:getMaterials] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch materials' });
    }
};

// @desc    Upload / create class material
// @route   POST /api/mentor/offline/materials
// @access  Private (mentor, admin)
const uploadMaterial = async (req, res) => {
    try {
        const { title, description, batchId, moduleName, fileUrl, fileName, fileType, linkUrl } = req.body;

        if (!title || !batchId) {
            return res.status(400).json({ success: false, message: 'Title and batch are required.' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Classroom batch not found' });
        }

        let finalUrl = fileUrl || linkUrl;
        let finalName = fileName || title;
        let finalType = fileType || 'pdf';

        if (req.file) {
            finalUrl = `/uploads/assignments/${req.file.filename}`;
            finalName = req.file.originalname;
            const ext = req.file.originalname.split('.').pop().toLowerCase();
            if (['pdf'].includes(ext)) finalType = 'pdf';
            else if (['ppt', 'pptx'].includes(ext)) finalType = 'ppt';
            else if (['doc', 'docx'].includes(ext)) finalType = 'doc';
            else if (['py', 'ino', 'cpp', 'c', 'js', 'html', 'css'].includes(ext)) finalType = 'code';
            else if (['png', 'jpg', 'jpeg', 'svg'].includes(ext)) finalType = 'image';
            else finalType = 'other';
        }

        if (!finalUrl) {
            return res.status(400).json({ success: false, message: 'A file or URL link is required.' });
        }

        const material = await Material.create({
            title: title.trim(),
            description: description || '',
            school: batch.school || req.user.school,
            batch: batch._id,
            moduleName: moduleName || 'Hands-on Lab Experiments',
            fileUrl: finalUrl,
            fileName: finalName,
            fileType: finalType,
            uploadedBy: req.user._id,
            status: 'published'
        });

        // Notify socket
        const io = req.app.get('io');
        if (io) {
            io.emit('material:published', {
                materialId: material._id,
                title: material.title,
                batchId: batch._id,
                batchName: batch.name
            });
        }

        res.status(201).json({
            success: true,
            message: 'Class material published successfully!',
            data: material
        });
    } catch (error) {
        console.error('[mentorOffline:uploadMaterial] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to upload material' });
    }
};

// @desc    Delete class material
// @route   DELETE /api/mentor/offline/materials/:id
// @access  Private (mentor, admin)
const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }

        await Material.deleteOne({ _id: material._id });

        res.json({
            success: true,
            message: 'Material deleted successfully!'
        });
    } catch (error) {
        console.error('[mentorOffline:deleteMaterial] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete material' });
    }
};

// @desc    Get class guides / teaching notes for mentor batches
// @route   GET /api/mentor/offline/class-guides
// @access  Private (mentor, admin)
const getClassGuides = async (req, res) => {
    try {
        const { batchId } = req.query;
        const query = {};

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        } else {
            const batchQuery = await getMentorBatchesQuery(req);
            const batches = await Batch.find(batchQuery).select('_id');
            query.batch = { $in: batches.map(b => b._id) };
        }

        const guides = await ClassGuide.find(query)
            .populate('batch', 'name code')
            .populate('school', 'name code')
            .sort({ sessionDate: -1, createdAt: -1 });

        res.json({
            success: true,
            data: guides
        });
    } catch (error) {
        console.error('[mentorOffline:getClassGuides] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch class guides' });
    }
};

// @desc    Create new class guide / teaching note
// @route   POST /api/mentor/offline/class-guides
// @access  Private (mentor, admin)
const createClassGuide = async (req, res) => {
    try {
        const {
            topic,
            objective,
            batchId,
            teachingPlan,
            activities,
            resources,
            practicalTask,
            homework,
            expectedOutcome,
            mentorNotes,
            sessionDate,
            isStudentVisible
        } = req.body;

        if (!topic || !objective || !batchId) {
            return res.status(400).json({ success: false, message: 'Topic, objective, and batch are required.' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const guide = await ClassGuide.create({
            topic: topic.trim(),
            objective: objective.trim(),
            school: batch.school || req.user.school,
            batch: batch._id,
            teachingPlan: Array.isArray(teachingPlan) ? teachingPlan : (teachingPlan ? [teachingPlan] : []),
            activities: Array.isArray(activities) ? activities : (activities ? [activities] : []),
            resources: Array.isArray(resources) ? resources : (resources ? [resources] : []),
            practicalTask: practicalTask || '',
            homework: homework || '',
            expectedOutcome: expectedOutcome || '',
            mentorNotes: mentorNotes || '',
            sessionDate: sessionDate ? new Date(sessionDate) : new Date(),
            mentor: req.user._id,
            isStudentVisible: !!isStudentVisible
        });

        res.status(201).json({
            success: true,
            message: 'Class teaching guide saved successfully!',
            data: guide
        });
    } catch (error) {
        console.error('[mentorOffline:createClassGuide] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create class guide' });
    }
};

// @desc    Update class guide
// @route   PUT /api/mentor/offline/class-guides/:id
// @access  Private (mentor, admin)
const updateClassGuide = async (req, res) => {
    try {
        const guide = await ClassGuide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Class guide not found' });
        }

        const fields = [
            'topic', 'objective', 'teachingPlan', 'activities',
            'resources', 'practicalTask', 'homework', 'expectedOutcome',
            'mentorNotes', 'sessionDate', 'isStudentVisible'
        ];

        fields.forEach(f => {
            if (req.body[f] !== undefined) {
                guide[f] = req.body[f];
            }
        });

        await guide.save();

        res.json({
            success: true,
            message: 'Class guide updated successfully!',
            data: guide
        });
    } catch (error) {
        console.error('[mentorOffline:updateClassGuide] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Update failed' });
    }
};

// @desc    Delete class guide
// @route   DELETE /api/mentor/offline/class-guides/:id
// @access  Private (mentor, admin)
const deleteClassGuide = async (req, res) => {
    try {
        const guide = await ClassGuide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Class guide not found' });
        }

        await ClassGuide.deleteOne({ _id: guide._id });

        res.json({
            success: true,
            message: 'Class guide deleted successfully!'
        });
    } catch (error) {
        console.error('[mentorOffline:deleteClassGuide] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete class guide' });
    }
};

// @desc    Get pending student registrations for mentor/admin review
// @route   GET /api/mentor/offline/pending-students
// @access  Private (mentor, admin)
const getPendingStudents = async (req, res) => {
    try {
        const { schoolId } = req.query;
        const query = {
            role: 'school_student',
            approvalStatus: 'pending'
        };

        if (schoolId) {
            query.school = schoolId;
        }

        const pending = await User.find(query)
            .select('-password -sessionToken')
            .populate('school', 'name code city')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: pending
        });
    } catch (error) {
        console.error('[mentorOffline:getPendingStudents] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch pending students' });
    }
};

// @desc    Mentor approves student registration and allots batch
// @route   POST /api/mentor/offline/approve-student
// @access  Private (mentor, admin)
const approveStudent = async (req, res) => {
    try {
        const { studentId, batchId } = req.body;

        if (!studentId || !batchId) {
            return res.status(400).json({ success: false, message: 'Student ID and Batch ID are required for approval.' });
        }

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student record not found.' });
        }

        const batch = await Batch.findById(batchId).populate('school');
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Classroom batch not found.' });
        }

        // Resolve school from batch or student
        let school = batch.school;
        if (!school && student.school) {
            school = await School.findById(student.school);
        }

        // Generate unique roll number [SchoolCode]-[BatchCode]-[001]
        const rollNumber = await generateUniqueRollNumber(school, batch);

        if (!student.studentId) {
            student.studentId = await generateStudentId();
        }
        student.approvalStatus = 'approved';
        student.approvedAt = new Date();
        student.approvedBy = req.user._id;
        student.batch = batch._id;
        student.offlineRollNo = rollNumber;
        if (school && !student.school) {
            student.school = school._id;
        }
        await student.save();

        // Add student to batch students list
        await Batch.updateOne({ _id: batch._id }, { $addToSet: { students: student._id } });

        // Create student approval notification
        await Notification.create({
            recipient: student._id,
            type: 'success',
            title: 'Registration Approved & Batch Allotted!',
            message: `Congratulations! You have been approved for "${batch.name}". Your official roll number is ${rollNumber}.`
        });

        // Emit socket event if io available
        const io = req.app.get('io');
        if (io) {
            io.to(student._id.toString()).emit('student:approved', {
                studentId: student._id,
                rollNumber,
                batchName: batch.name
            });
        }

        res.json({
            success: true,
            message: `Student approved! Assigned Roll Number: ${rollNumber}`,
            data: {
                _id: student._id,
                name: student.name,
                email: student.email,
                offlineRollNo: rollNumber,
                approvalStatus: 'approved',
                batchName: batch.name,
                batchId: batch._id
            }
        });
    } catch (error) {
        console.error('[mentorOffline:approveStudent] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Approval failed' });
    }
};

// @desc    Get mentor profile
// @route   GET /api/mentor/offline/profile
// @access  Private (mentor, admin)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password -sessionToken')
            .populate('school', 'name code');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

// @desc    Update mentor profile / password
// @route   PUT /api/mentor/offline/profile
// @access  Private (mentor, admin)
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { name, mobileNumber, password } = req.body;
        if (name) user.name = name.trim();
        if (mobileNumber) user.mobileNumber = mobileNumber.trim();
        if (password) {
            user.password = password; // Pre-save hook will hash
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully!',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                role: user.role
            }
        });
    } catch (error) {
        console.error('[mentorOffline:updateProfile] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

module.exports = {
    getDashboardStats,
    getMyBatches,
    getBatchById,
    getStudents,
    getStudentProfile,
    getAttendanceLogs,
    markAttendance,
    getAttendanceAnalytics,
    updateAttendanceLog,
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getQuizResponses,
    getQuizResponseDetail,
    getHomework,
    createHomework,
    updateHomework,
    deleteHomework,
    getHomeworkSubmissions,
    gradeHomework,
    getMaterials,
    uploadMaterial,
    deleteMaterial,
    getClassGuides,
    createClassGuide,
    updateClassGuide,
    deleteClassGuide,
    getPendingStudents,
    approveStudent,
    getProfile,
    updateProfile
};
