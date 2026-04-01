const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');

// Load env variables first
dotenv.config();

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
const leadRoutes = require('./routes/leadRoutes');
const liveClassRoutes = require('./routes/liveClassRoutes');
const doubtRoutes = require('./routes/doubtRoutes');
const scheduledLiveRoutes = require('./routes/scheduledLiveRoutes');

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173', // Client
    'http://localhost:5174', // Admin
    'http://localhost:5175', // Mentor
    'http://localhost:5176', // GrowthAssociate
    'http://localhost:5177',
    'http://localhost:3000',
    'https://thinkskool-mxyc.vercel.app', // Direct Vercel Origin
    'https://www.thinkskool.in', // Custom domain
    'https://thinkskool.in' // Custom domain without www
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin
        if (!origin) return callback(null, true);

        // Strip trailing slash for comparison
        const cleanOrigin = origin.replace(/\/$/, "");
        const cleanAllowed = allowedOrigins.map(o => o.replace(/\/$/, ""));

        // Check if origin is in allowed list or is a Vercel/Render deployment
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

// CORS configuration for Express
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/code', codeExecutionRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/masterclasses', require('./routes/masterclassRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/growth', require('./routes/growthRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/why-us', require('./routes/whyUsRoutes'));
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/live-chat', require('./routes/liveChatRoutes'));
app.use('/api/doubts', doubtRoutes);
app.use('/api/scheduled-live', scheduledLiveRoutes);
app.use('/api/public', require('./routes/publicRoutes'));

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

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`[SERVER ERROR] ${req.method} ${req.path}:`, err.stack);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

    const { checkAndUpdateStatus } = require('./controllers/scheduledLiveController');
    setInterval(checkAndUpdateStatus, 60000);

    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL ERROR: JWT_SECRET is not defined in environment variables. Server cannot start.');
        process.exit(1);
    }
});

