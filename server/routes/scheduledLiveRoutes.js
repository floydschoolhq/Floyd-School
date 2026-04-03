const express = require('express');
const router = express.Router();
const {
    createScheduledLive,
    getAllScheduledLives,
    getUpcomingScheduledLives,
    getScheduledLiveById,
    updateScheduledLive,
    deleteScheduledLive,
    startLiveNow,
    endLive
} = require('../controllers/scheduledLiveController');
const { protect, authorize, checkPermission, classroomProtect } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

// Apply classroomProtect for classroom users
router.use(classroomProtect);
router.use(checkMaintenance('scheduledLive'));

router.post('/', protect, authorize('mentor', 'admin'), createScheduledLive);

router.get('/', getAllScheduledLives);

router.get('/upcoming', checkPermission('canAccessClassroom'), getUpcomingScheduledLives);

router.get('/:id', checkPermission('canAccessClassroom'), getScheduledLiveById);

router.put('/:id', protect, authorize('mentor', 'admin'), updateScheduledLive);

router.delete('/:id', protect, authorize('mentor', 'admin'), deleteScheduledLive);

router.put('/:id/start', protect, authorize('mentor', 'admin'), startLiveNow);

router.put('/:id/end', protect, authorize('mentor', 'admin'), endLive);

module.exports = router;
