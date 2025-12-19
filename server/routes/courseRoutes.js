const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollStudent,
    updateModules,
    getMentorRoster,
    createAnnouncement
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

// Public/Protected routes
router.get('/', getCourses);
router.get('/:id', protect, getCourseById);

// Mentor/Admin only routes
router.post('/', protect, authorize('mentor', 'admin'), validate(schemas.course), createCourse);
router.put('/:id', protect, authorize('mentor', 'admin'), validate(schemas.course), updateCourse);
router.patch('/:id/modules', protect, authorize('mentor', 'admin'), updateModules);
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteCourse);

// Roster
router.get('/mentor/roster', protect, authorize('mentor'), getMentorRoster);

// Announcements
router.post('/:id/announce', protect, authorize('mentor', 'admin'), validate(schemas.announcement), createAnnouncement);


// Student enrollment
router.post('/:id/enroll', protect, authorize('student'), enrollStudent);

module.exports = router;
