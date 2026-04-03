const express = require('express');
const router = express.Router();
const {
    getAssignments,
    createAssignment,
    submitAssignment,
    gradeAssignment,
    getSubmissions,
    updateAssignment,
    deleteAssignment,
    getAssignmentsByCourse
} = require('../controllers/assignmentController');
const upload = require('../middleware/uploadMiddleware');
const { protect, adminOnly, authorize, checkPermission, classroomProtect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

// Use classroomProtect for assignments - accepts both regular and classroom JWT
router.use(classroomProtect);
router.use(checkMaintenance('assignments'));

// Get assignments (all roles)
router.get('/', protect, checkPermission('canAccessCourses'), getAssignments);

// Create assignment (mentor only)
router.post('/', protect, authorize('mentor', 'admin'), createAssignment);

// Update assignment (mentor/admin only)
router.put('/:id', protect, authorize('mentor', 'admin'), updateAssignment);

// Delete assignment (mentor/admin only)
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteAssignment);

// Student Submissions
router.post('/:id/submit', protect, authorize('student'), checkPermission('canAccessCourses'), submitAssignment);
router.get('/:id/submissions', protect, authorize('mentor', 'admin'), getSubmissions);
router.post('/submissions/:id/grade', protect, authorize('mentor', 'admin'), gradeAssignment);

// Get assignments for a specific course
router.get('/course/:courseId', protect, checkPermission('canAccessCourses'), getAssignmentsByCourse);

// File upload for assignment attachments
router.post('/upload', protect, authorize('mentor', 'admin'), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/ uploads / assignments / ${req.file.filename} `;
    res.status(200).json({
        success: true,
        file: {
            filename: req.file.originalname,
            url: fileUrl,
            size: req.file.size
        }
    });
});

module.exports = router;
