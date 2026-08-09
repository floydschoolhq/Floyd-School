const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/schoolStudentController');

const upload = require('../middleware/uploadMiddleware');

// Public Unprotected Routes
router.get('/public-schools', getPublicSchools);
router.post('/register', registerSchoolStudent);

// Protected Routes for school_student or admin or student
router.use(protect);
router.use(authorize('school_student', 'student', 'admin'));

router.get('/dashboard', getStudentDashboard);
router.get('/attendance', getMyAttendance);
router.get('/quizzes', getQuizzes);
router.post('/quizzes/:id/submit', submitQuiz);
router.get('/assignments', getAssignments);
router.post('/assignments/:id/submit', upload.single('file'), submitAssignment);
router.get('/help', getHelpTickets);
router.post('/help', submitHelpTicket);

module.exports = router;
