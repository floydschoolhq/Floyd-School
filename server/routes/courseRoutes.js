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
    createAnnouncement,
    updateEnrollmentStats
} = require('../controllers/courseController');
const { protect, authorize, checkPermission, classroomProtect } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

// Public/Protected routes - accepts both regular JWT and classroom JWT
router.get('/', classroomProtect, getCourses);
router.get('/:id', classroomProtect, checkPermission('canAccessCourses'), getCourseById);

// Mentor/Admin only routes
router.post('/', protect, authorize('mentor', 'admin'), validate(schemas.course), createCourse);
router.put('/:id', protect, authorize('mentor', 'admin'), validate(schemas.course), updateCourse);
router.patch('/:id/modules', protect, authorize('mentor', 'admin'), updateModules);
router.patch('/:id/enrollment-stats', protect, authorize('mentor', 'admin'), updateEnrollmentStats);
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteCourse);

// Roster
router.get('/mentor/roster', protect, authorize('mentor'), getMentorRoster);

// Announcements
router.post('/:id/announce', protect, authorize('mentor', 'admin'), validate(schemas.announcement), createAnnouncement);


// Student enrollment
router.post('/:id/enroll', classroomProtect, authorize('student'), checkPermission('canAccessCourses'), enrollStudent);

module.exports = router;
