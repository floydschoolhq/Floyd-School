const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getMentorOfflineBatches,
    updateBatchSchedule,
    getPendingStudents,
    approveAndAssignBatch,
    getBatchStudents,
    markBatchAttendance,
    createQuizForBatch,
    createAssignmentForBatch,
    getAttendanceAnalytics,
    updateAttendanceRecord
} = require('../controllers/offlineMentorController');

// All routes protected for mentor or admin
router.use(protect);
router.use(authorize('mentor', 'admin', 'school_partner'));

router.get('/batches', getMentorOfflineBatches);
router.put('/batches/:id/schedule', updateBatchSchedule);
router.get('/pending-students', getPendingStudents);
router.post('/approve-student', approveAndAssignBatch);
router.get('/batches/:batchId/students', getBatchStudents);
router.post('/attendance', markBatchAttendance);
router.get('/attendance/analytics', getAttendanceAnalytics);
router.put('/attendance/:logId', updateAttendanceRecord);
router.post('/quizzes', createQuizForBatch);
router.post('/assignments', createAssignmentForBatch);

module.exports = router;
