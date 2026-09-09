const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    startDate: {
        type: Date,
        required: false,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed', 'on-hold'],
        default: 'active'
    },
    capacity: {
        type: Number,
        default: 50
    },
    meetingLink: {
        type: String,
        description: "Default meeting link for this batch"
    },
    // Offline Partner School Fields
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    code: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        default: 'Robotics & STEM Lab'
    },
    scheduleDays: [{
        type: String
    }],
    scheduleTime: {
        type: String,
        default: '10:00 AM - 11:30 AM'
    },
    roomVenue: {
        type: String,
        default: 'Lab 101'
    },
    academicYear: {
        type: String,
        default: '2025-2026'
    }
}, {
    timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
