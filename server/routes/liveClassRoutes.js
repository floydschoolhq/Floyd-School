const express = require('express');
const router = express.Router();
const {
    startLiveClass,
    endLiveClass,
    getActiveLiveClass,
    getAllActiveLiveClasses,
    getEndedLiveClasses,
    deleteLiveClass
} = require('../controllers/liveClassController');
const { protect, authorize, checkPermission, classroomProtect } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

// Apply classroomProtect for classroom users
router.use(classroomProtect);
router.use(checkMaintenance('liveClasses'));

// Student & Mentor can see active classes (Allow all authorized platform roles)
router.get('/active', authorize('student', 'mentor', 'admin', 'associate'), getActiveLiveClass);

// Admin & Associate can see ALL active classes for monitoring
router.get('/active-all', authorize('admin', 'associate'), getAllActiveLiveClasses);

router.get('/archive', authorize('student', 'mentor', 'admin', 'associate'), getEndedLiveClasses);

// Only Mentors can start/end classes
router.post('/start', protect, authorize('mentor', 'admin'), validate(schemas.liveClass), startLiveClass);
router.put('/:id/end', protect, authorize('mentor', 'admin'), endLiveClass);

// Delete archived live classes (Recordings)
router.delete('/:id', protect, authorize('mentor', 'admin'), deleteLiveClass);

module.exports = router;
