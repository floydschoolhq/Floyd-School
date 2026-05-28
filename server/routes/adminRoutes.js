const express = require('express');
const router = express.Router();
const {
    getPlatformStats,
    getCourses,
    getLeads,
    broadcastNotification,
    getAllUsers,
    createUser,
    deleteUser,
    updateUserStatus,
    updateUserPermissions,
    updateUserCourseAccess,
    getSystemLogs,
    processSystemCommand,
    updateCourseStatus,
    getGrowthIntelligence,
    getFrictionDetails,
    toggleUserStatus,
    updateLeadStatus,
    deleteLead,
    getPaymentRecords,
    updateCourseEnrollmentStats,
    updateCoursePrice
} = require('../controllers/adminController');
const { getAccessRequests, reviewAccessRequest } = require('../controllers/studentController');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Heartbeat route for diagnostics
router.get('/health', (req, res) => {
    console.log('[Admin Heartbeat] Signal received.');
    res.status(200).json({ success: true, message: 'Admin sector operational.' });
});

router.use(protect);
router.use(adminOnly);

// Log administrative access for debugging
router.use((req, res, next) => {
    console.log(`[Admin Activity] ${req.method} ${req.originalUrl} - User: ${req.user?.email || 'Unknown'}`);
    next();
});

// Telemetry
router.get('/stats', getPlatformStats);

// Governance
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/users/:id/permissions', updateUserPermissions);
router.patch('/users/:id/course-access', updateUserCourseAccess);
router.delete('/users/:id', deleteUser);

// Infrastructure Logs
router.get('/logs', getSystemLogs);

// Curriculum
router.get('/courses', getCourses);
router.patch('/courses/:id/status', updateCourseStatus);
router.patch('/courses/:id/enrollment-stats', updateCourseEnrollmentStats);
router.patch('/courses/:id/price', updateCoursePrice);

// ThinkOS Settings
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);
router.post('/system/command', processSystemCommand);

// Intelligence
router.get('/leads', getLeads);
router.patch('/leads/:id/status', updateLeadStatus);
router.delete('/leads/:id', deleteLead);
router.get('/growth-intelligence', getGrowthIntelligence);
router.get('/friction/:moduleTitle', getFrictionDetails);
router.get('/payments', getPaymentRecords);
router.post('/broadcast', broadcastNotification);

// Access Requests
router.get('/access-requests', getAccessRequests);
router.patch('/access-requests/:id', reviewAccessRequest);

// Chatbot Leads
router.use('/chatbot', require('./chatbotRoutes'));

// School Partnership Leads
router.use('/school-partnership', require('./schoolPartnershipRoutes'));

// Hackathon Leads
router.use('/hackathon', require('./hackathonRoutes'));

module.exports = router;
