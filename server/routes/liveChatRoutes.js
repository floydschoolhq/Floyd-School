const express = require('express');
const router = express.Router();
const { getMessagesByClass, sendMessage } = require('../controllers/liveChatController');
const { protect, checkPermission, classroomProtect } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

router.use(checkMaintenance('chat'));

router.get('/:classId', classroomProtect, checkPermission('canAccessCommunity'), getMessagesByClass);
router.post('/', classroomProtect, checkPermission('canAccessCommunity'), sendMessage);

module.exports = router;
