const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/mentorOfflineController');

// All mentor offline routes require mentor or admin authorization
router.use(protect);
router.use(authorize('mentor', 'admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Batch Management
router.get('/batches', getMyBatches);
router.get('/batches/:id', getBatchById);

// Student Management & Roster
router.get('/students', getStudents);
router.get('/students/:id', getStudentProfile);
router.get('/pending-students', getPendingStudents);
router.post('/approve-student', approveStudent);

// Attendance Management
router.get('/attendance', getAttendanceLogs);
router.post('/mark-attendance', markAttendance);
router.get('/attendance/analytics', getAttendanceAnalytics);
router.put('/attendance/:logId', updateAttendanceLog);

// Quizzes Management & Anti-Cheating Responses
router.get('/quizzes', getQuizzes);
router.post('/quizzes', createQuiz);
router.get('/quizzes/:id', getQuizById);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);
router.get('/quizzes/:id/responses', getQuizResponses);
router.get('/quizzes/:id/responses/:studentId', getQuizResponseDetail);

// Homework Management & Grading
router.get('/homework', getHomework);
router.post('/homework', createHomework);
router.put('/homework/:id', updateHomework);
router.delete('/homework/:id', deleteHomework);
router.get('/homework/:id/submissions', getHomeworkSubmissions);
router.post('/homework/:id/grade', gradeHomework);

// Assignments alias
router.get('/assignments', getHomework);
router.post('/assignments', createHomework);
router.put('/assignments/:id', updateHomework);
router.delete('/assignments/:id', deleteHomework);
router.get('/assignments/:id/submissions', getHomeworkSubmissions);
router.post('/assignments/:id/grade', gradeHomework);

// Class Materials Management
router.get('/materials', getMaterials);
router.post('/materials', upload.single('file'), uploadMaterial);
router.delete('/materials/:id', deleteMaterial);

// Class Guides / Teaching Notes
router.get('/class-guides', getClassGuides);
router.post('/class-guides', createClassGuide);
router.put('/class-guides/:id', updateClassGuide);
router.delete('/class-guides/:id', deleteClassGuide);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
