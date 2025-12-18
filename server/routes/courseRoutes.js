const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollStudent
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public/Protected routes
router.get('/', getCourses);
router.get('/:id', protect, getCourseById);

// Mentor/Admin only routes
router.post('/', protect, authorize('mentor', 'school-admin'), createCourse);
router.put('/:id', protect, authorize('mentor', 'school-admin'), updateCourse);

// Admin only routes
router.delete('/:id', protect, authorize('school-admin'), deleteCourse);

// Student enrollment
router.post('/:id/enroll', protect, authorize('student'), enrollStudent);

module.exports = router;
