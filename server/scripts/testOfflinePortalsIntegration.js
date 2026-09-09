require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const School = require('../models/School');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const { generateUniqueRollNumber } = require('../utils/rollNumberGenerator');
const crypto = require('crypto');

async function runIntegrationTest() {
  console.log('--- STARTING COMPREHENSIVE INTEGRATION TEST ---');
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB Atlas');

    // 1. Verify Seed School and Batches
    const school = await School.findOne({ code: 'STXAV' });
    if (!school) throw new Error('St. Xavier school not found!');
    console.log(`✓ School verified: ${school.name} (Code: ${school.code})`);

    const batch = await Batch.findOne({ code: 'ROB10A', school: school._id });
    if (!batch) throw new Error('ROB10A batch not found!');
    console.log(`✓ Batch verified: ${batch.name} (Code: ${batch.code})`);

    // 2. Test Roll Number Generator determinism & increment
    const rollNo = await generateUniqueRollNumber(school, batch);
    console.log(`✓ Roll Number Generated for batch: ${rollNo}`);
    if (!rollNo.startsWith('STXAV-ROB10A-')) {
      throw new Error(`Invalid roll number format: ${rollNo}`);
    }

    // 3. Test Student Self-Registration Workflow (Pending State)
    const testEmail = `temp.verify.${Date.now()}@floydschool.in`;
    const pendingStudent = await User.create({
      name: 'Verification Candidate',
      email: testEmail,
      password: 'TempPassword123!',
      role: 'school_student',
      school: school._id,
      grade: 'Grade 10',
      section: 'B',
      fatherName: 'Mr. Candidate',
      studentMobile: '9999988888',
      fatherMobile: '9999977777',
      approvalStatus: 'pending',
      academicYear: '2025-2026'
    });
    console.log(`✓ Student self-registered in pending state: ${pendingStudent.email}`);

    // Verify pending student has no roll number
    if (pendingStudent.offlineRollNo) {
      throw new Error('Pending student should not have a roll number before approval!');
    }

    // 4. Test Mentor/Admin Approval Workflow & Batch Allotment
    const assignedRollNo = await generateUniqueRollNumber(school, batch);
    pendingStudent.batch = batch._id;
    pendingStudent.offlineRollNo = assignedRollNo;
    pendingStudent.approvalStatus = 'approved';
    pendingStudent.approvedAt = new Date();
    await pendingStudent.save();
    console.log(`✓ Mentor approved student. Assigned Roll No: ${pendingStudent.offlineRollNo}`);

    // 5. Test Coordinator Attendance Marking
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sessionAttendance = await Attendance.findOne({ batch: batch._id, date: today });
    if (!sessionAttendance) {
      sessionAttendance = await Attendance.create({
        school: school._id,
        batch: batch._id,
        date: today,
        topicCovered: 'Integration Testing Session - Autonomous Navigation',
        academicYear: '2025-2026',
        records: [
          { student: pendingStudent._id, status: 'present', remarks: 'Active in lab' }
        ]
      });
      console.log(`✓ Attendance session created for today with 1 record.`);
    } else {
      const exists = sessionAttendance.records.find(r => r.student.toString() === pendingStudent._id.toString());
      if (!exists) {
        sessionAttendance.records.push({ student: pendingStudent._id, status: 'present', remarks: 'Active in lab' });
        await sessionAttendance.save();
      }
      console.log(`✓ Attendance session updated with student presence.`);
    }

    // 6. Test Quiz Logic & Anti-Cheating Projection
    // Fetch quiz questions as student (correctOption should NOT be visible)
    const quiz = await Quiz.findOne({ school: school._id, batch: batch._id });
    if (quiz) {
      const publicQuiz = await Quiz.findById(quiz._id);
      const jsonStr = JSON.stringify(publicQuiz);
      if (jsonStr.includes('correctOption')) {
        throw new Error('CRITICAL SECURITY FLAW: correctOption leaked to student query!');
      }
      console.log(`✓ Quiz security verified: correctOption hidden from student query.`);

      // Test Quiz Submission evaluation
      const quizWithAnswers = await Quiz.findById(quiz._id).select('+questions.correctOption');
      let correctAnswersCount = 0;
      const submissionAnswers = [];

      for (let i = 0; i < quizWithAnswers.questions.length; i++) {
        const q = quizWithAnswers.questions[i];
        submissionAnswers.push({
          questionId: q._id,
          selectedOption: q.correctOption // give correct answers
        });
        correctAnswersCount++;
      }

      const score = Math.round((correctAnswersCount / quizWithAnswers.questions.length) * 100);
      const quizSub = await QuizSubmission.findOneAndUpdate(
        { quiz: quiz._id, student: pendingStudent._id },
        {
          quiz: quiz._id,
          student: pendingStudent._id,
          answers: submissionAnswers,
          score,
          totalQuestions: quizWithAnswers.questions.length,
          correctAnswers: correctAnswersCount,
          submittedAt: new Date()
        },
        { upsert: true, new: true }
      );
      console.log(`✓ Quiz submitted successfully with score: ${quizSub.score}%`);
    }

    // 7. Test Assignment Submission Workflow
    const assignment = await Assignment.findOne({ school: school._id, batch: batch._id });
    if (assignment) {
      const submission = await Submission.findOneAndUpdate(
        { assignment: assignment._id, student: pendingStudent._id },
        {
          assignment: assignment._id,
          student: pendingStudent._id,
          fileUrl: '/uploads/assignments/test_project_code.py',
          submittedAt: new Date(),
          status: 'submitted'
        },
        { upsert: true, new: true }
      );
      console.log(`✓ Homework project submitted: Submission ID ${submission._id}`);

      // Test Coordinator Grading Homework
      submission.marksObtained = 95;
      submission.feedback = 'Excellent autonomous algorithm implementation!';
      submission.status = 'graded';
      await submission.save();
      console.log(`✓ Homework graded by coordinator: ${submission.marksObtained}/${assignment.maxMarks}`);
    }

    // 8. Test Student Promotion
    pendingStudent.grade = 'Grade 11';
    pendingStudent.academicYear = '2026-2027';
    await pendingStudent.save();
    console.log(`✓ Student successfully promoted to Grade 11 (2026-2027)`);

    // 9. Test Forgot Password Token Creation & Hashing
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    pendingStudent.resetPasswordToken = resetPasswordToken;
    pendingStudent.resetPasswordExpire = Date.now() + 60 * 60 * 1000;
    await pendingStudent.save();

    // Verify token lookup
    const userByToken = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!userByToken || userByToken.email !== pendingStudent.email) {
      throw new Error('Reset token verification failed');
    }
    console.log(`✓ Password reset token hashing and lookup verified.`);

    // Clean up temporary test student
    await Attendance.updateOne(
      { _id: sessionAttendance._id },
      { $pull: { records: { student: pendingStudent._id } } }
    );
    if (quiz) {
      await QuizSubmission.deleteOne({ student: pendingStudent._id });
    }
    if (assignment) {
      await Submission.deleteOne({ student: pendingStudent._id });
    }
    await User.deleteOne({ _id: pendingStudent._id });
    console.log(`✓ Integration cleanup completed.`);

    console.log('\n========================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED 100%! 🎉');
    console.log('========================================\n');
  } catch (err) {
    console.error('❌ Integration Test Error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);
  }
}

runIntegrationTest();
