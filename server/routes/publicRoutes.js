const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

/**
 * @desc    Get public platform settings (maintenance status, etc)
 * @route   GET /api/public/settings
 * @access  Public
 */
router.get('/settings', async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        res.status(200).json({
            success: true,
            maintenanceMode: settings.maintenanceMode,
            platformName: settings.platformName
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
