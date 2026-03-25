const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const axios = require('axios');

// Generate JWT
const generateToken = (id, sessionToken) => {
    // Fallback to avoid hard crash if config is missing, but log a warning
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_emergency_recovery_only';
    if (!process.env.JWT_SECRET) {
        console.warn('CRITICAL WARNING: JWT_SECRET is missing. Using insecure fallback secret.');
    }
    return jwt.sign({ id, sessionToken }, secret, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Restriction: Only allow @thinkskool.com domain
    /*
    if (!email.toLowerCase().endsWith('@thinkskool.com')) {
        return res.status(400).json({
            message: 'Registration restricted: Please use your @thinkskool.com email address.'
        });
    }
    */

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

            // Generate initial session token
            const sessionToken = crypto.randomBytes(16).toString('hex');
            user.sessionToken = sessionToken;
            await user.save();

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
                token: generateToken(user._id, sessionToken),
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
            
            // Single Device Login: Generate new session token and invalidate old ones
            const sessionToken = crypto.randomBytes(16).toString('hex');
            user.sessionToken = sessionToken;
            
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
                token: generateToken(user._id, sessionToken),
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

// @desc    Google OAuth callback
// @route   POST /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
    const { code, redirectUri } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Authorization code is required' });
    }

    try {
        // Validate required environment variables
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
            console.error('Google OAuth credentials not configured properly');
            return res.status(500).json({ 
                message: 'Server configuration error. Please contact administrator.',
                error: 'GOOGLE_OAUTH_NOT_CONFIGURED'
            });
        }

        // Exchange authorization code for tokens
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
        });

        const tokenData = tokenResponse.data;

        if (tokenData.error) {
            console.error('Google token exchange error:', tokenData);
            return res.status(400).json({ 
                message: tokenData.error_description || 'Failed to exchange authorization code',
                error: tokenData.error
            });
        }

        // Get user profile with access token
        const profileResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });

        const profile = profileResponse.data;
        console.log('Google user profile retrieved:', { id: profile.id, email: profile.email, name: profile.name });

        // Check if user exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            // User exists, generate token
            console.log(`[Google Auth] Existing user found: ${user.email}`);
            const sessionToken = crypto.randomBytes(16).toString('hex');
            user.sessionToken = sessionToken;
            user.lastLogin = Date.now();
            await user.save();

            console.log(`[Google Auth] Login successful for: ${user.email}`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
                mobileNumber: user.mobileNumber,
                token: generateToken(user._id, sessionToken),
                needsProfileCompletion: !user.mobileNumber
            });
        } else {
            // Check if user exists with this email
            user = await User.findOne({ email: profile.email });

            if (user) {
                console.warn(`[Google Auth] Email conflict: ${profile.email} already exists with local auth`);
                return res.status(400).json({
                    message: 'An account with this email already exists. Please use the regular login method.'
                });
            }

            // Create new user with Google data
            console.log(`[Google Auth] Creating new user for: ${profile.email}`);
            user = await User.create({
                googleId: profile.id,
                email: profile.email,
                name: profile.name,
                provider: 'google',
                role: 'student',
            });

            const sessionToken = crypto.randomBytes(16).toString('hex');
            user.sessionToken = sessionToken;
            await user.save();

            console.log(`[Google Auth] New user created successfully: ${user.email} (ID: ${user._id})`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                permissions: user.permissions,
                mobileNumber: user.mobileNumber,
                token: generateToken(user._id, sessionToken),
                needsProfileCompletion: true
            });
        }
    } catch (error) {
        console.error('[Google Auth] Authentication error:', error);
        if (error.response) {
            // Google API error
            console.error('[Google Auth] API Error:', error.response.data);
            return res.status(400).json({ 
                message: 'Google authentication failed: ' + (error.response.data?.error_description || error.response.data?.error || 'Unknown error'),
                error: error.response.data?.error || 'GOOGLE_API_ERROR'
            });
        }
        res.status(500).json({ 
            message: 'Internal server error during authentication',
            error: error.message 
        });
    }
};

// @desc    Complete Google user profile
// @route   POST /api/auth/complete-profile
// @access  Private
const completeGoogleProfile = async (req, res) => {
    const { fullName, mobileNumber } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.provider !== 'google') {
            return res.status(400).json({ message: 'This endpoint is only for Google users' });
        }

        user.name = fullName || user.name;
        user.mobileNumber = mobileNumber;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            mobileNumber: user.mobileNumber,
            token: generateToken(user._id, user.sessionToken)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Debug Google OAuth configuration
// @route   GET /api/auth/google/debug
// @access  Public (for debugging only)
const debugGoogleConfig = async (req, res) => {
    try {
        const config = {
            hasClientId: !!process.env.GOOGLE_CLIENT_ID,
            hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
            clientId: process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'not_set',
            nodeEnv: process.env.NODE_ENV,
            mongoUri: process.env.MONGODB_URI ? 'set' : 'not_set',
            jwtSecret: process.env.JWT_SECRET ? 'set' : 'not_set'
        };
        
        console.log('[Google Auth Debug] Configuration check:', config);
        res.json(config);
    } catch (error) {
        console.error('[Google Auth Debug] Error:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser, getMe, googleAuthCallback, completeGoogleProfile, debugGoogleConfig };

