const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'holiday'],
        default: 'present'
    },
    remarks: {
        type: String,
        default: ''
    }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    topicCovered: {
        type: String,
        default: 'Practical STEM Experiment',
        trim: true
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    academicYear: {
        type: String,
        default: '2025-2026'
    },
    records: [attendanceRecordSchema]
}, {
    timestamps: true
});

// Index for rapid queries by batch, date, and student
attendanceSchema.index({ batch: 1, date: 1 });
attendanceSchema.index({ school: 1, date: 1 });
attendanceSchema.index({ 'records.student': 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
