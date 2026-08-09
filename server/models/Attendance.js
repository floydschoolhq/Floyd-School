const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        default: 'present'
    },
    remarks: {
        type: String,
        default: ''
    }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfflineBatch',
        required: true
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PartnerSchool',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    records: [attendanceRecordSchema],
    topicCovered: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

attendanceSchema.index({ batchId: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
