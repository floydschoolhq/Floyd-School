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
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

// Get assignments (all roles)
router.get('/', protect, getAssignments);

// Create assignment (mentor only)
router.post('/', protect, authorize('mentor', 'admin'), createAssignment);

// Update assignment (mentor/admin only)
router.put('/:id', protect, authorize('mentor', 'admin'), updateAssignment);

// Delete assignment (mentor/admin only)
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteAssignment);

// Get assignments for a specific course
router.get('/course/:courseId', protect, getAssignmentsByCourse);

// File upload for assignment attachments
router.post('/upload', protect, authorize('mentor', 'admin'), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const fileUrl = `/uploads/assignments/${req.file.filename}`;
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
