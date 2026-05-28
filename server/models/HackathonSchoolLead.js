const mongoose = require('mongoose');

const hackathonSchoolLeadSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: true,
        trim: true
    },
    schoolAddress: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    principalName: {
        type: String,
        required: true,
        trim: true
    },
    yourName: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    whatsappNumber: {
        type: String,
        required: true,
        trim: true
    },
    preferredMonth: {
        type: String,
        required: true,
        trim: true
    },
    expectedStudents: {
        type: String,
        required: true,
        trim: true
    },
    hallAvailable: {
        type: String,
        required: true,
        trim: true
    },
    projectorAvailable: {
        type: String,
        required: true,
        trim: true
    },
    additionalInfo: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'in-progress', 'converted', 'closed'],
        default: 'new'
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const HackathonSchoolLead = mongoose.model('HackathonSchoolLead', hackathonSchoolLeadSchema);

module.exports = HackathonSchoolLead;
