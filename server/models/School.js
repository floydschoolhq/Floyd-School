const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
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
    city: {
        type: String,
        trim: true,
        default: ''
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    contactPerson: {
        type: String,
        trim: true,
        default: ''
    },
    contactEmail: {
        type: String,
        trim: true,
        default: ''
    },
    contactPhone: {
        type: String,
        trim: true,
        default: ''
    },
    // Requirement 26: Multiple coordinators support
    coordinators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    studentQuota: {
        type: Number,
        default: 500
    },
    isActive: {
        type: Boolean,
        default: true
    },
    academicYear: {
        type: String,
        default: '2025-2026'
    }
}, {
    timestamps: true
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;
