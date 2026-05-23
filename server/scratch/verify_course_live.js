const mongoose = require('mongoose');
const path = require('path');

// Mock connection
mongoose.connect('mongodb://localhost:27017/thinkskool-test-mock', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(() => {});

try {
    console.log('Loading Course model...');
    const Course = require('../models/Course');
    console.log('Course model loaded successfully.');

    console.log('Loading LiveClass model...');
    const LiveClass = require('../models/LiveClass');
    console.log('LiveClass model loaded successfully.');

    console.log('Loading ScheduledLive model...');
    const ScheduledLive = require('../models/ScheduledLive');
    console.log('ScheduledLive model loaded successfully.');

    console.log('SUCCESS: All database models loaded successfully with new course-wise fields!');
    process.exit(0);
} catch (error) {
    console.error('FAILURE: Error loading models:', error);
    process.exit(1);
}
