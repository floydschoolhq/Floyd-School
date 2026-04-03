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

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Single Device Login Check
            // If the user's current session token in DB does not match the token's session token,
            // it means they logged in somewhere else.
            if (user.sessionToken && decoded.sessionToken && user.sessionToken !== decoded.sessionToken) {
                return res.status(401).json({ message: 'Session expired. You logged in from another device.' });
            }

            req.user = user;

            return next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token was provided
    return res.status(401).json({ message: 'Not authorized, no token' });
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

const checkPermission = (permissionName) => {
    return (req, res, next) => {
        // Safety check: Ensure next is a function
        if (typeof next !== 'function') {
            console.error('[checkPermission] next is not a function!');
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        // Safety check: Ensure user is authenticated (protect middleware should run first)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required before checking permissions'
            });
        }

        // Admins and Mentors bypass all permission checks
        if (req.user.role === 'admin' || req.user.role === 'mentor') {
            return next();
        }

        // Check if user has the specific permission
        if (req.user.permissions && req.user.permissions[permissionName] === true) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `Access denied. You do not have the ${permissionName} permission.`,
            permissionDenied: true
        });
    };
};

// Classroom-specific auth middleware - accepts JWT tokens from Firebase auth
const classroomProtect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Check session token for regular users
            // Skip for classroom users who might not have sessionToken in DB
            if (user.sessionToken && decoded.sessionToken && user.sessionToken !== decoded.sessionToken) {
                return res.status(401).json({ message: 'Session expired. You logged in from another device.' });
            }

            req.user = user;

            return next();
        } catch (error) {
            console.error('Classroom token verification error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    return res.status(401).json({ message: 'No token provided' });
};

module.exports = { protect, adminOnly, authorize, checkModuleLock, checkPermission, classroomProtect };