const mongoose = require('mongoose');

const partnerSchoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    principalName: {
        type: String,
        default: ''
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    contactPhone: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    partnershipStatus: {
        type: String,
        enum: ['Active', 'Pending', 'Suspended'],
        default: 'Active'
    },
    activeBatchesCount: {
        type: Number,
        default: 0
    },
    studentQuota: {
        type: Number,
        default: 500
    },
    curriculumPlan: {
        type: String,
        default: 'Standard STEM & AI Curriculum'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PartnerSchool', partnerSchoolSchema);
