const express = require('express');
const router = express.Router();
const {
    getAssignments,
    createAssignment,
    submitAssignment,
    gradeAssignment,
    getSubmissions
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

// Get assignments (all roles)
router.get('/', protect, getAssignments);

// Create assignment (mentor only)
router.post('/', protect, authorize('mentor', 'admin'), createAssignment);

// Submit assignment (student only)
router.post('/:id/submit', protect, authorize('student'), submitAssignment);

// Grade assignment (mentor only)
router.put('/:id/grade', protect, authorize('mentor', 'admin'), validate(schemas.grading), gradeAssignment);

// Get submissions for an assignment (mentor/admin only)
router.get('/:id/submissions', protect, authorize('mentor', 'admin'), getSubmissions);

module.exports = router;
