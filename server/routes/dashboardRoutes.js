const express = require('express');
const router = express.Router();
const { getStudentDashboard, getMentorDashboard, getAssociateDashboard } = require('../controllers/dashboardController');
const { protect, authorize, classroomProtect } = require('../middleware/authMiddleware');

// Role-specific dashboard routes
router.get('/student', classroomProtect, authorize('student'), getStudentDashboard);
router.get('/mentor', protect, authorize('mentor', 'admin'), getMentorDashboard);
router.get('/associate', protect, authorize('growth_associate', 'admin'), getAssociateDashboard);

module.exports = router;

