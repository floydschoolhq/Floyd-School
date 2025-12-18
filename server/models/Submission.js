const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        filename: String,
        url: String
    }],
    status: {
        type: String,
        enum: ['submitted', 'graded', 'returned'],
        default: 'submitted'
    },
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    feedback: {
        type: String
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    gradedAt: {
        type: Date
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
submissionSchema.index({ assignment: 1, student: 1 });

// Virtual for checking if submission is late
submissionSchema.virtual('isLate').get(function () {
    if (!this.populated('assignment')) return false;
    return this.submittedAt > this.assignment.dueDate;
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
