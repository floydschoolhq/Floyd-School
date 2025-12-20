const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const path = require('path');

// Load env variables first
dotenv.config();

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

connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:5173', // Client
    'http://localhost:5174', // Admin
    'http://localhost:5175', // Mentor
    'http://localhost:5176', // GrowthAssociate
    'http://localhost:5177',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list or is a Vercel deployment
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
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

app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('ThinkSkool API is running');
})

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
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});

