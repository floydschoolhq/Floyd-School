const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    modules: [{
        title: String,
        description: String,
        order: Number,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    category: {
        type: String,
        enum: ['AI', 'Robotics', 'Coding', 'Web Development', 'Data Science', 'Other'],
        default: 'Other'
    },
    // UI Fields
    icon: {
        type: String, // lucide-react icon name e.g., 'Brain'
        default: 'Code'
    },
    color: {
        type: String, // Tailwind text color class e.g., 'text-purple-500'
        default: 'text-slate-500'
    },
    rating: {
        type: String, // e.g., "4.9"
        default: "4.5"
    },
    tags: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    duration: {
        type: String, // e.g., "8 weeks", "3 months"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Method to enroll a student
courseSchema.methods.enrollStudent = async function (studentId) {
    if (!this.enrolledStudents.includes(studentId)) {
        this.enrolledStudents.push(studentId);
        await this.save();
    }
    return this;
};

// Method to get course progress for a student
courseSchema.methods.getProgress = function () {
    if (this.modules.length === 0) return 0;
    const completedModules = this.modules.filter(m => m.completed).length;
    return Math.round((completedModules / this.modules.length) * 100);
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
