const mongoose = require('mongoose');

const submissionItemSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissionText: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        default: ''
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Submitted', 'Graded', 'Late'],
        default: 'Submitted'
    },
    marksObtained: {
        type: Number,
        default: null
    },
    feedback: {
        type: String,
        default: ''
    }
});

const offlineAssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartnerSchool',
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfflineBatch',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxMarks: {
        type: Number,
        default: 100
    },
    submissions: [submissionItemSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('OfflineAssignment', offlineAssignmentSchema);
