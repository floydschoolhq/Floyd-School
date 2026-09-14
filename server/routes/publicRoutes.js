const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Settings = require('../models/Settings');
const { getPublicCourseStats } = require('../controllers/courseController');

/**
 * @desc    Get public platform settings (maintenance status, etc)
 * @route   GET /api/public/settings
 * @access  Public
 */
router.get('/settings', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json({
                success: true,
                maintenanceMode: false,
                offlineMaintenance: {},
                platformName: 'Floyd School'
            });
        }
        const settings = await Settings.getInstance();
        res.status(200).json({
            success: true,
            maintenanceMode: settings.maintenanceMode,
            offlineMaintenance: settings.offlineMaintenance,
            platformName: settings.platformName
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * @desc    Get granular offline portal maintenance status
 * @route   GET /api/public/maintenance-status
 * @access  Public
 */
router.get('/maintenance-status', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                success: true,
                isMaintenance: false,
                message: 'Platform operational',
                expectedEndTime: null,
                details: {}
            });
        }
        const { portal } = req.query;
        const settings = await Settings.getInstance();
        const offlineMaint = settings.offlineMaintenance || {};

        const globalActive = offlineMaint.entirePlatform?.isActive || false;
        let portalActive = false;
        let portalMessage = '';
        let endTime = null;

        if (portal && offlineMaint[portal]) {
            portalActive = offlineMaint[portal].isActive || false;
            portalMessage = offlineMaint[portal].message || '';
            endTime = offlineMaint[portal].endTime || null;
        }

        const isMaintenance = globalActive || portalActive;
        const message = globalActive ? (offlineMaint.entirePlatform?.message || 'Platform under maintenance') : portalMessage;
        const expectedEndTime = globalActive ? (offlineMaint.entirePlatform?.endTime || null) : endTime;

        res.json({
            success: true,
            isMaintenance,
            message,
            expectedEndTime,
            details: offlineMaint
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * @desc    Get public course enrollment stats
 * @route   GET /api/public/courses/:id/stats
 * @access  Public
 */
router.get('/courses/:id/stats', getPublicCourseStats);

module.exports = router;
