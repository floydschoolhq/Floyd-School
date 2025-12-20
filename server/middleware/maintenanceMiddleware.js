const Settings = require('../models/Settings');

/**
 * Middleware to check if the platform or specific module is offline
 */
const checkMaintenance = (moduleName = null) => {
    return async (req, res, next) => {
        try {
            const settings = await Settings.getInstance();

            // 1. Check Global Maintenance Mode
            if (settings.maintenanceMode.isActive) {
                // Allow admins to bypass maintenance
                const userRole = req.user?.role || 'guest';
                if (!settings.maintenanceMode.allowedRoles.includes(userRole) && userRole !== 'admin') {
                    return res.status(503).json({
                        success: false,
                        isMaintenance: true,
                        message: settings.maintenanceMode.message
                    });
                }
            }

            // 2. Check Specific Module Lock
            if (moduleName && settings.moduleLocks[moduleName]) {
                const userRole = req.user?.role || 'guest';
                // Only admins can bypass module locks for testing
                if (userRole !== 'admin') {
                    return res.status(423).json({
                        success: false,
                        isLocked: true,
                        message: `The ${moduleName} module is currently offline for maintenance.`
                    });
                }
            }

            next();
        } catch (error) {
            console.error('Maintenance Check Error:', error);
            next(); // Allow request in case of settings failure to prevent total lockout
        }
    };
};

module.exports = checkMaintenance;
