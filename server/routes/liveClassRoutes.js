const express = require('express');
const router = express.Router();
const {
    startLiveClass,
    endLiveClass,
    getActiveLiveClass
} = require('../controllers/liveClassController');
const { protect, adminOnly, authorize, checkPermission } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');

// Apply global middleware for this router
router.use(protect);
router.use(checkMaintenance('liveClasses'));

// Student & Mentor can see active classes
router.get('/active', checkPermission('canAccessCourses'), getActiveLiveClass); // 'protect' is now applied via router.use

// Only Mentors can start/end classes
router.post('/start', protect, authorize('mentor', 'admin'), validate(schemas.liveClass), startLiveClass);
router.put('/:id/end', protect, authorize('mentor', 'admin'), endLiveClass);

module.exports = router;
