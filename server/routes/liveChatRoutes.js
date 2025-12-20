const express = require('express');
const router = express.Router();
const { getMessagesByClass, sendMessage } = require('../controllers/liveChatController');
const { protect } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

router.use(checkMaintenance('chat'));

router.get('/:classId', protect, getMessagesByClass);
router.post('/', protect, sendMessage);

module.exports = router;
