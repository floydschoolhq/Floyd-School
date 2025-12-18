const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true // e.g., "Senior Software Engineer"
    },
    company: {
        type: String,
        required: true // e.g., "Google"
    },
    companyIcon: {
        type: String,
        default: "Building" // generic icon name
    },
    bio: {
        type: String,
        // Short bio for card
    },
    image: {
        type: String,
        // URL for profile image, or placeholder logic
    },
    linkedIn: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
