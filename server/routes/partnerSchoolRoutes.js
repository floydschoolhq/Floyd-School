const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getStats,
    getBatches,
    createBatch,
    getStudents,
    createStudent,
    bulkImportStudents,
    getAttendance,
    markAttendance,
    getAssessments,
    gradeAssignment,
    createSupportTicket,
    getCoordinatorProfile,
    promoteStudents
} = require('../controllers/partnerSchoolController');

// All partner school routes require coordinator or admin authorization
router.use(protect);
router.use(authorize('school_coordinator', 'admin'));

router.get('/stats', getStats);
router.get('/batches', getBatches);
router.post('/batches', createBatch);
router.get('/students', getStudents);
router.post('/students', createStudent);
router.post('/students/bulk', bulkImportStudents);
router.get('/attendance', getAttendance);
router.post('/attendance', markAttendance);
router.get('/assessments', getAssessments);
router.post('/assignments/:id/grade', gradeAssignment);
router.post('/support', createSupportTicket);
router.get('/profile', getCoordinatorProfile);
router.post('/promote-students', promoteStudents);

module.exports = router;
