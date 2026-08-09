const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getSchoolStats,
    getSchoolBatches,
    createSchoolBatch,
    getSchoolStudents,
    registerStudent,
    bulkRegisterStudents,
    previewRollNo,
    getAttendanceLogs,
    exportAttendanceReport,
    getQuizAssignmentOverview,
    gradeAssignment,
    submitSupportTicket
} = require('../controllers/partnerSchoolController');

// All routes protected for school_partner or admin
router.use(protect);
router.use(authorize('school_partner', 'admin'));

router.get('/stats', getSchoolStats);
router.get('/batches', getSchoolBatches);
router.post('/batches', createSchoolBatch);
router.get('/students', getSchoolStudents);
router.post('/students', registerStudent);
router.post('/students/bulk', bulkRegisterStudents);
router.get('/generate-rollno', previewRollNo);
router.get('/attendance', getAttendanceLogs);
router.get('/attendance/export', exportAttendanceReport);
router.get('/assessments', getQuizAssignmentOverview);
router.post('/assignments/:id/grade', gradeAssignment);
router.post('/support', submitSupportTicket);

module.exports = router;
