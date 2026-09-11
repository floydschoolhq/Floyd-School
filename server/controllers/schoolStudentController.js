const User = require('../models/User');
const School = require('../models/School');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Notification = require('../models/Notification');
const SupportTicket = require('../models/SupportTicket');
const Material = require('../models/Material');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { generateStudentId } = require('../utils/studentIdGenerator');

// Generate JWT helper
const generateToken = (id, sessionToken) => {
    return jwt.sign({ id, sessionToken }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Get public partner schools list for registration dropdown
// @route   GET /api/school-student/public-schools
// @access  Public
const getPublicSchools = async (req, res) => {
    try {
        const schools = await School.find({ isActive: true }).select('_id name code city');
        res.json({
            success: true,
            data: schools
        });
    } catch (error) {
        console.error('[schoolStudent:getPublicSchools] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch schools' });
    }
};

// @desc    Register offline school student
// @route   POST /api/school-student/register
// @access  Public
const registerStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            grade,
            section,
            fatherName,
            studentMobile,
            fatherMobile,
            schoolId,
            schoolNameManual
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        let assignedSchoolId = null;
        let manualSchool = null;

        if (schoolId && schoolId !== 'other') {
            const schoolDoc = await School.findById(schoolId);
            if (schoolDoc) {
                assignedSchoolId = schoolDoc._id;
            } else {
                manualSchool = schoolNameManual || 'Partner School';
            }
        } else {
            manualSchool = schoolNameManual || 'Other School';
        }

        const sessionToken = crypto.randomBytes(16).toString('hex');
        const studentId = await generateStudentId();

        const student = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: 'school_student',
            studentId,
            grade: grade || 'Grade 10',
            section: section || 'A',
            fatherName: fatherName ? fatherName.trim() : '',
            studentMobile: studentMobile ? studentMobile.trim() : '',
            fatherMobile: fatherMobile ? fatherMobile.trim() : '',
            mobileNumber: studentMobile ? studentMobile.trim() : '',
            school: assignedSchoolId,
            schoolNameManual: manualSchool,
            batch: null, // Batch is allotted upon mentor approval
            approvalStatus: 'pending',
            sessionToken
        });

        // Create welcome/pending notification
        await Notification.create({
            recipient: student._id,
            type: 'info',
            title: 'Registration Received',
            message: 'Your school admission registration has been submitted. Your offline mentor will approve and assign your batch.'
        });

        const token = generateToken(student._id, sessionToken);

        res.status(201).json({
            success: true,
            message: 'Registration submitted! Awaiting batch allotment.',
            token,
            data: {
                _id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                approvalStatus: student.approvalStatus,
                grade: student.grade,
                section: student.section,
                schoolName: manualSchool || 'Partner School'
            }
        });
    } catch (error) {
        console.error('[schoolStudent:registerStudent] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Registration failed' });
    }
};

// @desc    Get student dashboard data
// @route   GET /api/school-student/dashboard
// @access  Private (school_student)
const getDashboard = async (req, res) => {
    try {
        const student = await User.findById(req.user._id)
            .populate('school', 'name code city address')
            .populate('batch', 'name code subject scheduleDays scheduleTime roomVenue');

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student record not found' });
        }

        const schoolName = student.school?.name || student.schoolNameManual || 'Partner School';

        // Check if student is still pending approval or has no batch allotted
        if (student.approvalStatus !== 'approved' || !student.batch) {
            return res.json({
                success: true,
                data: {
                    isPendingApproval: true,
                    data: {
                        student: {
                            name: student.name,
                            schoolName,
                            grade: student.grade || 'Grade 10',
                            section: student.section || 'A'
                        }
                    }
                }
            });
        }

        const batch = student.batch;

        // Fetch attendance stats
        const attendanceLogs = await Attendance.find({ batch: batch._id });
        const totalClasses = attendanceLogs.length;
        let attendedClasses = 0;

        attendanceLogs.forEach(log => {
            const studentRecord = log.records.find(r => r.student.toString() === student._id.toString());
            if (studentRecord && (studentRecord.status === 'present' || studentRecord.status === 'late')) {
                attendedClasses++;
            }
        });

        const attendancePercentage = totalClasses > 0
            ? Math.round((attendedClasses / totalClasses) * 100)
            : 100;

        // Fetch pending quizzes count
        const allQuizzes = await Quiz.find({
            $or: [
                { batch: batch._id },
                { school: student.school?._id }
            ],
            status: 'published'
        }).select('_id');

        const completedQuizSubmissions = await QuizSubmission.find({
            student: student._id,
            quiz: { $in: allQuizzes.map(q => q._id) }
        }).select('quiz');

        const completedQuizIds = new Set(completedQuizSubmissions.map(s => s.quiz.toString()));
        const pendingQuizzesCount = allQuizzes.filter(q => !completedQuizIds.has(q._id.toString())).length;

        // Fetch pending assignments count
        const allAssignments = await Assignment.find({
            $or: [
                { batch: batch._id },
                { school: student.school?._id }
            ],
            status: 'published'
        }).select('_id');

        const submissions = await Submission.find({
            student: student._id,
            assignment: { $in: allAssignments.map(a => a._id) }
        }).select('assignment');

        const submittedAssignmentIds = new Set(submissions.map(s => s.assignment.toString()));
        const pendingAssignmentsCount = allAssignments.filter(a => !submittedAssignmentIds.has(a._id.toString())).length;

        res.json({
            success: true,
            data: {
                isPendingApproval: false,
                student: {
                    id: student._id,
                    name: student.name,
                    offlineRollNo: student.offlineRollNo || 'Pending Allotment',
                    schoolName,
                    batchName: batch.name || 'Offline Classroom Section',
                    grade: student.grade || 'Grade 10',
                    section: student.section || 'A',
                    venue: batch.roomVenue || 'Lab 101',
                    scheduleTime: batch.scheduleTime || '10:00 AM - 11:30 AM',
                    scheduleDays: batch.scheduleDays?.length ? batch.scheduleDays : ['Mon', 'Wed', 'Fri']
                },
                batch: {
                    _id: batch._id,
                    name: batch.name,
                    code: batch.code,
                    subject: batch.subject,
                    roomVenue: batch.roomVenue
                },
                stats: {
                    attendancePercentage,
                    attendedClasses,
                    totalClasses,
                    pendingQuizzesCount,
                    pendingAssignmentsCount
                }
            }
        });
    } catch (error) {
        console.error('[schoolStudent:getDashboard] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to load dashboard' });
    }
};

// @desc    Get student attendance history
// @route   GET /api/school-student/attendance
// @access  Private (school_student)
const getAttendance = async (req, res) => {
    try {
        const student = await User.findById(req.user._id).select('batch');
        if (!student?.batch) {
            return res.json({ success: true, data: [] });
        }

        const logs = await Attendance.find({
            batch: student.batch,
            'records.student': req.user._id
        })
        .populate('batch', 'name code')
        .sort({ date: -1 });

        const formatted = logs.map(log => {
            const rec = log.records.find(r => r.student.toString() === req.user._id.toString());
            return {
                _id: log._id,
                date: log.date,
                batchName: log.batch?.name || 'Offline Batch',
                topicCovered: log.topicCovered || 'Practical STEM Experiment',
                status: rec?.status || 'present',
                remarks: rec?.remarks || ''
            };
        });

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('[schoolStudent:getAttendance] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance history' });
    }
};

// @desc    Get homework assignments for student
// @route   GET /api/school-student/assignments
// @access  Private (school_student)
const getAssignments = async (req, res) => {
    try {
        const student = await User.findById(req.user._id).select('batch school');
        if (!student?.batch) {
            return res.json({ success: true, data: [] });
        }

        const query = {
            $or: [
                { batch: student.batch },
                { school: student.school }
            ],
            status: 'published'
        };

        const assignments = await Assignment.find(query).sort({ dueDate: 1 });

        const assignmentIds = assignments.map(a => a._id);
        const userSubmissions = await Submission.find({
            assignment: { $in: assignmentIds },
            student: req.user._id
        });

        const submissionMap = new Map();
        userSubmissions.forEach(sub => {
            submissionMap.set(sub.assignment.toString(), sub);
        });

        const formatted = assignments.map(a => {
            const sub = submissionMap.get(a._id.toString());
            return {
                _id: a._id,
                title: a.title,
                description: a.description,
                dueDate: a.dueDate,
                maxMarks: a.maxMarks || a.maxPoints || 100,
                isSubmitted: !!sub,
                submission: sub ? {
                    marksObtained: sub.marksObtained !== undefined ? sub.marksObtained : sub.grade,
                    feedback: sub.feedback,
                    fileUrl: sub.fileUrl || (sub.attachments?.[0]?.url),
                    submittedAt: sub.submittedAt
                } : null
            };
        });

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('[schoolStudent:getAssignments] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch assignments' });
    }
};

// @desc    Submit assignment / project file
// @route   POST /api/school-student/assignments/:id/submit
// @access  Private (school_student)
const submitAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const { submissionText } = req.body;
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        let fileUrl = null;
        let attachments = [];
        if (req.file) {
            fileUrl = `/uploads/assignments/${req.file.filename}`;
            attachments.push({
                filename: req.file.originalname,
                url: fileUrl
            });
        }

        let submission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user._id
        });

        if (submission) {
            submission.content = submissionText || submission.content || '';
            if (fileUrl) {
                submission.fileUrl = fileUrl;
                submission.attachments = attachments;
            }
            submission.status = 'submitted';
            submission.submittedAt = new Date();
            await submission.save();
        } else {
            submission = await Submission.create({
                assignment: assignmentId,
                student: req.user._id,
                content: submissionText || '',
                fileUrl,
                attachments,
                status: 'submitted',
                submittedAt: new Date()
            });
        }

        // Notify io room
        const io = req.app.get('io');
        if (io) {
            io.emit('assignment:submitted', {
                assignmentId,
                studentId: req.user._id,
                studentName: req.user.name
            });
        }

        res.json({
            success: true,
            message: 'Homework submitted successfully!',
            data: submission
        });
    } catch (error) {
        console.error('[schoolStudent:submitAssignment] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Submission failed' });
    }
};

// @desc    Get active quizzes for student
// @route   GET /api/school-student/quizzes
// @access  Private (school_student)
const getQuizzes = async (req, res) => {
    try {
        const student = await User.findById(req.user._id).select('batch school');
        if (!student?.batch) {
            return res.json({ success: true, data: [] });
        }

        const quizzes = await Quiz.find({
            $or: [
                { batch: student.batch },
                { school: student.school }
            ],
            status: 'published'
        });

        const quizIds = quizzes.map(q => q._id);
        const userSubmissions = await QuizSubmission.find({
            quiz: { $in: quizIds },
            student: req.user._id
        });

        const submissionMap = new Map();
        userSubmissions.forEach(sub => {
            submissionMap.set(sub.quiz.toString(), sub);
        });

        const formatted = quizzes.map(q => {
            const sub = submissionMap.get(q._id.toString());
            return {
                _id: q._id,
                title: q.title,
                description: q.description,
                totalMarks: q.totalMarks,
                timeLimitMinutes: q.timeLimitMinutes,
                questions: q.questions.map(question => ({
                    questionText: question.questionText,
                    options: question.options
                })),
                isCompleted: !!sub,
                score: sub?.score,
                percentage: sub?.percentage
            };
        });

        res.json({ success: true, data: formatted });
    } catch (error) {
        console.error('[schoolStudent:getQuizzes] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch quizzes' });
    }
};

// @desc    Submit quiz answers and calculate score
// @route   POST /api/school-student/quizzes/:id/submit
// @access  Private (school_student)
const submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const { answers } = req.body; // [{ questionIndex, selectedOption }]

        // Prevent invalid duplicate submissions (Requirement 17)
        const existingSub = await QuizSubmission.findOne({
            quiz: quizId,
            student: req.user._id
        });

        if (existingSub) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted this quiz. Duplicate submissions are not permitted.'
            });
        }

        // Fetch quiz including correctOption for validation (NOT sent to client)
        const quiz = await Quiz.findById(quizId).select('+questions.correctOption');
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const totalQuestions = quiz.questions.length;
        if (totalQuestions === 0) {
            return res.status(400).json({ success: false, message: 'Quiz has no questions' });
        }

        const pointsPerQuestion = quiz.totalMarks / totalQuestions;
        let correctCount = 0;

        const answerMap = new Map();
        if (Array.isArray(answers)) {
            answers.forEach(a => answerMap.set(Number(a.questionIndex), Number(a.selectedOption)));
        }

        quiz.questions.forEach((q, idx) => {
            const userChoice = answerMap.get(idx);
            if (userChoice !== undefined && userChoice === q.correctOption) {
                correctCount++;
            }
        });

        const score = Math.round(correctCount * pointsPerQuestion);
        const percentage = Math.round((score / quiz.totalMarks) * 100);

        const submission = await QuizSubmission.create({
            quiz: quizId,
            student: req.user._id,
            answers: answers || [],
            score,
            totalMarks: quiz.totalMarks,
            percentage
        });

        // Add notification
        await Notification.create({
            recipient: req.user._id,
            type: 'success',
            title: 'Quiz Result Available',
            message: `You completed "${quiz.title}" with a score of ${score}/${quiz.totalMarks} (${percentage}%).`
        });

        res.json({
            success: true,
            data: {
                score,
                totalMarks: quiz.totalMarks,
                percentage
            }
        });
    } catch (error) {
        console.error('[schoolStudent:submitQuiz] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Quiz submission failed' });
    }
};

// @desc    Get student profile
// @route   GET /api/school-student/profile
// @access  Private (school_student)
const getStudentProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user._id)
            .select('-password -sessionToken')
            .populate('school', 'name code city')
            .populate('batch', 'name code subject roomVenue scheduleTime');

        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

// @desc    Update student profile (contact details / password only)
// @route   PUT /api/school-student/profile
// @access  Private (school_student)
const updateStudentProfile = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const { studentMobile, fatherMobile, fatherName, password } = req.body;

        if (studentMobile !== undefined) {
            student.studentMobile = studentMobile.trim();
            student.mobileNumber = studentMobile.trim();
        }
        if (fatherMobile !== undefined) student.fatherMobile = fatherMobile.trim();
        if (fatherName !== undefined) student.fatherName = fatherName.trim();
        if (password) {
            student.password = password; // pre-save hook handles hashing
        }

        await student.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                name: student.name,
                email: student.email,
                studentMobile: student.studentMobile,
                fatherMobile: student.fatherMobile,
                fatherName: student.fatherName
            }
        });
    } catch (error) {
        console.error('[schoolStudent:updateStudentProfile] Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Profile update failed' });
    }
};

// @desc    Get in-app notifications
// @route   GET /api/school-student/notifications
// @access  Private (school_student)
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(30);

        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to load notifications' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/school-student/notifications/:id/read
// @access  Private (school_student)
const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id
        });
        if (notification) {
            await notification.markAsRead();
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark read' });
    }
};

// @desc    Get and submit academic help support queries
// @route   GET /api/school-student/help, POST /api/school-student/help
// @access  Private (school_student)
const getHelpTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
    }
};

const createHelpTicket = async (req, res) => {
    try {
        const { subject, issue } = req.body;
        if (!subject || !issue) {
            return res.status(400).json({ success: false, message: 'Subject and issue description are required.' });
        }

        const ticket = await SupportTicket.create({
            student: req.user._id,
            subject: subject.trim(),
            issue: issue.trim(),
            status: 'open',
            priority: 'medium'
        });

        res.status(201).json({
            success: true,
            message: 'Your doubt/support ticket has been submitted to your mentors.',
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Failed to submit ticket' });
    }
};

// @desc    Get class materials for student's batch
// @route   GET /api/school-student/materials
// @access  Private (school_student)
const getBatchMaterials = async (req, res) => {
    try {
        const student = await User.findById(req.user._id).select('batch school');
        if (!student?.batch) {
            return res.json({ success: true, data: [] });
        }

        const materials = await Material.find({
            batch: student.batch,
            status: 'published'
        })
        .populate('uploadedBy', 'name')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: materials
        });
    } catch (error) {
        console.error('[schoolStudent:getBatchMaterials] Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch materials' });
    }
};

module.exports = {
    getPublicSchools,
    registerStudent,
    getDashboard,
    getAttendance,
    getAssignments,
    submitAssignment,
    getQuizzes,
    submitQuiz,
    getStudentProfile,
    updateStudentProfile,
    getNotifications,
    markNotificationRead,
    getHelpTickets,
    createHelpTicket,
    getBatchMaterials
};
