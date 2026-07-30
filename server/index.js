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
    console.log('MongoDB disconnected — attempting reconnect in 5s...');
    setTimeout(() => {
        connectDB().catch(err => console.error('Reconnect failed:', err.message));
    }, 5000);
});

const app = express();
const server = http.createServer(app);

// CRITICAL: Trust proxy to get correct client IP behind Vercel/Render/Nginx load balancers
// Without this, the rate limiter may see all users as having the same IP and block them together.
app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:3000',

    // Vercel
    'https://floyd-school-admin.vercel.app',

    // Website
    'https://floydschool.in',
    'https://www.floydschool.in',

    // If you're still using ThinkSkool
    'https://thinkskool-admin.vercel.app',
    'https://thinkskool.in',
    'https://www.thinkskool.in'
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Strip trailing slash for comparison
        const cleanOrigin = origin.replace(/\/$/, "");
        const cleanAllowed = allowedOrigins.map(o => o.replace(/\/$/, ""));

        // Allow exact matches or any Vercel/Render deployment origins
        if (cleanAllowed.includes(cleanOrigin) || cleanOrigin.endsWith('.vercel.app') || cleanOrigin.endsWith('.onrender.com')) {
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

    // Auth routes are NEVER blocked — the controller handles DB errors gracefully
    // so that students can always attempt login (they get a proper error from Mongoose, not a 503)
    const bypassPrefixes = ['/api/auth', '/api/public', '/api/health'];
    const isBypass = bypassPrefixes.some(prefix => req.path.startsWith(prefix));
    if (isBypass) return next();

    // All other data routes require an active DB connection
    const apiPrefixes = ['/api/dashboard', '/api/courses', '/api/assignments', '/api/students'];
    const isApiRequest = apiPrefixes.some(prefix => req.path.startsWith(prefix));

    if (isApiRequest && !isConnected) {
        return res.status(503).json({
            success: false,
            message: 'Service temporarily unavailable. Please try again in a few moments.',
            dbConnected: false
        });
    }

    next();
});

// Health check endpoint (used by Render for uptime monitoring)
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.status(dbState === 1 ? 200 : 503).json({
        status: dbState === 1 ? 'ok' : 'degraded',
        db: states[dbState] || 'unknown',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Serve static files
const fs = require('fs');
const uploadsPath = path.resolve(process.cwd(), 'uploads');
const assignmentsPath = path.resolve(uploadsPath, 'assignments');
if (!fs.existsSync(assignmentsPath)) {
    fs.mkdirSync(assignmentsPath, { recursive: true });
}
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));


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
app.use('/api/hackathon', formLimiter, require('./routes/hackathonRoutes'));

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
app.use('/api/coupons', generalLimiter, require('./routes/couponRoutes'));
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

    // Helper to emit viewer counts & profiles dynamically
    const sendLiveClassViewersUpdate = (classId) => {
        if (!classId) return;
        const roomName = `liveClass:${classId}`;
        const socketsInRoom = io.sockets.adapter.rooms.get(roomName);
        let count = 0;
        const uniqueUsers = [];
        const seenUserIds = new Set();

        if (socketsInRoom) {
            count = socketsInRoom.size;
            for (const socketId of socketsInRoom) {
                const clientSocket = io.sockets.sockets.get(socketId);
                if (clientSocket && clientSocket.user) {
                    const userId = clientSocket.user._id || clientSocket.user.id;
                    if (userId && !seenUserIds.has(userId.toString())) {
                        seenUserIds.add(userId.toString());
                        uniqueUsers.push(clientSocket.user);
                    }
                }
            }
        }

        io.to(roomName).emit('liveClass:countUpdate', {
            classId,
            count,
            viewers: uniqueUsers
        });
    };

    // Handle student live class tracking
    socket.on('liveClass:join', (data) => {
        let classId;
        let userData = null;
        if (data && typeof data === 'object') {
            classId = data.classId;
            userData = data.user;
        } else {
            classId = data;
        }

        if (!classId) return;

        socket.join(`liveClass:${classId}`);
        socket.liveClassId = classId;
        if (userData) {
            socket.user = userData;
        }

        sendLiveClassViewersUpdate(classId);
    });

    socket.on('liveClass:leave', (classId) => {
        if (!classId) return;
        socket.leave(`liveClass:${classId}`);
        if (socket.liveClassId === classId) {
            delete socket.liveClassId;
        }
        sendLiveClassViewersUpdate(classId);
    });

    socket.on('disconnecting', () => {
        // Automatically update counts for all rooms this socket was in before they are cleared
        socket.rooms.forEach(room => {
            if (room.startsWith('liveClass:')) {
                const classId = room.split(':')[1];
                setTimeout(() => {
                    sendLiveClassViewersUpdate(classId);
                }, 100);
            }
        });
    });

    socket.on('disconnect', () => {
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
