const mongoose = require('mongoose');

const schoolPartnershipLeadSchema = new mongoose.Schema({
    schoolName: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    classes: {
        type: String,
        trim: true
    },
    domain: {
        type: String,
        trim: true
    },
    approxStudents: {
        type: Number,
        default: 0
    },
    requirements: {
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

const SchoolPartnershipLead = mongoose.model('SchoolPartnershipLead', schoolPartnershipLeadSchema);

module.exports = SchoolPartnershipLead;