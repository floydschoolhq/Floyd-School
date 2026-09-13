const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        default: ''
    },
    expectedOutput: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    }
}, { _id: true });

const codingProblemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    category: {
        type: String,
        enum: ['Variables', 'Conditions', 'Loops', 'Functions', 'Arrays', 'Strings', 'Basic Problem Solving'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inputFormat: {
        type: String,
        default: ''
    },
    outputFormat: {
        type: String,
        default: ''
    },
    constraints: {
        type: String,
        default: ''
    },
    starterTemplates: {
        python: { type: String, default: '' },
        javascript: { type: String, default: '' },
        cpp: { type: String, default: '' },
        c: { type: String, default: '' },
        java: { type: String, default: '' }
    },
    sampleTestCases: [testCaseSchema],
    hiddenTestCases: [{
        input: { type: String, default: '' },
        expectedOutput: { type: String, required: true }
    }],
    points: {
        type: Number,
        default: 100
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

codingProblemSchema.index({ category: 1, difficulty: 1 });
codingProblemSchema.index({ order: 1 });

const CodingProblem = mongoose.model('CodingProblem', codingProblemSchema);

module.exports = CodingProblem;
