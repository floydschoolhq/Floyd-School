const express = require('express');
const router = express.Router();
const {
    getStudentDashboard,
    getMentorDashboard,
    getAdminDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Role-specific dashboard routes
router.get('/student', protect, authorize('student'), getStudentDashboard);
router.get('/mentor', protect, authorize('mentor'), getMentorDashboard);
router.get('/admin', protect, authorize('school-admin'), getAdminDashboard);

module.exports = router;
