const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswerIndex: {
        type: Number,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    points: {
        type: Number,
        default: 10
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartnerSchool',
        required: true
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfflineBatch',
        default: null
    },
    subject: {
        type: String,
        default: 'General STEM'
    },
    questions: [questionSchema],
    timeLimitMinutes: {
        type: Number,
        default: 20
    },
    totalMarks: {
        type: Number,
        default: 100
    },
    dueDate: {
        type: Date
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
