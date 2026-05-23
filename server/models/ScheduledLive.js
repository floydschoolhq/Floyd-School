const mongoose = require('mongoose');

const scheduledLiveSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
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
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String
    },
    scheduledStart: {
        type: Date,
        required: true
    },
    scheduledEnd: {
        type: Date
    },
    actualStart: {
        type: Date
    },
    actualEnd: {
        type: Date
    },
    status: {
        type: String,
        enum: ['scheduled', 'live', 'ended', 'cancelled'],
        default: 'scheduled'
    },
    maxParticipants: {
        type: Number,
        default: 500
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

scheduledLiveSchema.index({ scheduledStart: 1 });
scheduledLiveSchema.index({ status: 1 });

const ScheduledLive = mongoose.model('ScheduledLive', scheduledLiveSchema);

module.exports = ScheduledLive;
