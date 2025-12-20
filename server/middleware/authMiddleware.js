const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Settings = require('../models/Settings');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            return next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// Authorize middleware - checks if user has one of the allowed roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
            });
        }

        next();
    };
};

// Check if a specific platform module is locked
const checkModuleLock = (moduleName) => {
    return async (req, res, next) => {
        try {
            // Admins bypass all locks
            if (req.user && req.user.role === 'admin') {
                return next();
            }

            const settings = await Settings.getInstance();
            if (settings.moduleLocks && settings.moduleLocks[moduleName] === true) {
                return res.status(503).json({
                    success: false,
                    message: `The ${moduleName} sector is currently under maintenance. Access restricted.`,
                    lockActive: true
                });
            }
            next();
        } catch (error) {
            next(); // Fail open to avoid blocking site on settings error, but log it
            console.error(`[LockCheck] Error checking lock for ${moduleName}:`, error);
        }
    };
};

module.exports = { protect, adminOnly, authorize, checkModuleLock };
