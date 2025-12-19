const express = require('express');
const router = express.Router();
const {
    getPlatformStats,
    getCourses,
    getLeads,
    broadcastNotification,
    getAllUsers,
    deleteUser,
    updateUserStatus,
    createUser,
    getSystemLogs,
    updateCourseStatus
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getPlatformStats);

// User Management Routes
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Logs
router.get('/logs', getSystemLogs);

// Course Management Routes
router.get('/courses', getCourses); // Assuming getCourses from controller maps to this
router.patch('/courses/:id/status', updateCourseStatus); // Assuming updateCourseStatus exists in controller

// Other Admin Routes
router.get('/leads', getLeads);
router.post('/broadcast', broadcastNotification);

module.exports = router;
