const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/schoolStudentController');

// Public endpoints
router.get('/public-schools', getPublicSchools);
router.post('/register', registerStudent);

// Protected student routes
router.use(protect);
router.use(authorize('school_student', 'student', 'admin'));

router.get('/dashboard', getDashboard);
router.get('/attendance', getAttendance);
router.get('/assignments', getAssignments);
router.post('/assignments/:id/submit', upload.single('file'), submitAssignment);
router.get('/quizzes', getQuizzes);
router.post('/quizzes/:id/submit', submitQuiz);
router.get('/materials', getBatchMaterials);
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);
router.get('/help', getHelpTickets);
router.post('/help', createHelpTicket);

module.exports = router;
