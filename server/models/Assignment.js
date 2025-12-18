const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxPoints: {
        type: Number,
        default: 100
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed'],
        default: 'published'
    },
    attachments: [{
        filename: String,
        url: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Virtual for checking if assignment is overdue
assignmentSchema.virtual('isOverdue').get(function () {
    return new Date() > this.dueDate && this.status === 'published';
});

// Method to get submission count
assignmentSchema.methods.getSubmissionCount = async function () {
    const Submission = mongoose.model('Submission');
    return await Submission.countDocuments({ assignment: this._id });
};

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
