const Settings = require('../models/Settings');

/**
 * @desc    Get global platform settings
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();
        res.status(200).json({
            success: true,
            settings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update global platform settings
 * @route   PATCH /api/admin/settings
 * @access  Private/Admin
 */
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.getInstance();

        // Update fields provided in req.body
        const updates = req.body;

        // Handle nested maintenanceMode and moduleLocks updates
        if (updates.maintenanceMode) {
            settings.maintenanceMode = { ...settings.maintenanceMode, ...updates.maintenanceMode };
        }
        if (updates.moduleLocks) {
            settings.moduleLocks = { ...settings.moduleLocks, ...updates.moduleLocks };
        }
        if (updates.globalConfig) {
            settings.globalConfig = { ...settings.globalConfig, ...updates.globalConfig };
        }
        if (updates.security) {
            settings.security = { ...settings.security, ...updates.security };
        }
        if (updates.platformName) {
            settings.platformName = updates.platformName;
        }

        await settings.save();

        // Emit socket event for real-time synchronization
        const io = req.app.get('io');
        if (io) {
            io.emit('system:config_updated', settings);
        }

        res.status(200).json({
            success: true,
            message: 'Platform configuration synchronized successfully.',
            settings
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
