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
    getSystemLogs,
    processSystemCommand,
    updateCourseStatus
} = require('../controllers/adminController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
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

// Settings
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);
router.post('/system/command', processSystemCommand);

// Other Admin Routes
router.get('/leads', getLeads);
router.post('/broadcast', broadcastNotification);

module.exports = router;
