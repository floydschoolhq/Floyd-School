const User = require('../models/User');
const School = require('../models/School');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const { generateUniqueRollNumber } = require('../utils/rollNumberGenerator');

// @desc    Get all pending student registrations for mentor/admin review
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

// @desc    Mentor approves student registration and allots batch (Requirement 7 & 8)
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

// @desc    Mentor marks attendance for offline session (Requirement 11)
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

// @desc    Get attendance analytics for mentor (Requirement 11)
// @route   GET /api/mentor/offline/attendance/analytics
// @access  Private (mentor, admin)
const getAttendanceAnalytics = async (req, res) => {
    try {
        const { batchId } = req.query;
        const query = {};
        if (batchId) query.batch = batchId;

        const logs = await Attendance.find(query).populate('batch', 'name code');

        let totalSessions = logs.length;
        let totalPresent = 0;
        let totalLate = 0;
        let totalAbsent = 0;
        let totalRecords = 0;

        logs.forEach(l => {
            l.records.forEach(r => {
                totalRecords++;
                if (r.status === 'present') totalPresent++;
                else if (r.status === 'late') totalLate++;
                else if (r.status === 'absent') totalAbsent++;
            });
        });

        const overallPercentage = totalRecords > 0
            ? Math.round(((totalPresent + totalLate) / totalRecords) * 100)
            : 0;

        res.json({
            success: true,
            data: {
                totalSessions,
                totalRecords,
                totalPresent,
                totalLate,
                totalAbsent,
                overallPercentage
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

module.exports = {
    getPendingStudents,
    approveStudent,
    markAttendance,
    getAttendanceAnalytics,
    updateAttendanceLog
};
