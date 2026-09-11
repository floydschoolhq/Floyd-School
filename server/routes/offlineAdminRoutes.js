const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const offlineAdminController = require('../controllers/offlineAdminController');

// Multer memory storage for spreadsheet parsing
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Enforce authentication & admin authorization on all routes
router.use(protect, adminOnly);

// 1. Dashboard
router.get('/dashboard', offlineAdminController.getDashboardMetrics);

// 2. Schools
router.get('/schools', offlineAdminController.getSchools);
router.post('/schools', offlineAdminController.createSchool);
router.get('/schools/:id', offlineAdminController.getSchoolById);
router.put('/schools/:id', offlineAdminController.updateSchool);
router.delete('/schools/:id/archive', offlineAdminController.archiveSchool);

// 3. Students
router.get('/students', offlineAdminController.getStudents);
router.post('/students', offlineAdminController.createStudent);
router.get('/students/:id', offlineAdminController.getStudentById);
router.put('/students/:id', offlineAdminController.updateStudent);
router.put('/students/:id/batch', offlineAdminController.reassignStudentBatch);
router.put('/students/:id/status', offlineAdminController.updateStudentStatus);

// 4. Excel Import Wizard
router.post('/students/import-preview', upload.single('file'), offlineAdminController.previewStudentImport);
router.post('/students/import-confirm', offlineAdminController.confirmStudentImport);

// 5. Mentors
router.get('/mentors', offlineAdminController.getMentors);
router.post('/mentors', offlineAdminController.createMentor);
router.put('/mentors/:id', offlineAdminController.updateMentor);

// 6. Coordinators
router.get('/coordinators', offlineAdminController.getCoordinators);
router.post('/coordinators', offlineAdminController.createCoordinator);

// 7. Batches
router.get('/batches', offlineAdminController.getBatches);
router.post('/batches', offlineAdminController.createBatch);
router.get('/batches/:id', offlineAdminController.getBatchById);
router.put('/batches/:id', offlineAdminController.updateBatch);
router.post('/batches/:id/assign-students', offlineAdminController.assignStudentsToBatch);

// 8. Attendance Analytics
router.get('/attendance', offlineAdminController.getAttendanceAnalytics);

// 9. Progress Analytics
router.get('/progress', offlineAdminController.getProgressAnalytics);

// 10. Assignments & Quizzes
router.get('/assignments', offlineAdminController.getAssignments);
router.post('/assignments', offlineAdminController.createAssignment);
router.get('/quizzes', offlineAdminController.getQuizzes);
router.post('/quizzes', offlineAdminController.createQuiz);

// 11. Materials
router.get('/materials', offlineAdminController.getMaterials);
router.post('/materials', offlineAdminController.createMaterial);
router.delete('/materials/:id', offlineAdminController.deleteMaterial);

// 12. Permissions Matrix
router.get('/permissions', offlineAdminController.getPermissionsMatrix);

// 13. System Announcements
router.post('/announcements', offlineAdminController.sendAnnouncement);

// 14. Maintenance Control
router.get('/maintenance', offlineAdminController.getMaintenanceSettings);
router.put('/maintenance', offlineAdminController.updateMaintenanceSettings);

// 15. System Health & Incident Management
router.get('/system-health', offlineAdminController.getSystemHealth);
router.get('/audit-logs', offlineAdminController.getAuditLogs);

// 16. Platform Settings
router.get('/settings', offlineAdminController.getSettings);
router.put('/settings', offlineAdminController.updateSettings);

// 17. Reports Export (CSV)
router.get('/reports/export', offlineAdminController.exportReport);

module.exports = router;
