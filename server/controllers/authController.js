const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    // Fallback to avoid hard crash if config is missing, but log a warning
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_emergency_recovery_only';
    if (!process.env.JWT_SECRET) {
        console.warn('CRITICAL WARNING: JWT_SECRET is missing. Using insecure fallback secret.');
    }
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Restriction: Only allow @thinkskool.com domain
    if (!email.toLowerCase().endsWith('@thinkskool.com')) {
        return res.status(400).json({
            message: 'Registration restricted: Please use your @thinkskool.com email address.'
        });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'student',
        });

        if (user) {
            // Emit socket event
            const io = req.app.get('io');
            if (io) {
                io.emit('new-user', { name: user.name, role: user.role });
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    console.log(`[Auth] Login attempt for email: ${email}`);

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.warn(`[Auth] User not found: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            console.log(`[Auth] Login successful for: ${email} (${user.role})`);
            // Update lastLogin
            user.lastLogin = Date.now();
            await user.save();

            // Emit socket event
            const io = req.app.get('io');
            if (io) {
                io.emit('user-login', { name: user.name, role: user.role });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
                token: generateToken(user._id),
            });
        } else {
            console.warn(`[Auth] Password mismatch for: ${email}`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(`[Auth] CRITICAL LOGIN ERROR for ${email}:`, error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication',
            error: error.message
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe };

