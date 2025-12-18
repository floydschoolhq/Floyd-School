const mongoose = require('mongoose');

const WhyUsSchema = new mongoose.Schema({
    mainTitle: {
        type: String,
        required: true,
        default: "WHY US"
    },
    video: {
        url: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        speakerName: {
            type: String,
            required: true
        },
        speakerRole: {
            type: String,
            required: true
        },
        caption: {
            type: String,
            required: true
        }
    },
    features: [{
        title: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },
        color: {
            type: String,
            default: "text-white"
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('WhyUs', WhyUsSchema);
