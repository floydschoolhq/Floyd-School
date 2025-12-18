const express = require('express');
const router = express.Router();
const {
    startLiveClass,
    endLiveClass,
    getActiveLiveClass
} = require('../controllers/liveClassController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Student & Mentor can see active classes
router.get('/active', protect, getActiveLiveClass);

// Only Mentors can start/end classes
router.post('/start', protect, authorize('mentor', 'admin'), startLiveClass);
router.put('/:id/end', protect, authorize('mentor', 'admin'), endLiveClass);

module.exports = router;
