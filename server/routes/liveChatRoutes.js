const express = require('express');
const router = express.Router();
const { getMessagesByClass, sendMessage } = require('../controllers/liveChatController');
const { protect, checkPermission } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

router.use(checkMaintenance('chat'));

router.get('/:classId', protect, checkPermission('canAccessCommunity'), getMessagesByClass);
router.post('/', protect, checkPermission('canAccessCommunity'), sendMessage);

module.exports = router;
