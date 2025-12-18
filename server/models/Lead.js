const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    name: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    type: {
        type: String, // 'newsletter', 'counseling', 'contact'
        default: 'newsletter'
    },
    source: {
        type: String, // 'footer', 'hero', 'popup'
        default: 'unknown'
    },
    topic: {
        type: String, // 'Full Stack', 'Data Science', etc.
        trim: true
    },
    experience: {
        type: String, // 'Class 6-7', etc.
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'closed'],
        default: 'new'
    }
}, {
    timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
