const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

// CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

// Body parser
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Server is working!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log(`Available at: http://localhost:${PORT}`);
});
