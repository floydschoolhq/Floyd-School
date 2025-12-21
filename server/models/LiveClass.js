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
        enum: ['youtube', 'jitsi', 'google-meet', 'zoom', 'other'],
        default: 'other'
    },
    meetingLink: {
        type: String,
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const LiveClass = mongoose.model('LiveClass', liveClassSchema);

module.exports = LiveClass;
