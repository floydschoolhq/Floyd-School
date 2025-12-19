const express = require('express');
const router = express.Router();
const { getPlatformStats, listUsers, updateUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getPlatformStats);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);

module.exports = router;
