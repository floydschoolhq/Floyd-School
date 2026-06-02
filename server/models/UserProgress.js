const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId
    }],
    completedClasses: [{
        type: String // Format: "moduleId-classNumber"
    }]
}, {
    timestamps: true
});

// Ensure a single progress tracking record per student-course pair
userProgressSchema.index({ student: 1, course: 1 }, { unique: true });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
