const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed', 'on-hold'],
        default: 'upcoming'
    },
    capacity: {
        type: Number,
        default: 50
    },
    meetingLink: {
        type: String,
        description: "Default meeting link for this batch"
    }
}, {
    timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
