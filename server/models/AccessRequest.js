const mongoose = require('mongoose');

const accessRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedPermission: {
        type: String,
        enum: ['canAccessCourses', 'canAccessLabs', 'canAccessCommunity'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String,
        default: ''
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const AccessRequest = mongoose.model('AccessRequest', accessRequestSchema);

module.exports = AccessRequest;
