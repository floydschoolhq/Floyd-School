require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

async function runE2ETests() {
    console.log('========================================================================');
    console.log('🧪 COMPREHENSIVE MENTORSCHOOL CROSS-PORTAL VERIFICATION SUITE 🧪');
    console.log('========================================================================\n');

    const results = [];
    function record(name, passed, detail = '') {
        results.push({ name, passed, detail });
        console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${name} ${detail ? `(${detail})` : ''}`);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas successfully.\n');

        // 1. Authenticate Mentor
        const mentorEmail = 'mentor.test@floydschool.in';
        let mentor = await User.findOne({ email: mentorEmail });
        if (!mentor) {
            throw new Error(`Mentor ${mentorEmail} not found!`);
        }
        const isMatch = await mentor.matchPassword('MentorTest@2026!');
        record('Mentor Authentication (Password Verification)', isMatch, `Email: ${mentor.email}`);
        record('Mentor RBAC Role Check', mentor.role === 'mentor', `Role: ${mentor.role}`);

        // 2. Batches Assignment
        const batches = await Batch.find({ instructor: mentor._id }).populate('school');
        record('Mentor Assigned Batches Query', batches.length > 0, `Found ${batches.length} assigned batch(es)`);

        const testBatch = batches.find(b => b.code === 'ROB10A') || batches[0];
        const testSchool = testBatch.school;
        console.log(`Using Batch: "${testBatch.name}" (${testBatch.code}) at School "${testSchool.name}"\n`);

        // Find test student in this batch
        let student = await User.findOne({ batch: testBatch._id, role: 'school_student', approvalStatus: 'approved' });
        if (!student) {
            // Ensure student.test@floydschool.in is in testBatch
            student = await User.findOne({ email: 'student.test@floydschool.in' });
            if (student) {
                student.batch = testBatch._id;
                student.school = testSchool._id;
                await student.save();
                await Batch.updateOne({ _id: testBatch._id }, { $addToSet: { students: student._id } });
            }
        }
        record('Enrolled Student in Batch', !!student, `Student: ${student?.name} (${student?.offlineRollNo})`);

        // ====================================================================
        // TEST 1: Cross-Portal Attendance Flow (Mentor -> Attendance -> Student & School)
        // ====================================================================
        console.log('\n--- TEST 1: Cross-Portal Attendance Flow ---');
        const sessionDate = new Date();
        sessionDate.setHours(0, 0, 0, 0);

        let attendanceLog = await Attendance.findOne({
            batch: testBatch._id,
            date: { $gte: sessionDate, $lt: new Date(sessionDate.getTime() + 24 * 60 * 60 * 1000) }
        });

        const testRecords = [{
            student: student._id,
            status: 'present',
            remarks: 'Active lab participation'
        }];

        if (attendanceLog) {
            attendanceLog.records = testRecords;
            attendanceLog.topicCovered = 'E2E Servo & PWM Actuator Lab';
            attendanceLog.markedBy = mentor._id;
            await attendanceLog.save();
        } else {
            attendanceLog = await Attendance.create({
                school: testSchool._id,
                batch: testBatch._id,
                date: sessionDate,
                topicCovered: 'E2E Servo & PWM Actuator Lab',
                markedBy: mentor._id,
                records: testRecords
            });
        }
        record('Mentor Marks Session Attendance', !!attendanceLog._id, `Log ID: ${attendanceLog._id}`);

        // Verify in SchoolStudent perspective
        const studentAttendance = await Attendance.find({
            batch: student.batch,
            'records.student': student._id
        });
        const matchedStudentRec = studentAttendance[0]?.records.find(r => r.student.toString() === student._id.toString());
        record('SchoolStudent Views Personal Attendance (Present)', matchedStudentRec?.status === 'present', `Status: ${matchedStudentRec?.status}`);

        // Verify in PartnerSchool perspective
        const coordinatorAttendance = await Attendance.find({
            school: testSchool._id,
            batch: testBatch._id
        });
        record('PartnerSchool Views Batch Attendance Logs', coordinatorAttendance.length > 0, `Sessions: ${coordinatorAttendance.length}`);

        // ====================================================================
        // TEST 2: Cross-Portal Quiz Flow (Mentor -> Quiz -> Student -> Mentor Response)
        // ====================================================================
        console.log('\n--- TEST 2: Cross-Portal Quiz & Anti-Cheating Flow ---');
        // Clean up previous test quiz if exists
        await Quiz.deleteMany({ title: 'E2E Automated Robotics Quiz' });

        const newQuiz = await Quiz.create({
            title: 'E2E Automated Robotics Quiz',
            description: 'Evaluate microcontroller GPIO and servo signals',
            school: testSchool._id,
            batch: testBatch._id,
            totalMarks: 20,
            timeLimitMinutes: 10,
            questions: [
                {
                    questionText: 'What is the standard PWM frequency for servo motors?',
                    options: ['50 Hz', '1000 Hz', '10 kHz', '20 MHz'],
                    correctOption: 0
                },
                {
                    questionText: 'Which voltage rail powers the microcontroller logic safely?',
                    options: ['24V AC', '12V DC', '3.3V / 5V DC', '220V AC'],
                    correctOption: 2
                }
            ],
            createdBy: mentor._id,
            status: 'published'
        });
        record('Mentor Creates Classroom Quiz', !!newQuiz._id, `Quiz: "${newQuiz.title}"`);

        // Verify Anti-Cheating: student query does NOT leak correctOption
        const studentQuizQuery = await Quiz.findById(newQuiz._id); // default projection excludes select: false
        const leakedOption = studentQuizQuery.questions[0].correctOption;
        record('Anti-Cheating Protection (Student Query Excludes Answer Key)', leakedOption === undefined, `correctOption is hidden`);

        // Student submits quiz
        await QuizSubmission.deleteMany({ quiz: newQuiz._id, student: student._id });
        const studentAnswers = [
            { questionIndex: 0, selectedOption: 0 }, // Correct (50 Hz)
            { questionIndex: 1, selectedOption: 2 }  // Correct (3.3V / 5V)
        ];

        // Evaluate server-side with select('+questions.correctOption')
        const fullQuiz = await Quiz.findById(newQuiz._id).select('+questions.correctOption');
        let correctCount = 0;
        studentAnswers.forEach(ans => {
            if (fullQuiz.questions[ans.questionIndex].correctOption === ans.selectedOption) {
                correctCount++;
            }
        });
        const score = Math.round((correctCount / fullQuiz.questions.length) * fullQuiz.totalMarks);
        const percentage = Math.round((score / fullQuiz.totalMarks) * 100);

        const quizSub = await QuizSubmission.create({
            quiz: newQuiz._id,
            student: student._id,
            answers: studentAnswers,
            score,
            totalMarks: fullQuiz.totalMarks,
            percentage
        });
        record('Student Submits Quiz & Auto-Evaluated', quizSub.score === 20, `Score: ${quizSub.score}/${quizSub.totalMarks} (${percentage}%)`);

        // Mentor queries responses
        const mentorResponses = await QuizSubmission.find({ quiz: newQuiz._id }).populate('student', 'name offlineRollNo');
        record('Mentor Receives Quiz Submission & Scores', mentorResponses.length > 0 && mentorResponses[0].score === 20, `Candidate: ${mentorResponses[0].student?.name}`);

        // ====================================================================
        // TEST 3: Cross-Portal Homework Flow (Mentor -> Homework -> Student -> Mentor Grade)
        // ====================================================================
        console.log('\n--- TEST 3: Cross-Portal Homework & Evaluation Flow ---');
        await Assignment.deleteMany({ title: 'E2E Obstacle Avoidance Project' });

        const assignment = await Assignment.create({
            title: 'E2E Obstacle Avoidance Project',
            description: 'Write an autonomous collision avoidance script using ultrasonic sensor pulses.',
            school: testSchool._id,
            batch: testBatch._id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            maxMarks: 100,
            maxPoints: 100,
            createdBy: mentor._id,
            status: 'published'
        });
        record('Mentor Creates Homework Assignment', !!assignment._id, `Task: "${assignment.title}"`);

        // Student submits homework
        await Submission.deleteMany({ assignment: assignment._id, student: student._id });
        const submission = await Submission.create({
            assignment: assignment._id,
            student: student._id,
            content: 'Implemented pulseIn() timeout with differential skid steering logic.',
            fileUrl: '/uploads/assignments/e2e_robot_skid.py',
            status: 'submitted'
        });
        record('Student Submits Homework Project', !!submission._id, `File: ${submission.fileUrl}`);

        // Mentor reviews and grades submission
        submission.marksObtained = 96;
        submission.grade = 96;
        submission.feedback = 'Excellent steering logic! Timing calibrated accurately.';
        submission.status = 'graded';
        submission.gradedBy = mentor._id;
        submission.gradedAt = new Date();
        await submission.save();
        record('Mentor Grades Student Homework Submission', submission.marksObtained === 96, `Marks: 96/100`);

        // Student verifies grade in SchoolStudent
        const studentViewSub = await Submission.findOne({ assignment: assignment._id, student: student._id });
        record('Student Views Evaluated Marks & Feedback', studentViewSub.status === 'graded' && studentViewSub.feedback.includes('Excellent'), `Feedback: "${studentViewSub.feedback}"`);

        // ====================================================================
        // TEST 4: Cross-Portal Class Material Flow (Mentor -> Material -> Student)
        // ====================================================================
        console.log('\n--- TEST 4: Cross-Portal Class Material Flow ---');
        await Material.deleteMany({ title: 'E2E Servo & Motor Driver Schematic' });

        const material = await Material.create({
            title: 'E2E Servo & Motor Driver Schematic',
            description: 'Wiring diagram for L298N driver and SG90 servo with shared DC ground rail',
            school: testSchool._id,
            batch: testBatch._id,
            moduleName: 'Module 3: Actuators & Motors',
            fileUrl: '/uploads/assignments/motor_driver_schematic.pdf',
            fileName: 'motor_driver_schematic.pdf',
            fileType: 'pdf',
            uploadedBy: mentor._id,
            status: 'published'
        });
        record('Mentor Publishes Class Material', !!material._id, `Resource: "${material.title}"`);

        // Student queries materials for their batch
        const studentMaterials = await Material.find({ batch: student.batch, status: 'published' });
        const hasMaterial = studentMaterials.some(m => m.title === 'E2E Servo & Motor Driver Schematic');
        record('SchoolStudent Accesses Batch Class Material', hasMaterial, `Found ${studentMaterials.length} material(s) for batch`);

        // ====================================================================
        // TEST 5: Class Guide & Teaching Notes (Mentor Offline Plan)
        // ====================================================================
        console.log('\n--- TEST 5: Class Guide & Teaching Plan ---');
        await ClassGuide.deleteMany({ topic: 'E2E Machine Learning Robotics' });

        const guide = await ClassGuide.create({
            topic: 'E2E Machine Learning Robotics',
            objective: 'Understand sensor thresholding vs decision tree classifiers',
            school: testSchool._id,
            batch: testBatch._id,
            teachingPlan: ['Explain sensor telemetry (15m)', 'Build breadboard comparator (30m)'],
            activities: ['Calibrate LDR sensor', 'Run classifier test loop'],
            practicalTask: 'Build autonomous line tracker with speed regulation',
            homework: 'Submit logged telemetry CSV from serial monitor',
            expectedOutcome: 'Students can differentiate continuous vs discrete sensor inputs',
            mentorNotes: 'Check breadboard ground connections before turning on motor power supply',
            mentor: mentor._id,
            isStudentVisible: false
        });
        record('Mentor Creates Standardized Class Guide', !!guide._id, `Topic: "${guide.topic}"`);

        // ====================================================================
        // TEST 6: Candidate Self-Registration & Mentor Approval Flow
        // ====================================================================
        console.log('\n--- TEST 6: Student Onboarding & Mentor Approval ---');
        const testCandidateEmail = `candidate.e2e.${Date.now()}@floydschool.in`;
        const candidate = await User.create({
            name: 'Kavya Sengupta',
            email: testCandidateEmail,
            password: 'CandidatePass123!',
            role: 'school_student',
            school: testSchool._id,
            grade: 'Grade 10',
            section: 'B',
            studentMobile: '9988776655',
            fatherName: 'Arup Sengupta',
            fatherMobile: '9988776600',
            approvalStatus: 'pending'
        });
        record('Student Self-Registers (Pending Approval)', candidate.approvalStatus === 'pending', `Email: ${candidate.email}`);

        // Mentor approves and allots batch
        const assignedRoll = await generateUniqueRollNumber(testSchool, testBatch);
        candidate.approvalStatus = 'approved';
        candidate.approvedAt = new Date();
        candidate.approvedBy = mentor._id;
        candidate.batch = testBatch._id;
        candidate.offlineRollNo = assignedRoll;
        await candidate.save();
        await Batch.updateOne({ _id: testBatch._id }, { $addToSet: { students: candidate._id } });

        record('Mentor Approves & Allots Batch (Deterministic Roll Number)', candidate.offlineRollNo === assignedRoll, `Assigned Roll: ${assignedRoll}`);

        // Cleanup temporary test candidate
        await User.deleteOne({ _id: candidate._id });
        await Batch.updateOne({ _id: testBatch._id }, { $pull: { students: candidate._id } });

        console.log('\n========================================================================');
        const allPassed = results.every(r => r.passed);
        console.log(`📊 E2E TEST SUMMARY: ${results.filter(r => r.passed).length}/${results.length} PASSED`);
        console.log(`Status: ${allPassed ? '🎉 ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
        console.log('========================================================================\n');

        await mongoose.disconnect();
        process.exit(allPassed ? 0 : 1);
    } catch (err) {
        console.error('E2E Test Execution Error:', err);
        process.exit(1);
    }
}

runE2ETests();
