const User = require('../models/User');
const School = require('../models/School');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const SupportTicket = require('../models/SupportTicket');
const { generateUniqueRollNumber } = require('../utils/rollNumberGenerator');
const crypto = require('crypto');

// Helper to resolve school for coordinator
async function resolveCoordinatorSchool(req) {
    if (req.user.role === 'admin') {
        const schoolId = req.query.schoolId || req.body.schoolId;
        if (schoolId) {
            const s = await School.findById(schoolId);
            if (s) return s;
        }
        return await School.findOne({ isActive: true });
    }

    if (req.user.school) {
        const s = await School.findById(req.user.school);
        if (s) return s;
    }

    // Check if coordinator is in coordinators array of any school
    return await School.findOne({ coordinators: req.user._id });
}

// @desc    Get dashboard statistics for partner school
// @route   GET /api/partner-school/stats
// @access  Private (school_coordinator, admin)
const getStats = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with coordinator account' });
        }

        const batches = await Batch.find({ school: school._id });
        const batchIds = batches.map(b => b._id);

        const totalStudents = await User.countDocuments({
            school: school._id,
            role: 'school_student'
        });

        // Calculate attendance rate
        const attendanceLogs = await Attendance.find({ batch: { $in: batchIds } });
        let totalRecordsCount = 0;
        let presentRecordsCount = 0;

        attendanceLogs.forEach(log => {
            log.records.forEach(r => {
                totalRecordsCount++;
                if (r.status === 'present' || r.status === 'late') {
                    presentRecordsCount++;
                }
            });
        });

        const attendanceRate = totalRecordsCount > 0
            ? Math.round((presentRecordsCount / totalRecordsCount) * 100)
            : 0;

        const totalQuizzes = await Quiz.countDocuments({
            $or: [{ school: school._id }, { batch: { $in: batchIds } }]
        });

        const totalAssignments = await Assignment.countDocuments({
            $or: [{ school: school._id }, { batch: { $in: batchIds } }]
        });

        res.json({
            success: true,
            data: {
                schoolName: school.name,
                schoolCode: school.code,
                totalBatches: batches.length,
                totalStudents,
                studentQuota: school.studentQuota || 500,
                attendanceRate,
                totalQuizzes,
                totalAssignments
            }
        });
    } catch (error) {
        console.error('[partnerSchool:getStats] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to load school stats' });
    }
};

// @desc    Get all batches for partner school
// @route   GET /api/partner-school/batches
// @access  Private (school_coordinator, admin)
const getBatches = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const batches = await Batch.find({ school: school._id })
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 });

        const batchData = await Promise.all(batches.map(async (b) => {
            const count = await User.countDocuments({ batch: b._id, role: 'school_student' });
            return {
                _id: b._id,
                name: b.name,
                code: b.code || 'BATCH',
                subject: b.subject || 'Robotics & STEM Lab',
                scheduleDays: b.scheduleDays || ['Mon', 'Wed'],
                scheduleTime: b.scheduleTime || '10:00 AM - 11:30 AM',
                roomVenue: b.roomVenue || 'Lab 101',
                mentorId: b.instructor ? { name: b.instructor.name, email: b.instructor.email } : null,
                enrolledCount: count
            };
        }));

        res.json({ success: true, data: batchData });
    } catch (error) {
        console.error('[partnerSchool:getBatches] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch batches' });
    }
};

// @desc    Create new batch for partner school
// @route   POST /api/partner-school/batches
// @access  Private (school_coordinator, admin)
const createBatch = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const { name, code, subject, scheduleDays, scheduleTime, roomVenue } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Batch section name is required' });
        }

        const batch = await Batch.create({
            name: name.trim(),
            code: code ? code.trim().toUpperCase() : 'B' + Math.floor(100 + Math.random() * 900),
            school: school._id,
            subject: subject ? subject.trim() : 'Robotics & STEM Lab',
            scheduleDays: Array.isArray(scheduleDays) ? scheduleDays : (scheduleDays ? scheduleDays.split(',').map(s => s.trim()) : ['Mon', 'Wed']),
            scheduleTime: scheduleTime ? scheduleTime.trim() : '10:00 AM - 11:30 AM',
            roomVenue: roomVenue ? roomVenue.trim() : 'Lab 101',
            instructor: req.user._id,
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Batch configured successfully!',
            data: batch
        });
    } catch (error) {
        console.error('[partnerSchool:createBatch] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to create batch' });
    }
};

// @desc    Get students enrolled in partner school
// @route   GET /api/partner-school/students
// @access  Private (school_coordinator, admin)
const getStudents = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const { batchId, search, grade, section, approvalStatus } = req.query;

        const query = {
            school: school._id,
            role: 'school_student'
        };

        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        }
        if (grade) query.grade = grade;
        if (section) query.section = section;
        if (approvalStatus) query.approvalStatus = approvalStatus;

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
            .sort({ createdAt: -1 });

        const formatted = students.map(s => ({
            _id: s._id,
            name: s.name,
            email: s.email,
            offlineRollNo: s.offlineRollNo || 'Pending Allotment',
            grade: s.grade || 'Grade 10',
            section: s.section || 'A',
            fatherName: s.fatherName || 'N/A',
            fatherMobile: s.fatherMobile || '',
            studentMobile: s.studentMobile || '',
            batchId: s.batch ? { _id: s.batch._id, name: s.batch.name } : null,
            approvalStatus: s.approvalStatus === 'approved' ? 'Approved' : 'Pending Batch'
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('[partnerSchool:getStudents] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch students' });
    }
};

// @desc    Register a single student from partner school coordinator portal
// @route   POST /api/partner-school/students
// @access  Private (school_coordinator, admin)
const createStudent = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const {
            name,
            email,
            grade,
            section,
            fatherName,
            studentMobile,
            fatherMobile,
            batchId,
            password
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        let assignedBatch = null;
        let rollNumber = null;
        let approvalStatus = 'pending';

        if (batchId) {
            assignedBatch = await Batch.findById(batchId);
            if (assignedBatch) {
                rollNumber = await generateUniqueRollNumber(school, assignedBatch);
                approvalStatus = 'approved';
            }
        }

        const rawPassword = password || 'FloydSchool@123';
        const sessionToken = crypto.randomBytes(16).toString('hex');

        const student = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: rawPassword,
            role: 'school_student',
            grade: grade || 'Grade 10',
            section: section || 'A',
            fatherName: fatherName ? fatherName.trim() : '',
            studentMobile: studentMobile ? studentMobile.trim() : '',
            fatherMobile: fatherMobile ? fatherMobile.trim() : '',
            mobileNumber: studentMobile ? studentMobile.trim() : '',
            school: school._id,
            batch: assignedBatch ? assignedBatch._id : null,
            offlineRollNo: rollNumber,
            approvalStatus,
            approvedAt: approvalStatus === 'approved' ? new Date() : null,
            approvedBy: req.user._id,
            sessionToken
        });

        if (assignedBatch) {
            await Batch.updateOne({ _id: assignedBatch._id }, { $addToSet: { students: student._id } });
        }

        res.status(201).json({
            success: true,
            message: 'Student registered successfully!',
            data: student
        });
    } catch (error) {
        console.error('[partnerSchool:createStudent] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Registration failed' });
    }
};

// @desc    Bulk CSV import of students
// @route   POST /api/partner-school/students/bulk
// @access  Private (school_coordinator, admin)
const bulkImportStudents = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const { students } = req.body;
        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ success: false, message: 'No student records provided for bulk import' });
        }

        // Validate duplicates within the uploaded list
        const emailsInPayload = new Set();
        for (const s of students) {
            if (!s.name || !s.email) {
                return res.status(400).json({ success: false, message: 'Every record must include student name and email.' });
            }
            const cleanEmail = s.email.toLowerCase().trim();
            if (emailsInPayload.has(cleanEmail)) {
                return res.status(400).json({ success: false, message: `Duplicate email "${cleanEmail}" found in upload file.` });
            }
            emailsInPayload.add(cleanEmail);
        }

        // Check if any email exists in database
        const existingUsers = await User.find({ email: { $in: Array.from(emailsInPayload) } }).select('email');
        if (existingUsers.length > 0) {
            const existingEmails = existingUsers.map(u => u.email).join(', ');
            return res.status(400).json({
                success: false,
                message: `Import blocked: The following emails are already registered in the system: ${existingEmails}`
            });
        }

        const createdStudents = [];
        for (const s of students) {
            let assignedBatch = null;
            let rollNo = null;
            let approvalStatus = 'pending';

            if (s.batchId) {
                assignedBatch = await Batch.findById(s.batchId);
                if (assignedBatch) {
                    rollNo = await generateUniqueRollNumber(school, assignedBatch);
                    approvalStatus = 'approved';
                }
            }

            const sessionToken = crypto.randomBytes(16).toString('hex');
            const newStudent = await User.create({
                name: s.name.trim(),
                email: s.email.toLowerCase().trim(),
                password: s.password || 'FloydSchool@123',
                role: 'school_student',
                grade: s.grade || 'Grade 10',
                section: s.section || 'A',
                fatherName: s.fatherName ? s.fatherName.trim() : '',
                studentMobile: s.studentMobile ? s.studentMobile.trim() : '',
                fatherMobile: s.fatherMobile ? s.fatherMobile.trim() : '',
                mobileNumber: s.studentMobile ? s.studentMobile.trim() : '',
                school: school._id,
                batch: assignedBatch ? assignedBatch._id : null,
                offlineRollNo: rollNo,
                approvalStatus,
                approvedAt: approvalStatus === 'approved' ? new Date() : null,
                approvedBy: req.user._id,
                sessionToken
            });

            if (assignedBatch) {
                await Batch.updateOne({ _id: assignedBatch._id }, { $addToSet: { students: newStudent._id } });
            }

            createdStudents.push(newStudent);
        }

        res.status(201).json({
            success: true,
            message: `Successfully imported ${createdStudents.length} students!`,
            count: createdStudents.length,
            data: createdStudents
        });
    } catch (error) {
        console.error('[partnerSchool:bulkImportStudents] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Bulk import failed' });
    }
};

// @desc    Get attendance logs for partner school
// @route   GET /api/partner-school/attendance
// @access  Private (school_coordinator, admin)
const getAttendance = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const { batchId } = req.query;
        const query = { school: school._id };
        if (batchId && batchId !== 'all') {
            query.batch = batchId;
        }

        const logs = await Attendance.find(query)
            .populate('batch', 'name code')
            .populate('records.student', 'name offlineRollNo grade section')
            .sort({ date: -1 });

        const formatted = logs.map(log => ({
            _id: log._id,
            date: log.date,
            batchId: log.batch ? { _id: log.batch._id, name: log.batch.name, code: log.batch.code } : null,
            topicCovered: log.topicCovered || 'Practical STEM Experiment',
            records: log.records.map(r => ({
                studentId: r.student ? {
                    _id: r.student._id,
                    name: r.student.name,
                    offlineRollNo: r.student.offlineRollNo || 'ST-001',
                    grade: r.student.grade || 'Grade 10',
                    section: r.student.section || 'A'
                } : null,
                status: r.status,
                remarks: r.remarks || ''
            })).filter(r => r.studentId !== null)
        }));

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('[partnerSchool:getAttendance] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance logs' });
    }
};

// @desc    Coordinator marks or updates attendance (Requirement 15)
// @route   POST /api/partner-school/attendance
// @access  Private (school_coordinator, admin)
const markAttendance = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const { batchId, date, topicCovered, records } = req.body;

        if (!batchId || !date || !Array.isArray(records)) {
            return res.status(400).json({ success: false, message: 'Batch, date, and student records are required.' });
        }

        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);

        const attendanceRecords = records.map(r => ({
            student: r.studentId || r.student,
            status: r.status || 'present',
            remarks: r.remarks || ''
        }));

        // Upsert attendance for this batch on this date
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
                school: school._id,
                batch: batchId,
                date: sessionDate,
                topicCovered: topicCovered || 'Practical STEM Experiment',
                markedBy: req.user._id,
                records: attendanceRecords
            });
        }

        res.json({
            success: true,
            message: 'Attendance recorded successfully!',
            data: log
        });
    } catch (error) {
        console.error('[partnerSchool:markAttendance] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to record attendance' });
    }
};

// @desc    Get assessment overview (quizzes & assignments) for school
// @route   GET /api/partner-school/assessments
// @access  Private (school_coordinator, admin)
const getAssessments = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const batches = await Batch.find({ school: school._id }).select('_id');
        const batchIds = batches.map(b => b._id);

        const quizzes = await Quiz.find({
            $or: [{ school: school._id }, { batch: { $in: batchIds } }]
        }).sort({ createdAt: -1 });

        const assignments = await Assignment.find({
            $or: [{ school: school._id }, { batch: { $in: batchIds } }]
        }).sort({ createdAt: -1 });

        const assignmentIds = assignments.map(a => a._id);
        const submissions = await Submission.find({ assignment: { $in: assignmentIds } })
            .populate('student', 'name offlineRollNo email grade section');

        const submissionMap = new Map();
        submissions.forEach(s => {
            const aId = s.assignment.toString();
            if (!submissionMap.has(aId)) submissionMap.set(aId, []);
            submissionMap.get(aId).push({
                studentId: s.student ? {
                    _id: s.student._id,
                    name: s.student.name,
                    offlineRollNo: s.student.offlineRollNo || 'ST-001'
                } : null,
                status: s.status === 'graded' ? 'Graded' : 'Submitted',
                marksObtained: s.marksObtained !== undefined ? s.marksObtained : s.grade,
                feedback: s.feedback || '',
                fileUrl: s.fileUrl || (s.attachments?.[0]?.url)
            });
        });

        const formattedAssignments = assignments.map(a => ({
            _id: a._id,
            title: a.title,
            description: a.description,
            maxMarks: a.maxMarks || a.maxPoints || 100,
            dueDate: a.dueDate,
            submissions: (submissionMap.get(a._id.toString()) || []).filter(sub => sub.studentId !== null)
        }));

        res.json({
            success: true,
            data: {
                quizzes,
                assignments: formattedAssignments
            }
        });
    } catch (error) {
        console.error('[partnerSchool:getAssessments] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to load assessments' });
    }
};

// @desc    Grade student homework submission
// @route   POST /api/partner-school/assignments/:id/grade
// @access  Private (school_coordinator, admin)
const gradeAssignment = async (req, res) => {
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
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        submission.marksObtained = Number(marksObtained);
        submission.grade = Number(marksObtained);
        submission.feedback = feedback || 'Evaluated by school coordinator';
        submission.status = 'graded';
        submission.gradedBy = req.user._id;
        submission.gradedAt = new Date();
        await submission.save();

        res.json({
            success: true,
            message: 'Homework graded successfully!',
            data: submission
        });
    } catch (error) {
        console.error('[partnerSchool:gradeAssignment] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Grading failed' });
    }
};

// @desc    Coordinator submits support request
// @route   POST /api/partner-school/support
// @access  Private (school_coordinator, admin)
const createSupportTicket = async (req, res) => {
    try {
        const { subject, issue } = req.body;
        if (!subject || !issue) {
            return res.status(400).json({ success: false, message: 'Subject and issue description are required.' });
        }

        const ticket = await SupportTicket.create({
            student: req.user._id, // References coordinator user
            subject: `[PartnerSchool] ${subject.trim()}`,
            issue: issue.trim(),
            status: 'open',
            priority: 'high'
        });

        res.status(201).json({
            success: true,
            message: 'Support request submitted to FloydSchool STEM Coordinators!',
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to submit support query' });
    }
};

// @desc    Get coordinator profile
// @route   GET /api/partner-school/profile
// @access  Private (school_coordinator, admin)
const getCoordinatorProfile = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        res.json({
            success: true,
            data: {
                user: {
                    _id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                    mobileNumber: req.user.mobileNumber
                },
                school: school ? {
                    _id: school._id,
                    name: school.name,
                    code: school.code,
                    city: school.city,
                    address: school.address,
                    academicYear: school.academicYear
                } : null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch coordinator profile' });
    }
};

// @desc    Promote students to next grade / academic year (Requirement 25)
// @route   POST /api/partner-school/promote-students
// @access  Private (school_coordinator, admin)
const promoteStudents = async (req, res) => {
    try {
        const school = await resolveCoordinatorSchool(req);
        if (!school) {
            return res.status(404).json({ success: false, message: 'No school associated with account' });
        }

        const { studentIds, targetGrade, targetAcademicYear } = req.body;
        if (!Array.isArray(studentIds) || studentIds.length === 0 || !targetGrade) {
            return res.status(400).json({ success: false, message: 'Student IDs and target grade are required.' });
        }

        const updateData = { grade: targetGrade };
        if (targetAcademicYear) updateData.academicYear = targetAcademicYear;

        const result = await User.updateMany(
            {
                _id: { $in: studentIds },
                school: school._id,
                role: 'school_student'
            },
            { $set: updateData }
        );

        res.json({
            success: true,
            message: `Successfully promoted ${result.modifiedCount} students to ${targetGrade}!`,
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('[partnerSchool:promoteStudents] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Promotion failed' });
    }
};

module.exports = {
    getStats,
    getBatches,
    createBatch,
    getStudents,
    createStudent,
    bulkImportStudents,
    getAttendance,
    markAttendance,
    getAssessments,
    gradeAssignment,
    createSupportTicket,
    getCoordinatorProfile,
    promoteStudents
};
