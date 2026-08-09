const mongoose = require('mongoose');

const offlineBatchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartnerSchool',
        required: true
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    subject: {
        type: String,
        required: true
    },
    scheduleDays: {
        type: [String], // e.g. ['Mon', 'Wed', 'Fri']
        default: ['Mon', 'Wed']
    },
    scheduleTime: {
        type: String, // e.g. '10:00 AM - 11:30 AM'
        default: '10:00 AM - 11:30 AM'
    },
    roomVenue: {
        type: String,
        default: 'Lab 101'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Active', 'Completed', 'Paused'],
        default: 'Active'
    },
    enrolledCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('OfflineBatch', offlineBatchSchema);
