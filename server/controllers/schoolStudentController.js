const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const OfflineAssignment = require('../models/OfflineAssignment');
const SupportTicket = require('../models/SupportTicket');
const PartnerSchool = require('../models/PartnerSchool');
const generateToken = require('../utils/generateToken');

// @desc Get public list of active partner schools for student signup dropdown
// @route GET /api/school-student/public-schools
const getPublicSchools = async (req, res) => {
    try {
        const schools = await PartnerSchool.find({ partnershipStatus: 'Active' })
            .select('name code city')
            .sort({ name: 1 });
        res.json({ success: true, data: schools });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Self-registration for offline school students (Pending Batch Allocation)
// @route POST /api/school-student/register
const registerSchoolStudent = async (req, res) => {
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
            schoolId
        } = req.body;

        const userExists = await User.findOne({ email: email.toLowerCase().trim() });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
        }

        const student = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: password || 'password123',
            role: 'school_student',
            schoolId,
            batchId: null,
            offlineRollNo: null,
            grade: grade || 'Grade 10',
            section: section || 'A',
            fatherName: fatherName || '',
            studentMobile: studentMobile || '',
            fatherMobile: fatherMobile || '',
            approvalStatus: 'Pending_Approval',
            provider: 'local'
        });

        const token = generateToken(student._id);

        const io = req.app.get('io');
        if (io) {
            io.emit('new-pending-student', { 
                id: student._id, 
                name: student.name, 
                schoolId: student.schoolId, 
                grade: student.grade 
            });
        }

        res.status(201).json({
            success: true,
            message: 'Registration submitted successfully. Awaiting batch allotment by mentor.',
            token,
            data: {
                _id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                schoolId: student.schoolId,
                approvalStatus: student.approvalStatus
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Get student dashboard & batch status
// @route GET /api/school-student/dashboard
const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user._id;

        const student = await User.findById(studentId)
            .populate('schoolId', 'name code city address')
            .populate('batchId', 'name code scheduleDays scheduleTime roomVenue subject');

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // If pending batch assignment
        if (student.approvalStatus === 'Pending_Approval' || !student.batchId) {
            return res.json({
                success: true,
                isPendingApproval: true,
                data: {
                    student: {
                        name: student.name,
                        email: student.email,
                        grade: student.grade,
                        section: student.section,
                        fatherName: student.fatherName,
                        schoolName: student.schoolId ? student.schoolId.name : 'Partner School',
                        approvalStatus: 'Pending_Approval'
                    },
                    notice: 'Your registration request has been submitted to your school offline mentor. Once your mentor selects your batch section, your primary key roll number will be generated and full dashboard features will unlock.'
                }
            });
        }

        const schoolIdVal = student.schoolId?._id || student.schoolId;
        const batchIdVal = student.batchId?._id || student.batchId;

        // Attendance stats
        const attendanceRecords = await Attendance.find({
            schoolId: schoolIdVal,
            batchId: batchIdVal,
            'records.studentId': studentId
        });

        let totalClasses = attendanceRecords.length;
        let attendedClasses = 0;
        attendanceRecords.forEach(doc => {
            const record = doc.records?.find(r => r.studentId && r.studentId.toString() === studentId.toString());
            if (record && (record.status === 'present' || record.status === 'late')) {
                attendedClasses++;
            }
        });

        const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

        // Quizzes
        const quizzes = await Quiz.find({ 
            schoolId: schoolIdVal, 
            $or: [{ batchId: batchIdVal }, { batchId: { $exists: false } }, { batchId: null }],
            isPublished: true 
        });
        const submissions = await QuizSubmission.find({ studentId });
        const completedQuizIds = new Set(submissions.map(s => s.quizId ? s.quizId.toString() : ''));
        const pendingQuizzesCount = quizzes.filter(q => !completedQuizIds.has(q._id.toString())).length;

        // Assignments
        const assignments = await OfflineAssignment.find({ 
            schoolId: schoolIdVal, 
            batchId: batchIdVal 
        });
        let pendingAssignmentsCount = 0;
        assignments.forEach(a => {
            const sub = a.submissions?.find(s => s.studentId && s.studentId.toString() === studentId.toString());
            if (!sub) pendingAssignmentsCount++;
        });

        res.json({
            success: true,
            isPendingApproval: false,
            data: {
                student: {
                    name: student.name,
                    email: student.email,
                    rollNo: student.offlineRollNo,
                    grade: `${student.grade} - Section ${student.section || 'A'}`,
                    fatherName: student.fatherName,
                    schoolName: student.schoolId ? student.schoolId.name : 'Partner School',
                    batchName: student.batchId ? student.batchId.name : 'Offline Batch',
                    scheduleDays: student.batchId ? student.batchId.scheduleDays : ['Mon', 'Wed', 'Fri'],
                    scheduleTime: student.batchId ? student.batchId.scheduleTime : '10:00 AM - 11:30 AM',
                    venue: student.batchId ? student.batchId.roomVenue : 'Lab 101',
                    approvalStatus: student.approvalStatus
                },
                stats: {
                    totalClasses,
                    attendedClasses,
                    attendancePercentage,
                    pendingQuizzesCount,
                    pendingAssignmentsCount
                }
            }
        });
    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get student attendance details
// @route GET /api/school-student/attendance
const getMyAttendance = async (req, res) => {
    try {
        const studentId = req.user._id;

        const attendanceRecords = await Attendance.find({
            'records.studentId': studentId
        })
        .populate('batchId', 'name code roomVenue subject')
        .sort({ date: -1 });

        const history = attendanceRecords.map(doc => {
            const rec = doc.records.find(r => r.studentId.toString() === studentId.toString());
            return {
                date: doc.date,
                batchName: doc.batchId ? doc.batchId.name : 'Offline Batch',
                status: rec ? rec.status : 'absent',
                remarks: rec ? rec.remarks : '',
                topicCovered: doc.topicCovered || 'Practical Lab Session'
            };
        });

        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get student quizzes strictly scoped to student batch
// @route GET /api/school-student/quizzes
const getQuizzes = async (req, res) => {
    try {
        const studentId = req.user._id;
        const user = await User.findById(studentId);
        let schoolId = user.schoolId;
        let batchId = user.batchId;

        if (user.approvalStatus === 'Pending_Approval' || !batchId) {
            return res.json({ success: true, data: [] });
        }

        const query = { schoolId, isPublished: true };
        if (batchId) {
            query.$or = [{ batchId }, { batchId: { $exists: false } }, { batchId: null }];
        }

        const quizzes = await Quiz.find(query).lean();
        const submissions = await QuizSubmission.find({ studentId }).lean();
        const submissionMap = new Map(submissions.map(s => [s.quizId.toString(), s]));

        const results = quizzes.map(q => {
            const sub = submissionMap.get(q._id.toString());
            return {
                ...q,
                isCompleted: !!sub,
                score: sub ? sub.score : null,
                percentage: sub ? sub.percentage : null,
                submittedAt: sub ? sub.submittedAt : null
            };
        });

        res.json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Submit quiz answers
// @route POST /api/school-student/quizzes/:id/submit
const submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const studentId = req.user._id;
        const { answers } = req.body;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const existingSub = await QuizSubmission.findOne({ quizId, studentId });
        if (existingSub) {
            return res.status(400).json({ success: false, message: 'Quiz already submitted' });
        }

        let calculatedScore = 0;
        const processedAnswers = [];

        quiz.questions.forEach((q, idx) => {
            const userAns = answers.find(a => a.questionIndex === idx);
            const selectedOpt = userAns ? userAns.selectedOption : -1;
            const isCorrect = selectedOpt === q.correctAnswerIndex;
            if (isCorrect) calculatedScore += (q.points || 10);

            processedAnswers.push({
                questionIndex: idx,
                selectedOption: selectedOpt,
                isCorrect
            });
        });

        const percentage = quiz.totalMarks > 0 ? Math.round((calculatedScore / quiz.totalMarks) * 100) : 0;

        const submission = await QuizSubmission.create({
            quizId,
            studentId,
            answers: processedAnswers,
            score: calculatedScore,
            totalQuestions: quiz.questions.length,
            percentage
        });

        res.status(201).json({ success: true, data: submission });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Get student assignments
// @route GET /api/school-student/assignments
const getAssignments = async (req, res) => {
    try {
        const studentId = req.user._id;
        const user = await User.findById(studentId);
        if (user.approvalStatus === 'Pending_Approval' || !user.batchId) {
            return res.json({ success: true, data: [] });
        }

        const assignments = await OfflineAssignment.find({ batchId: user.batchId });

        const formatted = assignments.map(a => {
            const mySubmission = a.submissions.find(s => s.studentId.toString() === studentId.toString());
            return {
                _id: a._id,
                title: a.title,
                description: a.description,
                dueDate: a.dueDate,
                maxMarks: a.maxMarks,
                isSubmitted: !!mySubmission,
                submission: mySubmission || null
            };
        });

        res.json({ success: true, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Submit assignment
// @route POST /api/school-student/assignments/:id/submit
const submitAssignment = async (req, res) => {
    try {
        const assignmentId = req.params.id;
        const studentId = req.user._id;
        const { submissionText } = req.body;
        let fileUrl = req.body.fileUrl || '';

        if (req.file) {
            fileUrl = `/uploads/assignments/${req.file.filename}`;
        }

        const assignment = await OfflineAssignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        const existingIndex = assignment.submissions.findIndex(s => s.studentId.toString() === studentId.toString());

        if (existingIndex >= 0) {
            assignment.submissions[existingIndex].submissionText = submissionText || assignment.submissions[existingIndex].submissionText;
            if (fileUrl) assignment.submissions[existingIndex].fileUrl = fileUrl;
            assignment.submissions[existingIndex].submittedAt = Date.now();
        } else {
            assignment.submissions.push({
                studentId,
                submissionText: submissionText || '',
                fileUrl: fileUrl || '',
                submittedAt: Date.now(),
                status: 'Submitted'
            });
        }

        await assignment.save();

        const io = req.app.get('io');
        if (io) {
            io.emit('new-assignment-submission', { assignmentId, studentId });
        }

        res.json({ success: true, message: 'Assignment submitted successfully', fileUrl });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc Get student help tickets & staff replies
// @route GET /api/school-student/help
const getHelpTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ student: req.user._id })
            .populate('messages.sender', 'name role')
            .sort({ updatedAt: -1 });

        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Submit help ticket / doubt for offline student
// @route POST /api/school-student/help
const submitHelpTicket = async (req, res) => {
    try {
        const { subject, issue, priority } = req.body;

        const ticket = await SupportTicket.create({
            student: req.user._id,
            subject: `[Offline Student] ${subject}`,
            issue,
            priority: priority || 'medium',
            messages: [{
                sender: req.user._id,
                text: issue
            }]
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('new-support-ticket', { id: ticket._id, subject: ticket.subject, studentId: req.user._id });
        }

        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getPublicSchools,
    registerSchoolStudent,
    getStudentDashboard,
    getMyAttendance,
    getQuizzes,
    submitQuiz,
    getAssignments,
    submitAssignment,
    getHelpTickets,
    submitHelpTicket
};
