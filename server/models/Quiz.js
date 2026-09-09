const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    options: [{
        type: String,
        required: true,
        trim: true
    }],
    correctOption: {
        type: Number,
        required: true,
        select: false // SECURITY: Never leak correct answer to client during quiz fetch
    }
}, { _id: false });

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    },
    totalMarks: {
        type: Number,
        default: 20
    },
    timeLimitMinutes: {
        type: Number,
        default: 15
    },
    questions: [questionSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed'],
        default: 'published'
    }
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
