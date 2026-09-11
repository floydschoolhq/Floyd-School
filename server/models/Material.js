const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    moduleName: {
        type: String,
        trim: true,
        default: 'General Lab Material'
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        default: 'material'
    },
    fileType: {
        type: String,
        enum: ['pdf', 'ppt', 'doc', 'code', 'image', 'link', 'other'],
        default: 'pdf'
    },
    fileSize: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'published'
    }
}, {
    timestamps: true
});

materialSchema.index({ batch: 1, createdAt: -1 });
materialSchema.index({ school: 1, batch: 1 });

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
