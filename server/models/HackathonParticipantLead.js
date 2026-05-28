const mongoose = require('mongoose');

const hackathonParticipantLeadSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        trim: true
    },
    schoolName: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    classGroup: {
        type: String,
        required: true,
        trim: true
    },
    teamMembers: {
        type: Number,
        required: true,
        default: 2
    },
    teamLeaderName: {
        type: String,
        required: true,
        trim: true
    },
    teamLeaderClass: {
        type: String,
        required: true,
        trim: true
    },
    teamLeaderWhatsapp: {
        type: String,
        required: true,
        trim: true
    },
    teamLeaderEmail: {
        type: String,
        required: true,
        trim: true
    },
    teammate2Name: {
        type: String,
        trim: true
    },
    teammate2Class: {
        type: String,
        trim: true
    },
    teammate3Name: {
        type: String,
        trim: true
    },
    teammate3Class: {
        type: String,
        trim: true
    },
    teammate4Name: {
        type: String,
        trim: true
    },
    teammate4Class: {
        type: String,
        trim: true
    },
    parentName: {
        type: String,
        required: true,
        trim: true
    },
    parentRelationship: {
        type: String,
        required: true,
        trim: true
    },
    parentWhatsapp: {
        type: String,
        required: true,
        trim: true
    },
    parentEmail: {
        type: String,
        trim: true
    },
    previousHackathon: {
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

const HackathonParticipantLead = mongoose.model('HackathonParticipantLead', hackathonParticipantLeadSchema);

module.exports = HackathonParticipantLead;
