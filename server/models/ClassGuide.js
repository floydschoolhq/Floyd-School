const mongoose = require('mongoose');

const classGuideSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        trim: true
    },
    objective: {
        type: String,
        required: true,
        trim: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    teachingPlan: [{
        type: String,
        trim: true
    }],
    activities: [{
        type: String,
        trim: true
    }],
    resources: [{
        type: String,
        trim: true
    }],
    practicalTask: {
        type: String,
        default: '',
        trim: true
    },
    homework: {
        type: String,
        default: '',
        trim: true
    },
    expectedOutcome: {
        type: String,
        default: '',
        trim: true
    },
    mentorNotes: {
        type: String,
        default: '',
        trim: true
    },
    sessionDate: {
        type: Date,
        default: Date.now
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isStudentVisible: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

classGuideSchema.index({ batch: 1, sessionDate: -1 });

const ClassGuide = mongoose.model('ClassGuide', classGuideSchema);

module.exports = ClassGuide;
