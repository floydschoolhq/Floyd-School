const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    liveClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveClass',
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Doubt = mongoose.model('Doubt', doubtSchema);

module.exports = Doubt;
