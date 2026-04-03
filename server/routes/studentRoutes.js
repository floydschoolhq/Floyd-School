const express = require('express');
const router = express.Router();
const { requestAccess } = require('../controllers/studentController');
const { protect, authorize, classroomProtect } = require('../middleware/authMiddleware');

// Student access request
router.post('/request-access', classroomProtect, authorize('student'), requestAccess);

module.exports = router;
