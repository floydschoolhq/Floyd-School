const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load env variables first
process.chdir(__dirname); // Change to script directory
dotenv.config();
console.log('Environment loaded. RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);

// CRITICAL: Check JWT_SECRET before accepting any requests
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your_jwt_secret_here_change_this_in_production') {
    console.error('CRITICAL ERROR: JWT_SECRET is not defined or is using default value. Server cannot start safely.');
    process.exit(1);
}

// Set MONGODB_URI from MONGO_URI for compatibility
if (process.env.MONGO_URI && !process.env.MONGODB_URI) {
    process.env.MONGODB_URI = process.env.MONGO_URI;
}

const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const codeExecutionRoutes = require('./routes/codeExecutionRoutes');
const codeSnippetRoutes = require('./routes/codeSnippetRoutes');
const leadRoutes = require('./routes/leadRoutes');
const liveClassRoutes = require('./routes/liveClassRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const scheduledLiveRoutes = require('./routes/scheduledLiveRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { handleRazorpayWebhook } = require('./controllers/paymentController');

connectDB();

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

const app = express();
const server = http.createServer(app);

// CRITICAL: Trust proxy to get correct client IP behind Vercel/Render/Nginx load balancers
// Without this, the rate limiter may see all users as having the same IP and block them together.
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173', // Client
    'http://localhost:5174', // Admin
    'http://localhost:5175', // Mentor
    'http://localhost:5176', // GrowthAssociate
    'http://localhost:5177',
    'http://localhost:3000',
    'https://thinkskool-mxyc.vercel.app', // Direct Vercel Origin
    'https://thinkskool-wb9u.vercel.app', // Mentor Panel Vercel Origin
    'https://thinkskool-9kaq.vercel.app', // Growth Associate Panel Vercel Origin
    'https://thinkskool-admin.vercel.app', // Admin Panel Vercel Origin
    'https://www.thinkskool.in', // Custom domain
    'https://thinkskool.in' // Custom domain without www
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Strip trailing slash for comparison
        const cleanOrigin = origin.replace(/\/$/, "");
        const cleanAllowed = allowedOrigins.map(o => o.replace(/\/$/, ""));

        // SECURITY FIX: Only allow exact match origins (removed .vercel.app/.onrender.com wildcards)
        if (cleanAllowed.includes(cleanOrigin)) {
            callback(null, true);
        } else {
            console.error('[CORS ERROR] Blocked Origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "Origin", "Accept"],
    optionsSuccessStatus: 200
};

const io = new Server(server, {
    cors: corsOptions
});

// Make io accessible in routes
app.set('io', io);

// Admin routes
app.use('/admin', adminRoutes);

// ===== SECURITY MIDDLEWARE =====

// Helmet: Sets various HTTP headers for security (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
app.use(cors(corsOptions));

// Morgan: Only use verbose logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Body parser with size limit to prevent large payload attacks
app.use(express.json({
    limit: '10kb',
    verify: (req, res, buf) => {
        req.rawBody = Buffer.from(buf);
    }
}));

// ===== RATE LIMITERS =====

// General API rate limit: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Auth rate limit: 30 attempts per 15 minutes per IP (prevent brute force)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Payment rate limit: 5 orders per 15 minutes per IP (prevent spam)
const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, message: 'Too many payment requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Lead/contact rate limit: 20 submissions per 15 minutes per IP
const formLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many submissions, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

// Database connection health check middleware
app.use((req, res, next) => {
    const isConnected = mongoose.connection.readyState === 1;
    req.dbConnected = isConnected;

    // List of prefixes that REQUIRE database
    const apiPrefixes = ['/api/auth', '/api/dashboard', '/api/courses', '/api/assignments', '/api/students'];
    const isApiRequest = apiPrefixes.some(prefix => req.path.startsWith(prefix));

    if (isApiRequest && !isConnected) {
        return res.status(503).json({
            success: false,
            message: 'Ecosystem Under Maintenance: Database link severed. Please try again in a few moments.',
            dbConnected: false
        });
    }

    next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== ROUTES WITH RATE LIMITERS =====

// Auth routes with brute-force protection
app.use('/api/auth', authLimiter, authRoutes);

// Payment routes with payment-specific rate limiting
app.post('/api/payments/webhook', handleRazorpayWebhook);
app.use('/api/payments', paymentLimiter, paymentRoutes);

// Contact/lead routes with form spam protection
app.use('/api/contact', formLimiter, contactRoutes);
app.use('/api/leads', formLimiter, leadRoutes);
app.use('/api/chatbot', formLimiter, chatbotRoutes);
app.use('/api/school-partnership', formLimiter, require('./routes/schoolPartnershipRoutes'));

// General API routes with standard rate limiting
app.use('/api/courses', generalLimiter, courseRoutes);
app.use('/api/assignments', generalLimiter, assignmentRoutes);
app.use('/api/dashboard', generalLimiter, dashboardRoutes);
app.use('/api/code', generalLimiter, codeExecutionRoutes);
app.use('/api/code-snippets', generalLimiter, codeSnippetRoutes);
app.use('/api/notifications', generalLimiter, require('./routes/notificationRoutes'));
app.use('/api/students', generalLimiter, require('./routes/studentRoutes'));
app.use('/api/mentors', generalLimiter, require('./routes/mentorRoutes'));
app.use('/api/masterclasses', generalLimiter, require('./routes/masterclassRoutes'));
app.use('/api/batches', generalLimiter, require('./routes/batchRoutes'));
app.use('/api/admin', generalLimiter, require('./routes/adminRoutes'));
app.use('/api/growth', generalLimiter, require('./routes/growthRoutes'));
app.use('/api/support', generalLimiter, require('./routes/supportRoutes'));
app.use('/api/comments', generalLimiter, require('./routes/commentRoutes'));
app.use('/api/why-us', generalLimiter, require('./routes/whyUsRoutes'));
app.use('/api/live-classes', generalLimiter, liveClassRoutes);
app.use('/api/live-chat', generalLimiter, require('./routes/liveChatRoutes'));
app.use('/api/doubts', generalLimiter, doubtRoutes);
app.use('/api/scheduled-live', generalLimiter, scheduledLiveRoutes);
app.use('/api/public', require('./routes/publicRoutes'));

// Catch-all for /review requests
app.get('/review', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Reviews endpoint - static data is used on frontend'
    });
});

// Socket.io connection with authentication
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('authenticate', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} authenticated and joined room`);
    });

    // Handle assignment events
    socket.on('assignment:created', (data) => {
        io.emit('assignment:new', data);
    });

    socket.on('assignment:graded', (data) => {
        io.to(data.studentId).emit('assignment:graded', data);
    });

    // Handle course events
    socket.on('course:updated', (data) => {
        io.emit('course:updated', data);
    });

    // Handle student live class tracking
    socket.on('liveClass:join', (classId) => {
        socket.join(`liveClass:${classId}`);
        io.to(`liveClass:${classId}`).emit('liveClass:countUpdate', {
            classId,
            count: io.sockets.adapter.rooms.get(`liveClass:${classId}`)?.size || 0
        });
    });

    socket.on('disconnect', () => {
        // Automatically update counts for all rooms this socket was in
        socket.rooms.forEach(room => {
            if (room.startsWith('liveClass:')) {
                const classId = room.split(':')[1];
                setTimeout(() => {
                    io.to(room).emit('liveClass:countUpdate', {
                        classId,
                        count: io.sockets.adapter.rooms.get(room)?.size || 0
                    });
                }, 100);
            }
        });
        console.log('Client disconnected', socket.id);
    });
});

// 404 handler for unknown API routes (Express 5 syntax)
app.use('/api/{*path}', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`[SERVER ERROR] ${req.method} ${req.path}:`, err.stack);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

    const { checkAndUpdateStatus } = require('./controllers/scheduledLiveController');
    const statusInterval = setInterval(() => {
        checkAndUpdateStatus().catch(err => {
            console.error('[Scheduler] checkAndUpdateStatus error:', err.message);
        });
    }, 60000);

    // Clean up on shutdown
    process.on('SIGTERM', () => {
        clearInterval(statusInterval);
        server.close();
    });
});
