const OfflineBatch = require('../models/OfflineBatch');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Quiz = require('../models/Quiz');
const OfflineAssignment = require('../models/OfflineAssignment');
const PartnerSchool = require('../models/PartnerSchool');

// Helper function: Generate automatic structured Roll Number [2 Letters School]-[3 Letters Batch]-[001]
const generateFormattedRollNo = async (schoolId, batchId) => {
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

    const existingCount = await User.countDocuments({ schoolId, batchId, role: 'school_student', approvalStatus: 'Approved' });
    const seq = (existingCount + 1).toString().padStart(3, '0');

    return `${schoolPrefix}-${batchPrefix}-${seq}`;
};

// Helper function: Generate institutional login ID (name@floydschool.in) and random password
const generateInstitutionalCredentials = async (studentName) => {
    const cleanName = studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let baseEmail = `${cleanName}@floydschool.in`;

    let finalEmail = baseEmail;
    let counter = 1;
    while (await User.findOne({ email: finalEmail })) {
        finalEmail = `${cleanName}${counter}@floydschool.in`;
        counter++;
    }

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let randomPassword = 'FL#';
    for (let i = 0; i < 5; i++) {
        randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return { email: finalEmail, rawPassword: randomPassword };
};

// @desc Get offline batches assigned to mentor
// @route GET /api/mentor/offline/batches
const getMentorOfflineBatches = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { mentorId: req.user._id };
        let batches = await OfflineBatch.find(query)
            .populate('schoolId', 'name code city')
            .populate('mentorId', 'name email');

        if (batches.length === 0) {
            batches = await OfflineBatch.find({})
                .populate('schoolId', 'name code city')
                .populate('mentorId', 'name email');
        }

        res.json({ success: true, data: batches });
    } catch (error) {
        console.error('Error fetching mentor offline batches:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get pending student registrations awaiting batch allocation
// @route GET /api/mentor/offline/pending-students
const getPendingStudents = async (req, res) => {
    try {
        const pendingStudents = await User.find({ 
            role: 'school_student', 
            approvalStatus: 'Pending_Approval' 
        })
        .populate('schoolId', 'name code city')
        .sort({ createdAt: -1 });

        res.json({ success: true, data: pendingStudents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Approve pending student, select batch, generate primary key roll number AND self-generate name@floydschool.in credentials
// @route POST /api/mentor/offline/approve-student
const approveAndAssignBatch = async (req, res) => {
    try {
        const { studentId, batchId } = req.body;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const batch = await OfflineBatch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Offline batch not found' });
        }

        const schoolId = batch.schoolId || student.schoolId;

        // 1. Generate Primary Key Roll Number: [School2]-[Batch3]-[001]
        const primaryKeyRollNo = await generateFormattedRollNo(schoolId, batchId);

        // 2. Self-generate Institutional Credentials (name@floydschool.in + random password)
        const creds = await generateInstitutionalCredentials(student.name);

        student.email = creds.email;
        student.password = creds.rawPassword; // Hashed by User.js pre-save hook
        student.schoolId = schoolId;
        student.batchId = batchId;
        student.offlineRollNo = primaryKeyRollNo;
        student.approvalStatus = 'Approved';

        await student.save();

        await OfflineBatch.findByIdAndUpdate(batchId, { $inc: { enrolledCount: 1 } });

        const io = req.app.get('io');
        if (io) {
            io.emit('student-batch-assigned', { studentId: student._id, rollNo: primaryKeyRollNo, batchId, email: creds.email });
        }

        res.json({
            success: true,
            message: `Student ${student.name} approved! Login ID: ${creds.email} | Roll No: ${primaryKeyRollNo}`,
            data: {
                studentId: student._id,
                name: student.name,
                loginId: creds.email,
                generatedPassword: creds.rawPassword,
                offlineRollNo: primaryKeyRollNo,
                batchName: batch.name,
                approvalStatus: student.approvalStatus
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Get students for an offline batch
// @route GET /api/mentor/offline/batches/:batchId/students
const getBatchStudents = async (req, res) => {
    try {
        const { batchId } = req.params;
        const students = await User.find({ batchId, role: 'school_student' })
            .select('name email offlineRollNo grade section fatherName studentMobile fatherMobile')
            .sort({ offlineRollNo: 1 });

        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Mark daily attendance for an offline batch
// @route POST /api/mentor/offline/attendance
const markBatchAttendance = async (req, res) => {
    try {
        const { batchId, schoolId, date, topicCovered, records } = req.body;

        const batch = await OfflineBatch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Offline batch not found' });
        }

        const effectiveSchoolId = schoolId || batch.schoolId;

        const attendance = await Attendance.create({
            batchId,
            schoolId: effectiveSchoolId,
            date: date || new Date(),
            markedBy: req.user._id,
            topicCovered: topicCovered || 'STEM & AI Practical Session',
            records: records || []
        });

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Create quiz for offline batch
// @route POST /api/mentor/offline/quizzes
const createQuizForBatch = async (req, res) => {
    try {
        const { title, description, schoolId, batchId, questions, timeLimitMinutes, totalMarks } = req.body;

        const quiz = await Quiz.create({
            title,
            description,
            schoolId,
            batchId,
            questions,
            timeLimitMinutes: timeLimitMinutes || 20,
            totalMarks: totalMarks || 100,
            isPublished: true
        });

        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Create assignment for offline batch
// @route POST /api/mentor/offline/assignments
const createAssignmentForBatch = async (req, res) => {
    try {
        const { title, description, schoolId, batchId, dueDate, maxMarks } = req.body;

        const assignment = await OfflineAssignment.create({
            title,
            description,
            schoolId,
            batchId,
            dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            maxMarks: maxMarks || 100
        });

        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Update batch timetable and lab room venue in real-time
// @route PUT /api/mentor/offline/batches/:id/schedule
const updateBatchSchedule = async (req, res) => {
    try {
        const batchId = req.params.id;
        const { scheduleDays, scheduleTime, roomVenue, subject } = req.body;

        const batch = await OfflineBatch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Offline batch not found' });
        }

        if (scheduleDays) {
            batch.scheduleDays = Array.isArray(scheduleDays) 
                ? scheduleDays 
                : scheduleDays.split(',').map(s => s.trim());
        }
        if (scheduleTime) batch.scheduleTime = scheduleTime.trim();
        if (roomVenue) batch.roomVenue = roomVenue.trim();
        if (subject) batch.subject = subject.trim();

        await batch.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('batch-schedule-updated', { 
                batchId: batch._id, 
                scheduleDays: batch.scheduleDays, 
                scheduleTime: batch.scheduleTime, 
                roomVenue: batch.roomVenue 
            });
        }

        res.json({
            success: true,
            message: `Timetable & Room Venue for ${batch.name} updated successfully!`,
            data: batch
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Comprehensive Attendance Monitoring Analytics Software Engine
// @route GET /api/mentor/offline/attendance/analytics
const getAttendanceAnalytics = async (req, res) => {
    try {
        const query = req.user.role === 'admin' ? {} : { mentorId: req.user._id };
        const batches = await OfflineBatch.find(query).populate('schoolId', 'name code');
        const batchIds = batches.map(b => b._id);

        const attendanceLogs = await Attendance.find({ batchId: { $in: batchIds } })
            .populate('batchId', 'name code')
            .populate('schoolId', 'name code')
            .populate('records.studentId', 'name offlineRollNo grade section studentMobile fatherName fatherMobile')
            .sort({ date: -1 });

        // Calculate analytics
        let totalSessions = attendanceLogs.length;
        let totalStudentRecords = 0;
        let presentCount = 0;
        let lateCount = 0;
        let absentCount = 0;

        // Student-wise attendance aggregator
        const studentStatsMap = {};

        attendanceLogs.forEach(log => {
            log.records.forEach(rec => {
                const student = rec.studentId;
                if (!student) return;
                const sId = student._id.toString();

                if (!studentStatsMap[sId]) {
                    studentStatsMap[sId] = {
                        studentId: sId,
                        name: student.name,
                        offlineRollNo: student.offlineRollNo || 'ST-GRA-001',
                        grade: student.grade || 'Grade 10',
                        section: student.section || 'A',
                        studentMobile: student.studentMobile || 'N/A',
                        fatherName: student.fatherName || 'N/A',
                        fatherMobile: student.fatherMobile || 'N/A',
                        batchName: log.batchId?.name || 'Offline Batch',
                        totalMarked: 0,
                        attended: 0,
                        absent: 0
                    };
                }

                totalStudentRecords++;
                studentStatsMap[sId].totalMarked++;

                if (rec.status === 'present' || rec.status === 'late') {
                    if (rec.status === 'present') presentCount++;
                    if (rec.status === 'late') lateCount++;
                    studentStatsMap[sId].attended++;
                } else {
                    absentCount++;
                    studentStatsMap[sId].absent++;
                }
            });
        });

        // Students at risk (<75% attendance)
        const lowAttendanceStudents = Object.values(studentStatsMap)
            .map(s => ({
                ...s,
                rate: s.totalMarked > 0 ? Math.round((s.attended / s.totalMarked) * 100) : 100
            }))
            .filter(s => s.totalMarked >= 2 && s.rate < 75);

        const overallRate = totalStudentRecords > 0 ? Math.round(((presentCount + lateCount) / totalStudentRecords) * 100) : 0;

        res.json({
            success: true,
            data: {
                summary: {
                    totalSessions,
                    totalStudentRecords,
                    presentCount,
                    lateCount,
                    absentCount,
                    overallRate
                },
                lowAttendanceStudents,
                attendanceLogs
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Edit / Correct an attendance log record
// @route PUT /api/mentor/offline/attendance/:logId
const updateAttendanceRecord = async (req, res) => {
    try {
        const { logId } = req.params;
        const { studentId, status, topicCovered, remarks } = req.body;

        const attendanceLog = await Attendance.findById(logId);
        if (!attendanceLog) {
            return res.status(404).json({ success: false, message: 'Attendance record log not found' });
        }

        if (topicCovered) attendanceLog.topicCovered = topicCovered.trim();

        if (studentId && status) {
            const rec = attendanceLog.records.find(r => r.studentId.toString() === studentId.toString());
            if (rec) {
                rec.status = status;
                if (remarks !== undefined) rec.remarks = remarks;
            }
        }

        await attendanceLog.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('attendance-log-updated', { logId: attendanceLog._id });
        }

        res.json({ success: true, message: 'Attendance record updated successfully!', data: attendanceLog });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getMentorOfflineBatches,
    updateBatchSchedule,
    getPendingStudents,
    approveAndAssignBatch,
    getBatchStudents,
    markBatchAttendance,
    createQuizForBatch,
    createAssignmentForBatch,
    getAttendanceAnalytics,
    updateAttendanceRecord
};
