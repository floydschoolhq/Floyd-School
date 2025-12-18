const express = require('express');
const router = express.Router();
const {
    getStudentDashboard
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Role-specific dashboard routes
router.get('/student', protect, authorize('student'), getStudentDashboard);

module.exports = router;
