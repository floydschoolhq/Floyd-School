const mongoose = require('mongoose');

const masterclassSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: String, // Or ref to Mentor, but simple string is easier for display
        required: true
    },
    role: {
        type: String, // e.g. "Ex-Google"
    },
    company: {
        type: String
    },
    date: {
        type: Date
    },
    time: {
        type: String
    },
    image: {
        type: String // URL
    },
    students: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

const Masterclass = mongoose.model('Masterclass', masterclassSchema);

module.exports = Masterclass;
