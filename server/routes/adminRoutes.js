const express = require('express');
const router = express.Router();
const {
    getPlatformStats,
    listUsers,
    updateUserStatus,
    createUser,
    getAllCourses,
    updateCourseStatus,
    getAllLeads,
    broadcastNotification
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getPlatformStats);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.post('/users', createUser);

// New Routes
router.get('/courses', getAllCourses);
router.patch('/courses/:id/status', updateCourseStatus);
router.get('/leads', getAllLeads);
router.post('/broadcast', broadcastNotification);

module.exports = router;
