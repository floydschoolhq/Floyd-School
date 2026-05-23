const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentorName: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'ended'],
        default: 'active'
    },
    topic: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        enum: ['youtube', 'jitsi', 'google-meet', 'zoom', 'premiere', 'other'],
        default: 'other'
    },
    meetingLink: {
        type: String,
        required: false
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    },
    duration: {
        type: Number, // In seconds
        default: 3600 // 1 hour default
    },
    attendants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const LiveClass = mongoose.model('LiveClass', liveClassSchema);

module.exports = LiveClass;
