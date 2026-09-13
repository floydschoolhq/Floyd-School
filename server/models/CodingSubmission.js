const mongoose = require('mongoose');

const testCaseResultSchema = new mongoose.Schema({
    testCaseIndex: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    input: { type: String, default: '' },
    expectedOutput: { type: String, default: '' },
    actualOutput: { type: String, default: '' },
    executionTime: { type: String, default: '0' },
    error: { type: String, default: null },
    isHidden: { type: Boolean, default: false }
}, { _id: false });

const codingSubmissionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodingProblem',
        required: true,
        index: true
    },
    languageId: {
        type: Number,
        required: true
    },
    languageName: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Internal Error'],
        required: true
    },
    passedTestCases: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    },
    testCaseResults: [testCaseResultSchema],
    executionTime: {
        type: String,
        default: '0'
    },
    memoryUsage: {
        type: String,
        default: '0'
    }
}, {
    timestamps: true
});

codingSubmissionSchema.index({ student: 1, problem: 1 });
codingSubmissionSchema.index({ student: 1, createdAt: -1 });
codingSubmissionSchema.index({ problem: 1, status: 1 });

const CodingSubmission = mongoose.model('CodingSubmission', codingSubmissionSchema);

module.exports = CodingSubmission;
