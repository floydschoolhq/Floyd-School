const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/db-check', async (req, res) => {
    try {
        const User = require('../models/User');
        const count = await User.countDocuments();
        const connection = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
        res.json({
            status: 'Diagnostic Active',
            database: connection,
            userCount: count,
            mongodb_uri_present: !!process.env.MONGO_URI
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
