const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getPendingStudents,
    approveStudent,
    markAttendance,
    getAttendanceAnalytics,
    updateAttendanceLog
} = require('../controllers/mentorOfflineController');

// All mentor offline routes require mentor or admin authorization
router.use(protect);
router.use(authorize('mentor', 'admin'));

router.get('/pending-students', getPendingStudents);
router.post('/approve-student', approveStudent);
router.post('/mark-attendance', markAttendance);
router.get('/attendance/analytics', getAttendanceAnalytics);
router.put('/attendance/:logId', updateAttendanceLog);

module.exports = router;
