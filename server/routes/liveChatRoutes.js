const express = require('express');
const router = express.Router();
const { getMessagesByClass, sendMessage, markMessageAsDoubt } = require('../controllers/liveChatController');
const { protect, authorize, checkPermission, classroomProtect } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

router.use(checkMaintenance('chat'));

router.get('/:classId', classroomProtect, checkPermission('canAccessCommunity'), getMessagesByClass);
router.post('/', classroomProtect, checkPermission('canAccessCommunity'), sendMessage);
router.post('/:messageId/doubt', protect, authorize('mentor', 'admin'), markMessageAsDoubt);

module.exports = router;
