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
        enum: ['youtube', 'jitsi', 'google-meet', 'zoom', 'agora', 'premiere', 'other'],
        default: 'other'
    },
    channelName: {
        type: String,
        unique: true,
        sparse: true
    },
    token: {
        type: String
    },
    meetingLink: {
        type: String,
        required: false // Not required for Agora
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
