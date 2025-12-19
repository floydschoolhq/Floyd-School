const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'warning', 'error', 'critical'],
        default: 'info'
    },
    event: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    ip: {
        type: String,
        default: 'Unknown'
    },
    resource: {
        type: String,
        default: 'System'
    },
    metadata: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
});

// Auto-expire logs after 30 days to keep DB clean
systemLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('SystemLog', systemLogSchema);
