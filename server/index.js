const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');

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

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type", "Origin"],
    },
});

// Make io accessible in routes
app.set('io', io);

app.use(cors(
    {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type", "Origin"],
    }
));
app.use(express.json());

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
app.use('/api/why-us', require('./routes/whyUsRoutes'));
app.use('/api/live-classes', liveClassRoutes);

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

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
