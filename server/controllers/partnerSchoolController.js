const PartnerSchool = require('../models/PartnerSchool');
const OfflineBatch = require('../models/OfflineBatch');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const OfflineAssignment = require('../models/OfflineAssignment');
const SupportTicket = require('../models/SupportTicket');

// Helper function: Generate automatic structured Roll Number [2 Letters School]-[3 Letters Batch]-[001]
const generateFormattedRollNo = async (schoolId, batchId, manualRollNo = null, offsetIndex = 0) => {
    if (manualRollNo && manualRollNo.trim().length > 0) {
        return manualRollNo.trim().toUpperCase();
    }

    let schoolPrefix = 'FL';
    if (schoolId) {
        const school = await PartnerSchool.findById(schoolId);
        if (school && school.name) {
            const cleanName = school.name.replace(/[^a-zA-Z]/g, '').toUpperCase();
            if (cleanName.length >= 2) {
                schoolPrefix = cleanName.substring(0, 2);
            }
        }
    }

    let batchPrefix = 'BAT';
    if (batchId) {
        const batch = await OfflineBatch.findById(batchId);
        if (batch && batch.name) {
            const cleanBatch = batch.name.replace(/[^a-zA-Z]/g, '').toUpperCase();
            if (cleanBatch.length >= 3) {
                batchPrefix = cleanBatch.substring(0, 3);
            } else if (cleanBatch.length > 0) {
                batchPrefix = cleanBatch.padEnd(3, 'X');
            }
        }
    }

    const existingCount = await User.countDocuments({ schoolId, batchId, role: 'school_student' });
    const seq = (existingCount + 1 + offsetIndex).toString().padStart(3, '0');

    return `${schoolPrefix}-${batchPrefix}-${seq}`;
};

// @desc Auto-preview generated roll number for batch
// @route GET /api/partner-school/generate-rollno
const previewRollNo = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { batchId } = req.query;
        const generatedRollNo = await generateFormattedRollNo(schoolId, batchId);
        res.json({ success: true, rollNo: generatedRollNo });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get school overview stats with strict hierarchical multi-tenant scoping
// @route GET /api/partner-school/stats
const getSchoolStats = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const school = schoolId ? await PartnerSchool.findById(schoolId) : null;

        const totalBatches = schoolId ? await OfflineBatch.countDocuments({ schoolId }) : 0;
        const totalStudents = schoolId ? await User.countDocuments({ schoolId, role: 'school_student' }) : 0;
        
        const attendanceDocs = schoolId ? await Attendance.find({ schoolId }) : [];
        let totalRecords = 0;
        let presentRecords = 0;
        attendanceDocs.forEach(doc => {
            doc.records.forEach(r => {
                totalRecords++;
                if (r.status === 'present' || r.status === 'late') presentRecords++;
            });
        });
        const attendanceRate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

        const totalQuizzes = schoolId ? await Quiz.countDocuments({ schoolId }) : 0;
        const totalAssignments = schoolId ? await OfflineAssignment.countDocuments({ schoolId }) : 0;

        res.json({
            success: true,
            data: {
                schoolName: school ? school.name : 'Partner School',
                schoolCode: school ? school.code : 'SCH-OFFLINE',
                partnershipStatus: school ? school.partnershipStatus : 'Active',
                studentQuota: school ? school.studentQuota : 500,
                totalBatches,
                totalStudents,
                attendanceRate,
                totalQuizzes,
                totalAssignments
            }
        });
    } catch (error) {
        console.error('Error fetching partner school stats:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get offline batches strictly scoped for partner school
// @route GET /api/partner-school/batches
const getSchoolBatches = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const batches = await OfflineBatch.find({ schoolId }).populate('mentorId', 'name email');
        res.json({ success: true, data: batches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Create offline batch strictly scoped under schoolId
// @route POST /api/partner-school/batches
const createSchoolBatch = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { name, code, subject, scheduleDays, scheduleTime, roomVenue } = req.body;

        const batch = await OfflineBatch.create({
            name,
            code: code || `BATCH-${Date.now().toString().slice(-4)}`,
            schoolId,
            subject,
            scheduleDays: scheduleDays || ['Mon', 'Wed'],
            scheduleTime: scheduleTime || '10:00 AM - 11:30 AM',
            roomVenue: roomVenue || 'Lab 101'
        });

        await PartnerSchool.findByIdAndUpdate(schoolId, { $inc: { activeBatchesCount: 1 } });

        res.status(201).json({ success: true, data: batch });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Get school offline student roster with optional batchId filter
// @route GET /api/partner-school/students
const getSchoolStudents = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { batchId } = req.query;
        const query = { schoolId, role: 'school_student' };
        if (batchId && batchId !== 'all') {
            query.batchId = batchId;
        }

        const students = await User.find(query)
            .populate('batchId', 'name code subject roomVenue')
            .select('-password')
            .sort({ offlineRollNo: 1 });

        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Register single school student with automatic structured roll number
// @route POST /api/partner-school/students
const registerStudent = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { name, email, password, batchId, offlineRollNo, grade } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const formattedRollNo = await generateFormattedRollNo(schoolId, batchId, offlineRollNo);

        const student = await User.create({
            name,
            email,
            password: password || 'password123',
            role: 'school_student',
            schoolId,
            batchId,
            offlineRollNo: formattedRollNo,
            grade: grade || 'Grade 10',
            provider: 'local'
        });

        if (batchId) {
            await OfflineBatch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: 1 } });
        }

        const io = req.app.get('io');
        if (io) {
            io.emit('new-offline-student', { name: student.name, rollNo: student.offlineRollNo, batchId });
        }

        res.status(201).json({
            success: true,
            data: {
                id: student._id,
                name: student.name,
                email: student.email,
                offlineRollNo: student.offlineRollNo,
                grade: student.grade,
                batchId: student.batchId
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Bulk register school students with automatic sequential structured roll numbers
// @route POST /api/partner-school/students/bulk
const bulkRegisterStudents = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { batchId, students } = req.body;

        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide a non-empty array of students' });
        }

        const createdStudents = [];
        let duplicateCount = 0;

        for (let i = 0; i < students.length; i++) {
            const item = students[i];
            const existing = await User.findOne({ email: item.email.toLowerCase().trim() });
            if (existing) {
                duplicateCount++;
                continue;
            }

            const formattedRollNo = await generateFormattedRollNo(schoolId, batchId, item.offlineRollNo, createdStudents.length);

            const student = await User.create({
                name: item.name,
                email: item.email.toLowerCase().trim(),
                password: item.password || 'password123',
                role: 'school_student',
                schoolId,
                batchId,
                offlineRollNo: formattedRollNo,
                grade: item.grade || 'Grade 10',
                provider: 'local'
            });

            createdStudents.push(student);
        }

        if (batchId && createdStudents.length > 0) {
            await OfflineBatch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: createdStudents.length } });
        }

        res.status(201).json({
            success: true,
            message: `Successfully enrolled ${createdStudents.length} students into batch with automatic roll numbers. (${duplicateCount} skipped as duplicates)`,
            data: createdStudents
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Get attendance logs strictly scoped by schoolId and optional batchId
// @route GET /api/partner-school/attendance
const getAttendanceLogs = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { batchId } = req.query;
        const query = { schoolId };
        if (batchId && batchId !== 'all') {
            query.batchId = batchId;
        }

        const logs = await Attendance.find(query)
            .populate('batchId', 'name code roomVenue subject')
            .populate('records.studentId', 'name email offlineRollNo grade')
            .sort({ date: -1 });

        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Export attendance report summary scoped by schoolId & batchId
// @route GET /api/partner-school/attendance/export
const exportAttendanceReport = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { batchId } = req.query;
        const query = { schoolId };
        if (batchId && batchId !== 'all') {
            query.batchId = batchId;
        }

        const logs = await Attendance.find(query)
            .populate('batchId', 'name code subject')
            .populate('records.studentId', 'name email offlineRollNo grade')
            .sort({ date: -1 });

        const rows = [];
        logs.forEach(log => {
            log.records.forEach(rec => {
                rows.push({
                    date: log.date,
                    batchName: log.batchId ? log.batchId.name : 'N/A',
                    batchCode: log.batchId ? log.batchId.code : 'N/A',
                    topicCovered: log.topicCovered || '',
                    studentName: rec.studentId ? rec.studentId.name : 'Unknown',
                    offlineRollNo: rec.studentId ? rec.studentId.offlineRollNo : '',
                    grade: rec.studentId ? rec.studentId.grade : '',
                    status: rec.status,
                    remarks: rec.remarks || ''
                });
            });
        });

        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get quiz and assignment overview scoped by schoolId and batchId
// @route GET /api/partner-school/assessments
const getQuizAssignmentOverview = async (req, res) => {
    try {
        let schoolId = req.user.schoolId;
        if (!schoolId) {
            const firstSchool = await PartnerSchool.findOne();
            if (firstSchool) schoolId = firstSchool._id;
        }

        const { batchId } = req.query;
        const query = { schoolId };
        if (batchId && batchId !== 'all') {
            query.batchId = batchId;
        }

        const quizzes = await Quiz.find(query).populate('batchId', 'name code subject');
        const assignments = await OfflineAssignment.find(query)
            .populate('batchId', 'name code subject')
            .populate('submissions.studentId', 'name email offlineRollNo grade');

        res.json({ success: true, data: { quizzes, assignments } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Grade student homework submission
// @route POST /api/partner-school/assignments/:id/grade
const gradeAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const { studentId, marksObtained, feedback } = req.body;

        const assignment = await OfflineAssignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        const subIndex = assignment.submissions.findIndex(s => s.studentId.toString() === studentId.toString());
        if (subIndex === -1) {
            return res.status(404).json({ success: false, message: 'Student submission not found' });
        }

        assignment.submissions[subIndex].marksObtained = Number(marksObtained);
        assignment.submissions[subIndex].feedback = feedback || '';
        assignment.submissions[subIndex].status = 'Graded';

        await assignment.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('assignment-graded', { assignmentId, studentId, marksObtained });
        }

        res.json({ success: true, message: 'Submission graded successfully', data: assignment.submissions[subIndex] });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Submit help/support ticket for partner school
// @route POST /api/partner-school/support
const submitSupportTicket = async (req, res) => {
    try {
        const { subject, issue, priority } = req.body;

        const ticket = await SupportTicket.create({
            student: req.user._id,
            subject: `[Partner School] ${subject}`,
            issue,
            priority: priority || 'medium',
            messages: [{
                sender: req.user._id,
                text: issue
            }]
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('new-support-ticket', { id: ticket._id, subject: ticket.subject });
        }

        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSchoolStats,
    getSchoolBatches,
    createSchoolBatch,
    getSchoolStudents,
    registerStudent,
    bulkRegisterStudents,
    previewRollNo,
    getAttendanceLogs,
    exportAttendanceReport,
    getQuizAssignmentOverview,
    gradeAssignment,
    submitSupportTicket
};
