const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { registerUser, loginUser, getMe, googleAuthCallback, completeGoogleProfile, firebaseAuthCallback, getAllStudents } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/google/callback', googleAuthCallback);
router.post('/firebase/callback', firebaseAuthCallback);
router.post('/complete-profile', protect, completeGoogleProfile);
router.get('/students', protect, getAllStudents);

// REMOVED: Google OAuth debug endpoint (was leaking server config info in production)
// router.get('/google/debug', debugGoogleConfig);

module.exports = router;