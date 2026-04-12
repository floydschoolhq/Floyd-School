const express = require('express');
const router = express.Router();
const {
    getSnippet,
    saveSnippet,
    deleteSnippet
} = require('../controllers/codeSnippetController');
const { protect, checkPermission } = require('../middleware/authMiddleware');
const checkMaintenance = require('../middleware/maintenanceMiddleware');

router.get('/:languageId', protect, checkPermission('canAccessLabs'), checkMaintenance('codingLab'), getSnippet);
router.put('/:languageId', protect, checkPermission('canAccessLabs'), checkMaintenance('codingLab'), saveSnippet);
router.delete('/:languageId', protect, checkPermission('canAccessLabs'), checkMaintenance('codingLab'), deleteSnippet);

module.exports = router;
