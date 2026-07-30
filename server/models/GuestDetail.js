const mongoose = require('mongoose');

const guestDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters']
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        trim: true,
        match: [/^\d{10}$/, 'Mobile must be exactly 10 digits']
    },
    class: {
        type: String,
        required: [true, 'Class is required'],
        enum: {
            values: ['6', '7', '8', '9', '10', '11', '12', 'College', 'Other'],
            message: 'Invalid class selection'
        }
    },
    section: {
        type: String,
        required: [true, 'Section is required'],
        trim: true
    },
    school: {
        type: String,
        trim: true,
        default: ''
    },
    city: {
        type: String,
        trim: true,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    },
    device: {
        type: String,
        default: ''
    },
    browser: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['New', 'Active', 'Contacted', 'Converted'],
        default: 'New'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient queries
guestDetailSchema.index({ mobile: 1 });
guestDetailSchema.index({ createdAt: -1 });
guestDetailSchema.index({ status: 1 });
guestDetailSchema.index({ class: 1 });

module.exports = mongoose.model('GuestDetail', guestDetailSchema);
