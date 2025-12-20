const mongoose = require('mongoose');

const masterclassSchema = new mongoose.Schema({
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
    instructorName: String, // Denormalized for quick access
    instructorRole: String,
    instructorImage: String,

    scheduledDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // "10:00 AM"
        required: true
    },
    endTime: {
        type: String, // "12:00 PM"
        required: true
    },
    duration: Number, // in minutes

    meetingLink: {
        type: String, // Zoom/Google Meet/YouTube link
        required: true
    },

    tags: [{
        type: String
    }],

    category: {
        type: String,
        enum: ['AI & ML', 'System Design', 'Web Development', 'Data Science', 'Cybersecurity', 'Other'],
        default: 'Other'
    },

    maxAttendees: {
        type: Number,
        default: 500
    },

    registeredStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    status: {
        type: String,
        enum: ['scheduled', 'live', 'completed', 'cancelled'],
        default: 'scheduled'
    },

    isFree: {
        type: Boolean,
        default: true
    },

    recordingUrl: String, // For completed sessions

    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for attendee count
masterclassSchema.virtual('attendeeCount').get(function () {
    return this.registeredStudents ? this.registeredStudents.length : 0;
});

// Method to register a student
masterclassSchema.methods.registerStudent = async function (studentId) {
    if (!this.registeredStudents.includes(studentId)) {
        if (this.attendeeCount >= this.maxAttendees) {
            throw new Error('Masterclass is full');
        }
        this.registeredStudents.push(studentId);
        await this.save();
    }
    return this;
};

// Method to unregister a student
masterclassSchema.methods.unregisterStudent = async function (studentId) {
    this.registeredStudents = this.registeredStudents.filter(
        id => id.toString() !== studentId.toString()
    );
    await this.save();
    return this;
};

// Method to check if student is registered
masterclassSchema.methods.isStudentRegistered = function (studentId) {
    return this.registeredStudents.some(
        id => id.toString() === studentId.toString()
    );
};

const Masterclass = mongoose.model('Masterclass', masterclassSchema);

module.exports = Masterclass;
