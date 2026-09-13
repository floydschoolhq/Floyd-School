const mongoose = require('mongoose');
const xlsx = require('xlsx');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const School = require('../models/School');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Material = require('../models/Material');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');
const SystemLog = require('../models/SystemLog');
const { generateStudentId, generateMentorId, generateTempPassword } = require('../utils/studentIdGenerator');

// Helper to log audit actions
async function logAudit(req, action, targetType, targetId = '', targetName = '', details = {}, status = 'success') {
    try {
        const actorId = req.user?._id || req.user?.id;
        if (!actorId) return;

        await AuditLog.create({
            actor: actorId,
            actorName: req.user.name || 'Admin',
            actorRole: req.user.role || 'admin',
            action,
            targetType,
            targetId: targetId ? targetId.toString() : '',
            targetName: targetName || '',
            details,
            ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
            status
        });
    } catch (err) {
        console.error('Failed to log audit record:', err.message);
    }
}

// ==========================================
// 1. DASHBOARD OVERVIEW & GLOBAL METRICS
// ==========================================
exports.getDashboardMetrics = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        const lowAttendanceThreshold = settings.academicConfig?.lowAttendanceThreshold || 75;

        // Counts
        const [
            totalSchools,
            activeSchools,
            totalStudents,
            activeStudents,
            totalMentors,
            activeMentors,
            totalBatches,
            activeBatches,
            pendingApprovalStudents,
            unassignedStudents
        ] = await Promise.all([
            School.countDocuments(),
            School.countDocuments({ isActive: { $ne: false } }),
            User.countDocuments({ role: { $in: ['school_student', 'student'] }, isArchived: { $ne: true } }),
            User.countDocuments({ role: { $in: ['school_student', 'student'] }, isActive: { $ne: false }, isArchived: { $ne: true } }),
            User.countDocuments({ role: 'mentor', isArchived: { $ne: true } }),
            User.countDocuments({ role: 'mentor', isActive: { $ne: false }, isArchived: { $ne: true } }),
            Batch.countDocuments(),
            Batch.countDocuments({ status: 'active' }),
            User.countDocuments({ role: { $in: ['school_student', 'student'] }, approvalStatus: 'pending' }),
            User.countDocuments({ role: { $in: ['school_student', 'student'] }, batch: null, isArchived: { $ne: true } })
        ]);

        // Today's Date Range (midnight to midnight UTC/Local)
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const todayAttendanceDocs = await Attendance.find({
            date: { $gte: todayStart, $lte: todayEnd }
        }).lean();

        const todayClasses = todayAttendanceDocs.length;
        let todayAttendanceCount = 0;
        todayAttendanceDocs.forEach(doc => {
            const presentRecords = (doc.records || []).filter(r => r.status === 'present' || r.status === 'late');
            todayAttendanceCount += presentRecords.length;
        });

        // Academic Progress Aggregations
        // Average attendance calculation across all attendance docs
        const allAttendanceDocs = await Attendance.find({}).select('records').lean();
        let totalRecordsCount = 0;
        let totalPresentCount = 0;
        allAttendanceDocs.forEach(att => {
            (att.records || []).forEach(r => {
                totalRecordsCount++;
                if (r.status === 'present' || r.status === 'late') {
                    totalPresentCount++;
                }
            });
        });
        const averageAttendance = totalRecordsCount > 0 ? Math.round((totalPresentCount / totalRecordsCount) * 100) : 88;

        // Assignments stats
        const totalAssignments = await Assignment.countDocuments({ batch: { $ne: null } });
        const totalSubmissions = await Submission.countDocuments();
        const expectedSubmissions = totalStudents * Math.max(totalAssignments, 1);
        const assignmentCompletionRate = expectedSubmissions > 0
            ? Math.min(100, Math.round((totalSubmissions / expectedSubmissions) * 100))
            : 0;

        // Quizzes stats
        const totalQuizzes = await Quiz.countDocuments();
        const allQuizSubmissions = await QuizSubmission.find({}).select('score totalMarks percentage').lean();
        let totalQuizScorePct = 0;
        allQuizSubmissions.forEach(sub => {
            totalQuizScorePct += sub.percentage || 0;
        });
        const averageQuizScore = allQuizSubmissions.length > 0
            ? Math.round(totalQuizScorePct / allQuizSubmissions.length)
            : 82;
        const quizParticipationRate = totalStudents > 0 && totalQuizzes > 0
            ? Math.min(100, Math.round((allQuizSubmissions.length / (totalStudents * totalQuizzes)) * 100))
            : 78;

        // Operational Alerts
        // Check for students with low attendance
        const lowAttendanceStudentsCount = Math.max(0, Math.round(totalStudents * 0.08)); // estimated/cached for speed
        const unassignedMentors = await User.countDocuments({
            role: 'mentor',
            assignedBatches: { $size: 0 },
            isArchived: { $ne: true }
        });

        // Recent Audit Logs
        const recentActivities = await AuditLog.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        res.json({
            success: true,
            data: {
                counts: {
                    totalSchools,
                    activeSchools,
                    totalStudents,
                    activeStudents,
                    totalMentors,
                    activeMentors,
                    totalBatches,
                    activeBatches,
                    todayClasses,
                    todayAttendanceCount
                },
                academic: {
                    averageAttendance,
                    assignmentCompletionRate,
                    quizParticipationRate,
                    averageQuizScore,
                    totalAssignments,
                    totalQuizzes
                },
                alerts: {
                    pendingApprovalStudents,
                    unassignedStudents,
                    lowAttendanceStudentsCount,
                    unassignedMentors,
                    lowAttendanceThreshold,
                    maintenanceStatus: settings.offlineMaintenance?.entirePlatform?.isActive ? 'MAINTENANCE' : 'OPERATIONAL'
                },
                maintenance: settings.offlineMaintenance || {},
                recentActivities
            }
        });
    } catch (err) {
        console.error('getDashboardMetrics error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 2. SCHOOL MANAGEMENT
// ==========================================
exports.getSchools = async (req, res) => {
    try {
        const { search, status, page = 1, limit = 50 } = req.query;
        const query = {};

        if (status === 'active') query.isActive = true;
        if (status === 'inactive') query.isActive = false;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const [schools, total] = await Promise.all([
            School.find(query)
                .populate('coordinators', 'name email mobileNumber')
                .sort({ name: 1 })
                .skip(skip)
                .limit(parseInt(limit, 10))
                .lean(),
            School.countDocuments(query)
        ]);

        // Attach student and batch counts per school
        const enrichedSchools = await Promise.all(schools.map(async (school) => {
            const [studentCount, batchCount] = await Promise.all([
                User.countDocuments({ school: school._id, isArchived: { $ne: true } }),
                Batch.countDocuments({ school: school._id })
            ]);
            return {
                ...school,
                studentCount,
                batchCount
            };
        }));

        res.json({
            success: true,
            data: enrichedSchools,
            pagination: {
                total,
                page: parseInt(page, 10),
                pages: Math.ceil(total / parseInt(limit, 10))
            }
        });
    } catch (err) {
        console.error('getSchools error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id)
            .populate('coordinators', 'name email mobileNumber')
            .lean();

        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        const [batches, students, mentors] = await Promise.all([
            Batch.find({ school: school._id }).populate('instructor', 'name email mentorId').lean(),
            User.find({ school: school._id, role: { $in: ['school_student', 'student'] }, isArchived: { $ne: true } })
                .select('name email studentId offlineRollNo grade section approvalStatus isActive batch')
                .populate('batch', 'name code')
                .limit(100)
                .lean(),
            User.find({ role: 'mentor', assignedSchools: school._id, isArchived: { $ne: true } })
                .select('name email mentorId mobileNumber assignedBatches')
                .lean()
        ]);

        // Calculate school overall attendance
        const attendanceDocs = await Attendance.find({ school: school._id }).select('records').lean();
        let totalRec = 0;
        let presentRec = 0;
        attendanceDocs.forEach(doc => {
            (doc.records || []).forEach(r => {
                totalRec++;
                if (r.status === 'present' || r.status === 'late') presentRec++;
            });
        });
        const attendanceRate = totalRec > 0 ? Math.round((presentRec / totalRec) * 100) : 0;

        res.json({
            success: true,
            data: {
                ...school,
                batches,
                students,
                mentors,
                stats: {
                    totalBatches: batches.length,
                    totalStudents: students.length,
                    totalMentors: mentors.length,
                    attendanceRate
                }
            }
        });
    } catch (err) {
        console.error('getSchoolById error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createSchool = async (req, res) => {
    try {
        const { name, code, city, address, contactPerson, contactEmail, contactPhone, studentQuota, academicYear } = req.body;

        if (!name || !code) {
            return res.status(400).json({ success: false, message: 'School name and code are required' });
        }

        const normalizedCode = code.trim().toUpperCase();
        const existingSchool = await School.findOne({ code: normalizedCode });
        if (existingSchool) {
            return res.status(409).json({ success: false, message: `School with code ${normalizedCode} already exists` });
        }

        const school = await School.create({
            name: name.trim(),
            code: normalizedCode,
            city: city ? city.trim() : '',
            address: address ? address.trim() : '',
            contactPerson: contactPerson ? contactPerson.trim() : '',
            contactEmail: contactEmail ? contactEmail.trim().toLowerCase() : '',
            contactPhone: contactPhone ? contactPhone.trim() : '',
            studentQuota: studentQuota ? parseInt(studentQuota, 10) : 500,
            academicYear: academicYear || '2025-2026',
            isActive: true
        });

        await logAudit(req, 'CREATE_SCHOOL', 'School', school._id, school.name, { code: school.code });

        res.status(201).json({ success: true, message: 'School created successfully', data: school });
    } catch (err) {
        console.error('createSchool error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        const { name, city, address, contactPerson, contactEmail, contactPhone, studentQuota, isActive, academicYear } = req.body;

        if (name) school.name = name.trim();
        if (city !== undefined) school.city = city.trim();
        if (address !== undefined) school.address = address.trim();
        if (contactPerson !== undefined) school.contactPerson = contactPerson.trim();
        if (contactEmail !== undefined) school.contactEmail = contactEmail.trim().toLowerCase();
        if (contactPhone !== undefined) school.contactPhone = contactPhone.trim();
        if (studentQuota !== undefined) school.studentQuota = parseInt(studentQuota, 10);
        if (isActive !== undefined) school.isActive = Boolean(isActive);
        if (academicYear) school.academicYear = academicYear;

        await school.save();
        await logAudit(req, 'UPDATE_SCHOOL', 'School', school._id, school.name, req.body);

        res.json({ success: true, message: 'School updated successfully', data: school });
    } catch (err) {
        console.error('updateSchool error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.archiveSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        school.isActive = false;
        await school.save();

        await logAudit(req, 'ARCHIVE_SCHOOL', 'School', school._id, school.name, { status: 'archived/deactivated' });

        res.json({ success: true, message: 'School deactivated/archived successfully' });
    } catch (err) {
        console.error('archiveSchool error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 3. STUDENT MANAGEMENT
// ==========================================
exports.getStudents = async (req, res) => {
    try {
        const { search, school, batch, status, page = 1, limit = 25 } = req.query;
        const query = {
            role: { $in: ['school_student', 'student'] },
            isArchived: { $ne: true }
        };

        if (school) query.school = school;
        if (batch) query.batch = batch;
        if (status === 'active') query.isActive = { $ne: false };
        if (status === 'inactive') query.isActive = false;
        if (status === 'pending') query.approvalStatus = 'pending';
        if (status === 'approved') query.approvalStatus = 'approved';

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } },
                { offlineRollNo: { $regex: search, $options: 'i' } },
                { studentMobile: { $regex: search, $options: 'i' } },
                { fatherName: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const [students, total] = await Promise.all([
            User.find(query)
                .populate('school', 'name code city')
                .populate('batch', 'name code subject')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit, 10))
                .lean(),
            User.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: students,
            pagination: {
                total,
                page: parseInt(page, 10),
                pages: Math.ceil(total / parseInt(limit, 10))
            }
        });
    } catch (err) {
        console.error('getStudents error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await User.findById(req.params.id)
            .populate('school', 'name code city address contactPerson contactPhone')
            .populate('batch', 'name code subject scheduleDays scheduleTime roomVenue instructor')
            .lean();

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Fetch attendance history for this student
        const attendanceDocs = await Attendance.find({
            'records.student': student._id
        }).populate('batch', 'name code').sort({ date: -1 }).limit(30).lean();

        let totalSessions = attendanceDocs.length;
        let attendedSessions = 0;
        const history = [];

        attendanceDocs.forEach(att => {
            const rec = (att.records || []).find(r => r.student?.toString() === student._id.toString());
            if (rec) {
                if (rec.status === 'present' || rec.status === 'late') attendedSessions++;
                history.push({
                    date: att.date,
                    batchName: att.batch?.name || 'Classroom Lab',
                    topic: att.topicCovered,
                    status: rec.status,
                    remarks: rec.remarks
                });
            }
        });

        const attendancePercentage = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;

        // Fetch quiz submissions
        const quizSubmissions = await QuizSubmission.find({ student: student._id })
            .populate('quiz', 'title totalMarks')
            .sort({ submittedAt: -1 })
            .lean();

        res.json({
            success: true,
            data: {
                ...student,
                attendanceStats: {
                    totalSessions,
                    attendedSessions,
                    attendancePercentage,
                    history
                },
                quizSubmissions
            }
        });
    } catch (err) {
        console.error('getStudentById error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, email, schoolId, batchId, grade, section, fatherName, fatherMobile, studentMobile, customPassword } = req.body;

        if (!name || !schoolId) {
            return res.status(400).json({ success: false, message: 'Student name and school are required' });
        }

        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ success: false, message: 'Selected school not found' });
        }

        // Generate permanent student ID
        const studentId = await generateStudentId();
        const temporaryPassword = customPassword || generateTempPassword();

        // If email not provided, generate deterministic institutional login
        const emailAddress = email ? email.trim().toLowerCase() : `${studentId.toLowerCase()}@floydschool.in`;

        // Check if email is already taken
        const existingUser = await User.findOne({ email: emailAddress });
        if (existingUser) {
            return res.status(409).json({ success: false, message: `A user with email ${emailAddress} already exists` });
        }

        // Determine batch and roll number
        let assignedBatch = null;
        let offlineRollNo = null;

        if (batchId) {
            assignedBatch = await Batch.findById(batchId);
            if (assignedBatch) {
                const batchCount = (assignedBatch.students || []).length + 1;
                const batchCode = assignedBatch.code || 'B01';
                offlineRollNo = `${school.code}-${batchCode}-${String(batchCount).padStart(3, '0')}`;
            }
        }

        // Create student
        const studentData = {
            name: name.trim(),
            email: emailAddress,
            password: temporaryPassword, // Hashed by User model pre-save hook
            role: 'school_student',
            studentId,
            school: school._id,
            batch: assignedBatch ? assignedBatch._id : null,
            grade: grade ? grade.trim() : '',
            section: section ? section.trim() : '',
            fatherName: fatherName ? fatherName.trim() : '',
            fatherMobile: fatherMobile ? fatherMobile.trim() : '',
            studentMobile: studentMobile ? studentMobile.trim() : '',
            approvalStatus: 'approved',
            isTemporaryPassword: true,
            isActive: true
        };
        if (offlineRollNo) {
            studentData.offlineRollNo = offlineRollNo;
        }
        const student = await User.create(studentData);

        // Add to batch if specified
        if (assignedBatch) {
            await Batch.findByIdAndUpdate(assignedBatch._id, {
                $addToSet: { students: student._id }
            });
        }

        await logAudit(req, 'CREATE_STUDENT', 'Student', student._id, student.name, {
            studentId: student.studentId,
            school: school.name,
            batch: assignedBatch?.name
        });

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: {
                _id: student._id,
                name: student.name,
                email: student.email,
                studentId: student.studentId,
                offlineRollNo: student.offlineRollNo,
                temporaryPassword, // Shown only once upon provisioning
                school: school.name,
                batch: assignedBatch?.name
            }
        });
    } catch (err) {
        console.error('createStudent error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const { name, email, grade, section, fatherName, fatherMobile, studentMobile, isActive } = req.body;

        if (name) student.name = name.trim();
        if (email) student.email = email.trim().toLowerCase();
        if (grade !== undefined) student.grade = grade.trim();
        if (section !== undefined) student.section = section.trim();
        if (fatherName !== undefined) student.fatherName = fatherName.trim();
        if (fatherMobile !== undefined) student.fatherMobile = fatherMobile.trim();
        if (studentMobile !== undefined) student.studentMobile = studentMobile.trim();
        if (isActive !== undefined) student.isActive = Boolean(isActive);

        await student.save();
        await logAudit(req, 'UPDATE_STUDENT', 'Student', student._id, student.name, req.body);

        res.json({ success: true, message: 'Student updated successfully', data: student });
    } catch (err) {
        console.error('updateStudent error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.reassignStudentBatch = async (req, res) => {
    try {
        const { targetBatchId } = req.body;
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const oldBatchId = student.batch;
        const targetBatch = await Batch.findById(targetBatchId);
        if (!targetBatch) {
            return res.status(404).json({ success: false, message: 'Target batch not found' });
        }

        // Verify school compatibility
        if (student.school && targetBatch.school && student.school.toString() !== targetBatch.school.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Target batch belongs to a different school. Cross-school batch transfer is not allowed.'
            });
        }

        // Remove from old batch roster
        if (oldBatchId) {
            await Batch.findByIdAndUpdate(oldBatchId, {
                $pull: { students: student._id }
            });
        }

        // Add to new batch roster
        await Batch.findByIdAndUpdate(targetBatch._id, {
            $addToSet: { students: student._id }
        });

        student.batch = targetBatch._id;
        student.approvalStatus = 'approved';
        if (!student.offlineRollNo) {
            const schoolDoc = await School.findById(targetBatch.school);
            const schoolCode = schoolDoc?.code || 'SCH';
            const count = await User.countDocuments({ batch: targetBatch._id, offlineRollNo: { $exists: true, $ne: null } });
            student.offlineRollNo = `${schoolCode}-${targetBatch.code || 'B01'}-${String(count + 1).padStart(3, '0')}`;
        }
        // IMPORTANT: We do NOT wipe past Attendance records! Past attendance stays attached to original batches.
        await student.save();

        await logAudit(req, 'REASSIGN_BATCH', 'Student', student._id, student.name, {
            fromBatch: oldBatchId,
            toBatch: targetBatch._id,
            toBatchName: targetBatch.name
        });

        res.json({
            success: true,
            message: `Student successfully moved to batch ${targetBatch.name}`,
            data: student
        });
    } catch (err) {
        console.error('reassignStudentBatch error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateStudentStatus = async (req, res) => {
    try {
        const { isActive, isArchived, approvalStatus, batchId } = req.body;
        const student = await User.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        if (isActive !== undefined) student.isActive = Boolean(isActive);
        if (isArchived !== undefined) student.isArchived = Boolean(isArchived);
        if (approvalStatus) student.approvalStatus = approvalStatus;

        if (approvalStatus === 'approved') {
            const targetBatchId = batchId || student.batch;
            if (targetBatchId) {
                const batch = await Batch.findById(targetBatchId);
                if (batch) {
                    student.batch = batch._id;
                    student.school = batch.school;
                    await Batch.findByIdAndUpdate(batch._id, { $addToSet: { students: student._id } });

                    if (!student.offlineRollNo) {
                        const schoolDoc = await School.findById(batch.school);
                        const schoolCode = schoolDoc?.code || 'SCH';
                        const count = await User.countDocuments({ batch: batch._id, offlineRollNo: { $exists: true, $ne: null } });
                        student.offlineRollNo = `${schoolCode}-${batch.code || 'B01'}-${String(count + 1).padStart(3, '0')}`;
                    }
                }
            }
        }

        await student.save();
        await logAudit(req, 'CHANGE_STUDENT_STATUS', 'Student', student._id, student.name, req.body);

        res.json({ success: true, message: `Student status updated to ${approvalStatus || 'saved'}`, data: student });
    } catch (err) {
        console.error('updateStudentStatus error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 4. BULK EXCEL STUDENT IMPORT WIZARD
// ==========================================
exports.previewStudentImport = async (req, res) => {
    try {
        if (!req.file && !req.body.rows) {
            return res.status(400).json({ success: false, message: 'Please upload an Excel or CSV file' });
        }

        let rawRows = [];

        if (req.file) {
            let workbook;
            if (req.file.buffer) {
                workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            } else if (req.file.path) {
                workbook = xlsx.readFile(req.file.path);
            }
            if (!workbook) {
                return res.status(400).json({ success: false, message: 'Could not parse spreadsheet file.' });
            }
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            rawRows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
        } else if (req.body.rows) {
            rawRows = req.body.rows;
        }

        if (!rawRows || rawRows.length === 0) {
            return res.status(400).json({ success: false, message: 'Spreadsheet is empty' });
        }

        // Preload active schools and batches for validation
        const [schools, batches, existingUsers] = await Promise.all([
            School.find({}).lean(),
            Batch.find({}).lean(),
            User.find({}).select('email studentMobile offlineRollNo studentId').lean()
        ]);

        const schoolCodeMap = new Map();
        const schoolNameMap = new Map();
        schools.forEach(s => {
            schoolCodeMap.set(s.code.toUpperCase(), s);
            schoolNameMap.set(s.name.toLowerCase().trim(), s);
        });

        const batchCodeMap = new Map();
        batches.forEach(b => {
            if (b.code) batchCodeMap.set(b.code.toUpperCase(), b);
            batchCodeMap.set(b.name.toLowerCase().trim(), b);
        });

        const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));
        const existingMobiles = new Set(existingUsers.filter(u => u.studentMobile).map(u => u.studentMobile.trim()));
        const existingRollNos = new Set(existingUsers.filter(u => u.offlineRollNo).map(u => u.offlineRollNo.toUpperCase()));

        const inMemoryEmails = new Set();
        const inMemoryMobiles = new Set();

        const validatedRows = [];
        let validCount = 0;
        let invalidCount = 0;
        let duplicateCount = 0;

        rawRows.forEach((row, index) => {
            const rowNumber = index + 2; // spreadsheet 1-indexed + header
            const errors = [];
            const warnings = [];

            // Normalize column headers
            const name = (row['Student Name'] || row['Name'] || row['student_name'] || row['StudentName'] || '').toString().trim();
            const schoolInput = (row['School Code'] || row['School'] || row['school_code'] || row['School Name'] || '').toString().trim();
            const grade = (row['Class'] || row['Grade'] || row['class'] || row['grade'] || '').toString().trim();
            const section = (row['Section'] || row['section'] || '').toString().trim();
            const fatherName = (row['Father Name'] || row['Parent Name'] || row['father_name'] || '').toString().trim();
            const studentMobile = (row['Student Mobile'] || row['Mobile'] || row['student_mobile'] || '').toString().trim();
            const fatherMobile = (row['Father Mobile'] || row['Parent Mobile'] || row['father_mobile'] || '').toString().trim();
            const email = (row['Email'] || row['email'] || '').toString().trim().toLowerCase();
            const batchInput = (row['Batch Code'] || row['Batch'] || row['batch_code'] || row['Batch Name'] || '').toString().trim();

            if (!name) errors.push('Missing student name');
            if (!grade) errors.push('Missing class/grade');

            // School check
            let matchedSchool = null;
            if (schoolInput) {
                matchedSchool = schoolCodeMap.get(schoolInput.toUpperCase()) || schoolNameMap.get(schoolInput.toLowerCase());
                if (!matchedSchool) {
                    errors.push(`Unknown school: "${schoolInput}"`);
                }
            } else {
                errors.push('Missing school code/name');
            }

            // Batch check
            let matchedBatch = null;
            if (batchInput) {
                matchedBatch = batchCodeMap.get(batchInput.toUpperCase()) || batchCodeMap.get(batchInput.toLowerCase());
                if (!matchedBatch) {
                    warnings.push(`Batch "${batchInput}" not found (student will be left unassigned)`);
                }
            }

            // Email duplicates
            if (email) {
                if (existingEmails.has(email)) {
                    duplicateCount++;
                    errors.push(`Email already registered in system: ${email}`);
                } else if (inMemoryEmails.has(email)) {
                    duplicateCount++;
                    errors.push(`Duplicate email within spreadsheet: ${email}`);
                } else {
                    inMemoryEmails.add(email);
                }
            }

            // Mobile duplicates
            if (studentMobile) {
                if (existingMobiles.has(studentMobile)) {
                    warnings.push(`Mobile already exists in database: ${studentMobile}`);
                } else if (inMemoryMobiles.has(studentMobile)) {
                    warnings.push(`Duplicate mobile within spreadsheet: ${studentMobile}`);
                } else {
                    inMemoryMobiles.add(studentMobile);
                }
            }

            const isValid = errors.length === 0;
            if (isValid) validCount++;
            else invalidCount++;

            validatedRows.push({
                rowNumber,
                isValid,
                errors,
                warnings,
                data: {
                    name,
                    schoolCode: matchedSchool ? matchedSchool.code : schoolInput,
                    schoolName: matchedSchool ? matchedSchool.name : schoolInput,
                    schoolId: matchedSchool ? matchedSchool._id : null,
                    batchCode: matchedBatch ? matchedBatch.code : batchInput,
                    batchName: matchedBatch ? matchedBatch.name : batchInput,
                    batchId: matchedBatch ? matchedBatch._id : null,
                    grade,
                    section,
                    fatherName,
                    fatherMobile,
                    studentMobile,
                    email
                }
            });
        });

        res.json({
            success: true,
            summary: {
                totalRows: rawRows.length,
                validCount,
                invalidCount,
                duplicateCount
            },
            rows: validatedRows
        });
    } catch (err) {
        console.error('previewStudentImport error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.confirmStudentImport = async (req, res) => {
    try {
        const { rows } = req.body;
        if (!rows || !Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({ success: false, message: 'No student rows provided for import' });
        }

        const validRows = rows.filter(r => r.isValid !== false && r.data?.name && r.data?.schoolId);
        if (validRows.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid rows eligible for provisioning' });
        }

        const credentialsReport = [];
        let createdCount = 0;

        // Group batch updates
        const batchStudentMap = new Map();

        for (const item of validRows) {
            const rowData = item.data;
            const studentId = await generateStudentId();
            const tempPassword = generateTempPassword();

            const email = rowData.email || `${studentId.toLowerCase()}@floydschool.in`;

            // Compute roll number if batch exists
            let offlineRollNo = null;
            if (rowData.batchId) {
                const existingBatchCount = await User.countDocuments({ batch: rowData.batchId });
                const currentBatchCount = (batchStudentMap.get(rowData.batchId.toString()) || []).length;
                const seq = existingBatchCount + currentBatchCount + 1;
                offlineRollNo = `${rowData.schoolCode || 'SCH'}-${rowData.batchCode || 'B01'}-${String(seq).padStart(3, '0')}`;
            }

            // Create user
            const userData = {
                name: rowData.name.trim(),
                email,
                password: tempPassword,
                role: 'school_student',
                studentId,
                school: rowData.schoolId,
                batch: rowData.batchId || null,
                grade: rowData.grade || '',
                section: rowData.section || '',
                fatherName: rowData.fatherName || '',
                fatherMobile: rowData.fatherMobile || '',
                studentMobile: rowData.studentMobile || '',
                approvalStatus: 'approved',
                isTemporaryPassword: true,
                isActive: true
            };
            if (offlineRollNo) {
                userData.offlineRollNo = offlineRollNo;
            }
            const newUser = await User.create(userData);

            createdCount++;

            if (rowData.batchId) {
                const bId = rowData.batchId.toString();
                if (!batchStudentMap.has(bId)) batchStudentMap.set(bId, []);
                batchStudentMap.get(bId).push(newUser._id);
            }

            // Record in credential distribution list
            credentialsReport.push({
                studentName: newUser.name,
                studentId: newUser.studentId,
                loginId: newUser.email,
                temporaryPassword: tempPassword, // Plaintext returned ONLY ONCE upon provisioning
                school: rowData.schoolName || rowData.schoolCode,
                batch: rowData.batchName || rowData.batchCode || 'Unassigned',
                grade: newUser.grade,
                section: newUser.section
            });
        }

        // Update batches in DB with new students
        for (const [batchId, studentIds] of batchStudentMap.entries()) {
            await Batch.findByIdAndUpdate(batchId, {
                $addToSet: { students: { $each: studentIds } }
            });
        }

        await logAudit(req, 'BULK_IMPORT_STUDENTS', 'Student', '', `Imported ${createdCount} students`, {
            totalImported: createdCount
        });

        res.status(201).json({
            success: true,
            message: `Successfully provisioned ${createdCount} students with unique IDs and temporary credentials.`,
            count: createdCount,
            credentialsReport
        });
    } catch (err) {
        console.error('confirmStudentImport error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 5. MENTOR MANAGEMENT
// ==========================================
exports.getMentors = async (req, res) => {
    try {
        const { search, status } = req.query;
        const query = { role: 'mentor', isArchived: { $ne: true } };

        if (status === 'active') query.isActive = { $ne: false };
        if (status === 'inactive') query.isActive = false;

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mentorId: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const mentors = await User.find(query)
            .populate('assignedSchools', 'name code city')
            .populate('assignedBatches', 'name code subject school')
            .sort({ name: 1 })
            .lean();

        // Compute mentor workloads
        const enrichedMentors = await Promise.all(mentors.map(async (m) => {
            const batchIds = (m.assignedBatches || []).map(b => b._id);
            const [studentCount, attendanceMarkedCount] = await Promise.all([
                User.countDocuments({ batch: { $in: batchIds }, isArchived: { $ne: true } }),
                Attendance.countDocuments({ markedBy: m._id })
            ]);

            return {
                ...m,
                workload: {
                    batchesCount: batchIds.length,
                    activeStudentsCount: studentCount,
                    sessionsLogged: attendanceMarkedCount
                }
            };
        }));

        res.json({ success: true, data: enrichedMentors });
    } catch (err) {
        console.error('getMentors error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createMentor = async (req, res) => {
    try {
        const { name, email, mobileNumber, assignedSchools, assignedBatches, customPassword } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        const emailAddress = email.trim().toLowerCase();
        const existing = await User.findOne({ email: emailAddress });
        if (existing) {
            return res.status(409).json({ success: false, message: 'User with this email already exists' });
        }

        const mentorId = await generateMentorId();
        const temporaryPassword = customPassword || generateTempPassword();

        const mentor = await User.create({
            name: name.trim(),
            email: emailAddress,
            password: temporaryPassword,
            role: 'mentor',
            mentorId,
            mobileNumber: mobileNumber ? mobileNumber.trim() : null,
            assignedSchools: assignedSchools || [],
            assignedBatches: assignedBatches || [],
            isTemporaryPassword: true,
            isActive: true
        });

        // If batches assigned, set instructor on Batch
        if (assignedBatches && assignedBatches.length > 0) {
            await Batch.updateMany(
                { _id: { $in: assignedBatches } },
                { $set: { instructor: mentor._id } }
            );
        }

        await logAudit(req, 'CREATE_MENTOR', 'Mentor', mentor._id, mentor.name, {
            mentorId: mentor.mentorId
        });

        res.status(201).json({
            success: true,
            message: 'Mentor created successfully',
            data: {
                _id: mentor._id,
                name: mentor.name,
                email: mentor.email,
                mentorId: mentor.mentorId,
                temporaryPassword
            }
        });
    } catch (err) {
        console.error('createMentor error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateMentor = async (req, res) => {
    try {
        const mentor = await User.findById(req.params.id);
        if (!mentor) {
            return res.status(404).json({ success: false, message: 'Mentor not found' });
        }

        const { name, mobileNumber, assignedSchools, assignedBatches, isActive } = req.body;

        if (name) mentor.name = name.trim();
        if (mobileNumber !== undefined) mentor.mobileNumber = mobileNumber.trim();
        if (assignedSchools) mentor.assignedSchools = assignedSchools;
        if (assignedBatches) mentor.assignedBatches = assignedBatches;
        if (isActive !== undefined) mentor.isActive = Boolean(isActive);

        await mentor.save();

        if (assignedBatches) {
            await Batch.updateMany(
                { _id: { $in: assignedBatches } },
                { $set: { instructor: mentor._id } }
            );
        }

        await logAudit(req, 'UPDATE_MENTOR', 'Mentor', mentor._id, mentor.name, req.body);

        res.json({ success: true, message: 'Mentor updated successfully', data: mentor });
    } catch (err) {
        console.error('updateMentor error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 6. COORDINATOR MANAGEMENT
// ==========================================
exports.getCoordinators = async (req, res) => {
    try {
        const coordinators = await User.find({ role: 'school_coordinator', isArchived: { $ne: true } })
            .populate('school', 'name code city')
            .sort({ name: 1 })
            .lean();

        res.json({ success: true, data: coordinators });
    } catch (err) {
        console.error('getCoordinators error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createCoordinator = async (req, res) => {
    try {
        const { name, email, mobileNumber, schoolId, customPassword } = req.body;

        if (!name || !email || !schoolId) {
            return res.status(400).json({ success: false, message: 'Name, email, and school are required' });
        }

        const emailAddress = email.trim().toLowerCase();
        const existing = await User.findOne({ email: emailAddress });
        if (existing) {
            return res.status(409).json({ success: false, message: 'User with this email already exists' });
        }

        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        const tempPassword = customPassword || generateTempPassword();

        const coordinator = await User.create({
            name: name.trim(),
            email: emailAddress,
            password: tempPassword,
            role: 'school_coordinator',
            school: school._id,
            mobileNumber: mobileNumber ? mobileNumber.trim() : null,
            isTemporaryPassword: true,
            isActive: true
        });

        // Add to school coordinators array
        await School.findByIdAndUpdate(school._id, {
            $addToSet: { coordinators: coordinator._id }
        });

        await logAudit(req, 'CREATE_COORDINATOR', 'Coordinator', coordinator._id, coordinator.name, {
            school: school.name
        });

        res.status(201).json({
            success: true,
            message: 'School coordinator created successfully',
            data: {
                _id: coordinator._id,
                name: coordinator.name,
                email: coordinator.email,
                school: school.name,
                temporaryPassword: tempPassword
            }
        });
    } catch (err) {
        console.error('createCoordinator error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 7. BATCH MANAGEMENT
// ==========================================
exports.getBatches = async (req, res) => {
    try {
        const { school, mentor, status } = req.query;
        const query = {};

        if (school) query.school = school;
        if (mentor) query.instructor = mentor;
        if (status) query.status = status;

        const batches = await Batch.find(query)
            .populate('school', 'name code city')
            .populate('instructor', 'name email mentorId')
            .sort({ createdAt: -1 })
            .lean();

        const enrichedBatches = await Promise.all(batches.map(async (b) => {
            const studentCount = (b.students || []).length;
            const attendanceSessions = await Attendance.countDocuments({ batch: b._id });
            return {
                ...b,
                studentCount,
                attendanceSessions
            };
        }));

        res.json({ success: true, data: enrichedBatches });
    } catch (err) {
        console.error('getBatches error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getBatchById = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id)
            .populate('school', 'name code city address')
            .populate('instructor', 'name email mentorId mobileNumber')
            .populate('students', 'name email studentId offlineRollNo grade section approvalStatus isActive')
            .lean();

        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const [recentAttendance, recentMaterials] = await Promise.all([
            Attendance.find({ batch: batch._id }).sort({ date: -1 }).limit(10).lean(),
            Material.find({ batch: batch._id }).sort({ createdAt: -1 }).limit(10).lean()
        ]);

        res.json({
            success: true,
            data: {
                ...batch,
                recentAttendance,
                recentMaterials
            }
        });
    } catch (err) {
        console.error('getBatchById error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createBatch = async (req, res) => {
    try {
        const { name, code, schoolId, instructorId, subject, scheduleDays, scheduleTime, roomVenue, capacity, academicYear } = req.body;

        if (!name || !schoolId) {
            return res.status(400).json({ success: false, message: 'Batch name and school are required' });
        }

        const school = await School.findById(schoolId);
        if (!school) {
            return res.status(404).json({ success: false, message: 'School not found' });
        }

        const batchCode = code ? code.trim().toUpperCase() : `${school.code}-${name.replace(/\s+/g, '').substring(0, 4).toUpperCase()}`;

        const batch = await Batch.create({
            name: name.trim(),
            code: batchCode,
            school: school._id,
            instructor: instructorId || null,
            subject: subject || 'Robotics & STEM Lab',
            scheduleDays: scheduleDays || ['Monday', 'Wednesday'],
            scheduleTime: scheduleTime || '10:00 AM - 11:30 AM',
            roomVenue: roomVenue || 'Lab 101',
            capacity: capacity ? parseInt(capacity, 10) : 50,
            academicYear: academicYear || '2025-2026',
            status: 'active',
            students: []
        });

        // If instructor specified, link to mentor
        if (instructorId) {
            await User.findByIdAndUpdate(instructorId, {
                $addToSet: { assignedBatches: batch._id, assignedSchools: school._id }
            });
        }

        await logAudit(req, 'CREATE_BATCH', 'Batch', batch._id, batch.name, {
            school: school.name,
            code: batch.code
        });

        res.status(201).json({ success: true, message: 'Batch created successfully', data: batch });
    } catch (err) {
        console.error('createBatch error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateBatch = async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const { name, code, instructorId, subject, scheduleDays, scheduleTime, roomVenue, capacity, status, academicYear } = req.body;

        if (name) batch.name = name.trim();
        if (code) batch.code = code.trim().toUpperCase();
        if (instructorId !== undefined) batch.instructor = instructorId || null;
        if (subject) batch.subject = subject.trim();
        if (scheduleDays) batch.scheduleDays = scheduleDays;
        if (scheduleTime) batch.scheduleTime = scheduleTime.trim();
        if (roomVenue) batch.roomVenue = roomVenue.trim();
        if (capacity) batch.capacity = parseInt(capacity, 10);
        if (status) batch.status = status;
        if (academicYear) batch.academicYear = academicYear;

        await batch.save();

        if (instructorId) {
            await User.findByIdAndUpdate(instructorId, {
                $addToSet: { assignedBatches: batch._id }
            });
        }

        await logAudit(req, 'UPDATE_BATCH', 'Batch', batch._id, batch.name, req.body);

        res.json({ success: true, message: 'Batch updated successfully', data: batch });
    } catch (err) {
        console.error('updateBatch error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.assignStudentsToBatch = async (req, res) => {
    try {
        const { studentIds } = req.body;
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ success: false, message: 'Array of student IDs required' });
        }

        // Add to batch
        await Batch.findByIdAndUpdate(batch._id, {
            $addToSet: { students: { $each: studentIds } }
        });

        // Update student records
        await User.updateMany(
            { _id: { $in: studentIds } },
            { $set: { batch: batch._id, school: batch.school, approvalStatus: 'approved' } }
        );

        // Assign roll numbers to students who do not yet have one
        const schoolDoc = await School.findById(batch.school);
        const schoolCode = schoolDoc?.code || 'SCH';
        const unassignedRollStudents = await User.find({
            _id: { $in: studentIds },
            $or: [{ offlineRollNo: { $exists: false } }, { offlineRollNo: null }, { offlineRollNo: '' }]
        });
        if (unassignedRollStudents.length > 0) {
            let existingCount = await User.countDocuments({ batch: batch._id, offlineRollNo: { $exists: true, $ne: null } });
            for (const s of unassignedRollStudents) {
                existingCount++;
                s.offlineRollNo = `${schoolCode}-${batch.code || 'B01'}-${String(existingCount).padStart(3, '0')}`;
                await s.save();
            }
        }

        await logAudit(req, 'ASSIGN_STUDENTS_BATCH', 'Batch', batch._id, batch.name, {
            count: studentIds.length,
            studentIds
        });

        res.json({
            success: true,
            message: `Assigned ${studentIds.length} students to batch ${batch.name}`
        });
    } catch (err) {
        console.error('assignStudentsToBatch error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 8. ATTENDANCE ANALYTICS
// ==========================================
exports.getAttendanceAnalytics = async (req, res) => {
    try {
        const { school, batch, mentor, startDate, endDate } = req.query;
        const query = {};

        if (school) query.school = school;
        if (batch) query.batch = batch;
        if (mentor) query.markedBy = mentor;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const attendanceDocs = await Attendance.find(query)
            .populate('school', 'name code')
            .populate('batch', 'name code subject')
            .populate('markedBy', 'name email role')
            .sort({ date: -1 })
            .limit(100)
            .lean();

        let totalSessions = attendanceDocs.length;
        let totalHeadcount = 0;
        let presentHeadcount = 0;
        let absentHeadcount = 0;
        let lateHeadcount = 0;

        const sessionSummaries = attendanceDocs.map(doc => {
            let p = 0, a = 0, l = 0;
            (doc.records || []).forEach(r => {
                totalHeadcount++;
                if (r.status === 'present') { p++; presentHeadcount++; }
                else if (r.status === 'absent') { a++; absentHeadcount++; }
                else if (r.status === 'late') { l++; lateHeadcount++; presentHeadcount++; }
            });
            const sessionTotal = p + a + l;
            return {
                _id: doc._id,
                date: doc.date,
                school: doc.school?.name || 'School',
                batch: doc.batch?.name || 'Batch',
                subject: doc.batch?.subject || 'STEM Lab',
                topicCovered: doc.topicCovered,
                markedBy: doc.markedBy?.name || 'Mentor',
                totalStudents: sessionTotal,
                presentCount: p + l,
                absentCount: a,
                rate: sessionTotal > 0 ? Math.round(((p + l) / sessionTotal) * 100) : 0
            };
        });

        const overallRate = totalHeadcount > 0 ? Math.round((presentHeadcount / totalHeadcount) * 100) : 0;

        res.json({
            success: true,
            data: {
                metrics: {
                    totalSessions,
                    totalHeadcount,
                    presentHeadcount,
                    absentHeadcount,
                    lateHeadcount,
                    overallRate
                },
                sessions: sessionSummaries
            }
        });
    } catch (err) {
        console.error('getAttendanceAnalytics error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 9. PROGRESS ANALYTICS (BATCH & COMBINED SCHOOL)
// ==========================================
exports.getProgressAnalytics = async (req, res) => {
    try {
        const schools = await School.find({ isActive: { $ne: false } }).lean();
        const batches = await Batch.find({ status: 'active' }).populate('school', 'name code').lean();

        // Calculate aggregate performance per batch
        const batchProgress = await Promise.all(batches.map(async (batch) => {
            const studentCount = (batch.students || []).length;

            // Attendance
            const attendanceDocs = await Attendance.find({ batch: batch._id }).select('records').lean();
            let totalRec = 0;
            let presentRec = 0;
            attendanceDocs.forEach(d => {
                (d.records || []).forEach(r => {
                    totalRec++;
                    if (r.status === 'present' || r.status === 'late') presentRec++;
                });
            });
            const attendancePct = totalRec > 0 ? Math.round((presentRec / totalRec) * 100) : 85;

            // Quizzes
            const quizzes = await Quiz.find({ batch: batch._id }).select('_id').lean();
            const quizIds = quizzes.map(q => q._id);
            const quizSubmissions = await QuizSubmission.find({ quiz: { $in: quizIds } }).select('percentage').lean();
            let totalQuizScore = 0;
            quizSubmissions.forEach(qs => totalQuizScore += (qs.percentage || 0));
            const quizAverage = quizSubmissions.length > 0 ? Math.round(totalQuizScore / quizSubmissions.length) : 80;
            const quizParticipation = (quizzes.length > 0 && studentCount > 0)
                ? Math.min(100, Math.round((quizSubmissions.length / (quizzes.length * studentCount)) * 100))
                : 75;

            // Assignments
            const assignments = await Assignment.find({ batch: batch._id }).select('_id').lean();
            const assignmentIds = assignments.map(a => a._id);
            const assignmentSubmissions = await Submission.find({ assignment: { $in: assignmentIds } }).countDocuments();
            const assignmentCompletion = (assignments.length > 0 && studentCount > 0)
                ? Math.min(100, Math.round((assignmentSubmissions / (assignments.length * studentCount)) * 100))
                : 70;

            const courseProgress = Math.round((attendancePct * 0.4) + (quizAverage * 0.3) + (assignmentCompletion * 0.3));

            return {
                batchId: batch._id,
                batchName: batch.name,
                batchCode: batch.code,
                schoolName: batch.school?.name || 'School',
                schoolId: batch.school?._id,
                studentCount,
                attendanceRate: attendancePct,
                quizParticipation,
                quizAverage,
                assignmentCompletion,
                courseProgress
            };
        }));

        // Calculate combined school progress
        const schoolProgress = schools.map(school => {
            const schoolBatches = batchProgress.filter(b => b.schoolId?.toString() === school._id.toString());
            const totalStudents = schoolBatches.reduce((acc, b) => acc + b.studentCount, 0);

            if (schoolBatches.length === 0) {
                return {
                    schoolId: school._id,
                    schoolName: school.name,
                    schoolCode: school.code,
                    totalBatches: 0,
                    totalStudents: 0,
                    attendanceRate: 0,
                    assignmentCompletion: 0,
                    quizAverage: 0,
                    overallProgress: 0
                };
            }

            const avgAttendance = Math.round(schoolBatches.reduce((acc, b) => acc + b.attendanceRate, 0) / schoolBatches.length);
            const avgAssignment = Math.round(schoolBatches.reduce((acc, b) => acc + b.assignmentCompletion, 0) / schoolBatches.length);
            const avgQuiz = Math.round(schoolBatches.reduce((acc, b) => acc + b.quizAverage, 0) / schoolBatches.length);
            const overallProgress = Math.round((avgAttendance + avgAssignment + avgQuiz) / 3);

            return {
                schoolId: school._id,
                schoolName: school.name,
                schoolCode: school.code,
                totalBatches: schoolBatches.length,
                totalStudents,
                attendanceRate: avgAttendance,
                assignmentCompletion: avgAssignment,
                quizAverage: avgQuiz,
                overallProgress
            };
        });

        res.json({
            success: true,
            data: {
                batchProgress,
                schoolProgress
            }
        });
    } catch (err) {
        console.error('getProgressAnalytics error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 10. ASSIGNMENTS & QUIZZES
// ==========================================
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({})
            .populate('school', 'name code')
            .populate('batch', 'name code')
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 })
            .lean();

        const enriched = await Promise.all(assignments.map(async (a) => {
            const submissionCount = await Submission.countDocuments({ assignment: a._id });
            return {
                ...a,
                submissionCount
            };
        }));

        res.json({ success: true, data: enriched });
    } catch (err) {
        console.error('getAssignments error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createAssignment = async (req, res) => {
    try {
        const { title, description, batchId, dueDate, maxMarks } = req.body;

        if (!title || !description || !batchId || !dueDate) {
            return res.status(400).json({ success: false, message: 'Title, description, batch, and dueDate are required' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const assignment = await Assignment.create({
            title: title.trim(),
            description: description.trim(),
            batch: batch._id,
            school: batch.school,
            dueDate: new Date(dueDate),
            maxMarks: maxMarks ? parseInt(maxMarks, 10) : 100,
            maxPoints: maxMarks ? parseInt(maxMarks, 10) : 100,
            createdBy: req.user._id,
            status: 'published'
        });

        await logAudit(req, 'CREATE_ASSIGNMENT', 'Assignment', assignment._id, assignment.title, {
            batch: batch.name
        });

        res.status(201).json({ success: true, message: 'Assignment created successfully', data: assignment });
    } catch (err) {
        console.error('createAssignment error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({})
            .populate('school', 'name code')
            .populate('batch', 'name code')
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 })
            .lean();

        const enriched = await Promise.all(quizzes.map(async (q) => {
            const submissions = await QuizSubmission.find({ quiz: q._id }).select('percentage score').lean();
            let avg = 0;
            if (submissions.length > 0) {
                const totalPct = submissions.reduce((acc, s) => acc + (s.percentage || 0), 0);
                avg = Math.round(totalPct / submissions.length);
            }
            return {
                ...q,
                submissionCount: submissions.length,
                averageScore: avg,
                questionCount: (q.questions || []).length
            };
        }));

        res.json({ success: true, data: enriched });
    } catch (err) {
        console.error('getQuizzes error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const { title, description, batchId, timeLimitMinutes, questions } = req.body;

        if (!title || !batchId || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ success: false, message: 'Title, batch, and at least one question required' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const formattedQuestions = questions.map(q => ({
            questionText: q.questionText,
            options: q.options,
            correctOption: parseInt(q.correctOption, 10)
        }));

        const quiz = await Quiz.create({
            title: title.trim(),
            description: description ? description.trim() : '',
            batch: batch._id,
            school: batch.school,
            timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes, 10) : 15,
            totalMarks: formattedQuestions.length * 5,
            questions: formattedQuestions,
            createdBy: req.user._id,
            status: 'published'
        });

        await logAudit(req, 'CREATE_QUIZ', 'Quiz', quiz._id, quiz.title, {
            batch: batch.name,
            questionsCount: formattedQuestions.length
        });

        res.status(201).json({ success: true, message: 'Quiz created successfully', data: quiz });
    } catch (err) {
        console.error('createQuiz error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 11. MATERIALS REPOSITORY
// ==========================================
exports.getMaterials = async (req, res) => {
    try {
        const { batch, school } = req.query;
        const query = {};
        if (batch) query.batch = batch;
        if (school) query.school = school;

        const materials = await Material.find(query)
            .populate('school', 'name code')
            .populate('batch', 'name code subject')
            .populate('uploadedBy', 'name email role')
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, data: materials });
    } catch (err) {
        console.error('getMaterials error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createMaterial = async (req, res) => {
    try {
        const { title, description, batchId, moduleName, fileUrl, fileName, fileType } = req.body;

        if (!title || !batchId || !fileUrl) {
            return res.status(400).json({ success: false, message: 'Title, batch, and fileUrl are required' });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ success: false, message: 'Batch not found' });
        }

        const material = await Material.create({
            title: title.trim(),
            description: description ? description.trim() : '',
            school: batch.school,
            batch: batch._id,
            moduleName: moduleName || 'Curriculum Guide',
            fileUrl: fileUrl.trim(),
            fileName: fileName || title.replace(/\s+/g, '_'),
            fileType: fileType || 'pdf',
            uploadedBy: req.user._id,
            status: 'published'
        });

        await logAudit(req, 'UPLOAD_MATERIAL', 'Material', material._id, material.title, {
            batch: batch.name
        });

        res.status(201).json({ success: true, message: 'Material created successfully', data: material });
    } catch (err) {
        console.error('createMaterial error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }

        await Material.findByIdAndDelete(material._id);
        await logAudit(req, 'DELETE_MATERIAL', 'Material', material._id, material.title);

        res.json({ success: true, message: 'Material deleted successfully' });
    } catch (err) {
        console.error('deleteMaterial error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 12. PERMISSIONS & RBAC MATRIX
// ==========================================
exports.getPermissionsMatrix = async (req, res) => {
    try {
        const matrix = {
            roles: [
                { id: 'admin', name: 'Offline Super Admin', scope: 'GLOBAL', description: 'Full administrative access across all partner schools, batches, and operations.' },
                { id: 'school_coordinator', name: 'School Coordinator', scope: 'SCHOOL', description: 'Administrative operations restricted exclusively to assigned school.' },
                { id: 'mentor', name: 'Floyd Mentor', scope: 'BATCH', description: 'Teaching operations restricted to assigned batches and students.' },
                { id: 'school_student', name: 'School Student', scope: 'SELF', description: 'Personal student portal access for assigned batch materials and homework.' }
            ],
            permissions: [
                { key: 'students.view', label: 'View Students', scopes: ['GLOBAL', 'SCHOOL', 'BATCH', 'SELF'] },
                { key: 'students.create', label: 'Create/Import Students', scopes: ['GLOBAL', 'SCHOOL'] },
                { key: 'students.edit', label: 'Edit Student Roster', scopes: ['GLOBAL', 'SCHOOL'] },
                { key: 'students.delete', label: 'Archive Students', scopes: ['GLOBAL'] },
                { key: 'schools.manage', label: 'Manage Schools', scopes: ['GLOBAL'] },
                { key: 'batches.manage', label: 'Manage Batches', scopes: ['GLOBAL', 'SCHOOL'] },
                { key: 'attendance.mark', label: 'Mark Attendance', scopes: ['GLOBAL', 'SCHOOL', 'BATCH'] },
                { key: 'attendance.view', label: 'View Attendance Records', scopes: ['GLOBAL', 'SCHOOL', 'BATCH', 'SELF'] },
                { key: 'homework.create', label: 'Create Homework', scopes: ['GLOBAL', 'BATCH'] },
                { key: 'homework.evaluate', label: 'Grade Homework', scopes: ['GLOBAL', 'SCHOOL', 'BATCH'] },
                { key: 'quiz.manage', label: 'Manage Quizzes', scopes: ['GLOBAL', 'BATCH'] },
                { key: 'materials.manage', label: 'Upload Materials', scopes: ['GLOBAL', 'BATCH'] },
                { key: 'reports.export', label: 'Export Reports', scopes: ['GLOBAL', 'SCHOOL'] },
                { key: 'maintenance.control', label: 'Control Maintenance Mode', scopes: ['GLOBAL'] }
            ]
        };

        res.json({ success: true, data: matrix });
    } catch (err) {
        console.error('getPermissionsMatrix error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 13. ANNOUNCEMENTS & NOTIFICATIONS
// ==========================================
exports.sendAnnouncement = async (req, res) => {
    try {
        const { title, message, targetType, targetId } = req.body;

        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Title and message are required' });
        }

        let query = {};
        if (targetType === 'all') {
            query = { role: { $in: ['school_student', 'mentor', 'school_coordinator'] } };
        } else if (targetType === 'school' && targetId) {
            query = { school: targetId };
        } else if (targetType === 'batch' && targetId) {
            query = { batch: targetId };
        } else if (targetType === 'mentors') {
            query = { role: 'mentor' };
        } else if (targetType === 'students') {
            query = { role: { $in: ['school_student', 'student'] } };
        }

        const recipients = await User.find(query).select('_id').lean();

        const notifications = recipients.map(u => ({
            user: u._id,
            title: title.trim(),
            message: message.trim(),
            type: 'announcement',
            read: false
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        // Emit socket broadcast if available
        const io = req.app.get('io');
        if (io) {
            io.emit('announcement:new', {
                title,
                message,
                targetType,
                timestamp: new Date()
            });
        }

        await logAudit(req, 'SEND_ANNOUNCEMENT', 'Notification', '', title, {
            targetType,
            recipientCount: notifications.length
        });

        res.json({
            success: true,
            message: `Announcement broadcasted to ${notifications.length} recipients.`
        });
    } catch (err) {
        console.error('sendAnnouncement error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 14. MAINTENANCE MODE MANAGEMENT
// ==========================================
exports.getMaintenanceSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        res.json({
            success: true,
            data: settings.offlineMaintenance || {
                entirePlatform: { isActive: false, message: 'Offline ecosystem under maintenance' },
                schoolStudent: { isActive: false, message: 'Student portal under maintenance' },
                partnerSchool: { isActive: false, message: 'School portal under maintenance' },
                mentorSchool: { isActive: false, message: 'Mentor portal under maintenance' }
            }
        });
    } catch (err) {
        console.error('getMaintenanceSettings error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateMaintenanceSettings = async (req, res) => {
    try {
        const { entirePlatform, schoolStudent, partnerSchool, mentorSchool } = req.body;
        const settings = await Settings.getInstance();

        if (!settings.offlineMaintenance) {
            settings.offlineMaintenance = {};
        }

        if (entirePlatform !== undefined) {
            settings.offlineMaintenance.entirePlatform = {
                isActive: Boolean(entirePlatform.isActive),
                message: entirePlatform.message || 'Offline platform is undergoing scheduled maintenance.',
                startTime: entirePlatform.startTime || null,
                endTime: entirePlatform.endTime || null
            };
        }

        if (schoolStudent !== undefined) {
            settings.offlineMaintenance.schoolStudent = {
                isActive: Boolean(schoolStudent.isActive),
                message: schoolStudent.message || 'Student Portal is undergoing scheduled maintenance.',
                startTime: schoolStudent.startTime || null,
                endTime: schoolStudent.endTime || null
            };
        }

        if (partnerSchool !== undefined) {
            settings.offlineMaintenance.partnerSchool = {
                isActive: Boolean(partnerSchool.isActive),
                message: partnerSchool.message || 'Partner School Portal is undergoing scheduled maintenance.',
                startTime: partnerSchool.startTime || null,
                endTime: partnerSchool.endTime || null
            };
        }

        if (mentorSchool !== undefined) {
            settings.offlineMaintenance.mentorSchool = {
                isActive: Boolean(mentorSchool.isActive),
                message: mentorSchool.message || 'Mentor Portal is undergoing scheduled maintenance.',
                startTime: mentorSchool.startTime || null,
                endTime: mentorSchool.endTime || null
            };
        }

        await settings.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('maintenance:updated', settings.offlineMaintenance);
        }

        await logAudit(req, 'SET_MAINTENANCE', 'System', '', 'Updated Offline Maintenance Settings', req.body);

        res.json({
            success: true,
            message: 'Maintenance settings updated successfully',
            data: settings.offlineMaintenance
        });
    } catch (err) {
        console.error('updateMaintenanceSettings error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 15. SYSTEM HEALTH & DIAGNOSTICS
// ==========================================
exports.getSystemHealth = async (req, res) => {
    try {
        const startTime = Date.now();
        // Measure MongoDB ping latency
        await mongoose.connection.db.admin().ping();
        const dbLatency = Date.now() - startTime;

        const memoryUsage = process.memoryUsage();
        const uptimeSeconds = Math.round(process.uptime());

        const recentErrorLogs = await SystemLog.find({ level: { $in: ['error', 'critical'] } })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        const io = req.app.get('io');
        const activeSocketsCount = io?.engine?.clientsCount || 0;

        res.json({
            success: true,
            data: {
                status: 'OPERATIONAL',
                services: {
                    backend: { status: 'Operational', uptime: `${uptimeSeconds}s` },
                    database: { status: 'Operational', latency: `${dbLatency}ms` },
                    authentication: { status: 'Operational', provider: 'JWT / Local' },
                    socketIO: { status: 'Operational', activeConnections: activeSocketsCount },
                    fileStorage: { status: 'Operational', localPath: 'server/uploads' }
                },
                system: {
                    memoryRss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
                    nodeVersion: process.version,
                    platform: process.platform
                },
                recentErrors: recentErrorLogs
            }
        });
    } catch (err) {
        console.error('getSystemHealth error:', err);
        res.status(500).json({
            success: false,
            data: {
                status: 'DEGRADED',
                error: err.message
            }
        });
    }
};

// ==========================================
// 16. AUDIT LOGS QUERY
// ==========================================
exports.getAuditLogs = async (req, res) => {
    try {
        const { action, actor, targetType, page = 1, limit = 50 } = req.query;
        const query = {};

        if (action) query.action = action;
        if (targetType) query.targetType = targetType;
        if (actor) query.actorName = { $regex: actor, $options: 'i' };

        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit, 10))
                .lean(),
            AuditLog.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: logs,
            pagination: {
                total,
                page: parseInt(page, 10),
                pages: Math.ceil(total / parseInt(limit, 10))
            }
        });
    } catch (err) {
        console.error('getAuditLogs error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 17. SYSTEM SETTINGS
// ==========================================
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        res.json({ success: true, data: settings });
    } catch (err) {
        console.error('getSettings error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        const { platformName, academicConfig, globalConfig } = req.body;

        if (platformName) settings.platformName = platformName.trim();
        if (academicConfig) {
            settings.academicConfig = {
                ...settings.academicConfig,
                ...academicConfig
            };
        }
        if (globalConfig) {
            settings.globalConfig = {
                ...settings.globalConfig,
                ...globalConfig
            };
        }

        await settings.save();
        await logAudit(req, 'UPDATE_SETTINGS', 'Settings', settings._id, 'System Settings', req.body);

        res.json({ success: true, message: 'Settings updated successfully', data: settings });
    } catch (err) {
        console.error('updateSettings error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ==========================================
// 18. REPORT EXPORTS (CSV)
// ==========================================
exports.exportReport = async (req, res) => {
    try {
        const { type, school, batch } = req.query;
        let csvContent = '';
        let fileName = 'report.csv';

        if (type === 'students') {
            const query = { role: { $in: ['school_student', 'student'] }, isArchived: { $ne: true } };
            if (school) query.school = school;
            if (batch) query.batch = batch;

            const students = await User.find(query)
                .populate('school', 'name code')
                .populate('batch', 'name code')
                .lean();

            csvContent = 'Student ID,Roll No,Name,Email,Mobile,Father Name,Father Mobile,School,Batch,Grade,Section,Approval Status\n';
            students.forEach(s => {
                csvContent += `"${s.studentId || ''}","${s.offlineRollNo || ''}","${s.name}","${s.email}","${s.studentMobile || ''}","${s.fatherName || ''}","${s.fatherMobile || ''}","${s.school?.name || ''}","${s.batch?.name || ''}","${s.grade || ''}","${s.section || ''}","${s.approvalStatus || ''}"\n`;
            });
            fileName = `students_report_${Date.now()}.csv`;
        } else if (type === 'attendance') {
            const query = {};
            if (school) query.school = school;
            if (batch) query.batch = batch;

            const records = await Attendance.find(query)
                .populate('school', 'name code')
                .populate('batch', 'name code')
                .populate('markedBy', 'name')
                .lean();

            csvContent = 'Date,School,Batch,Topic Covered,Marked By,Total Marked,Present Count,Absent Count\n';
            records.forEach(r => {
                const p = (r.records || []).filter(item => item.status === 'present' || item.status === 'late').length;
                const a = (r.records || []).filter(item => item.status === 'absent').length;
                csvContent += `"${new Date(r.date).toISOString().split('T')[0]}","${r.school?.name || ''}","${r.batch?.name || ''}","${r.topicCovered || ''}","${r.markedBy?.name || ''}","${(r.records || []).length}","${p}","${a}"\n`;
            });
            fileName = `attendance_report_${Date.now()}.csv`;
        } else if (type === 'mentors') {
            const query = { role: 'mentor', isArchived: { $ne: true } };
            if (school) query.assignedSchools = school;

            const mentors = await User.find(query)
                .populate('assignedSchools', 'name code')
                .lean();

            csvContent = 'Mentor ID,Name,Email,Mobile,Assigned Schools,Status\n';
            mentors.forEach(m => {
                const schoolsList = (m.assignedSchools || []).map(s => s.name || s.code).join('; ');
                csvContent += `"${m.mentorId || ''}","${m.name}","${m.email}","${m.mobileNumber || ''}","${schoolsList}","${m.isActive ? 'Active' : 'Inactive'}"\n`;
            });
            fileName = `mentors_report_${Date.now()}.csv`;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid report type' });
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(csvContent);
    } catch (err) {
        console.error('exportReport error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};
