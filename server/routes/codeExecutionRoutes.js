const express = require('express');
const router = express.Router();
const {
    executeCode,
    getLanguages,
    getSubmissionStatus
} = require('../controllers/codeExecutionController');
const { protect, checkPermission } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

router.use(checkMaintenance('codingLab'));

// Execute code (protected route)
router.post('/execute', protect, checkPermission('canAccessLabs'), executeCode);

// Get supported languages (public)
router.get('/languages', getLanguages);

// Get submission status (protected)
router.get('/submission/:token', protect, getSubmissionStatus);

module.exports = router;
