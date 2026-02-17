const express = require('express');
const router = express.Router();
const { requestAccess } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student access request
router.post('/request-access', protect, authorize('student'), requestAccess);

module.exports = router;
