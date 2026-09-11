const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    actorName: {
        type: String,
        default: 'System'
    },
    actorRole: {
        type: String,
        default: 'admin'
    },
    action: {
        type: String,
        required: true,
        trim: true
    },
    targetType: {
        type: String,
        required: true,
        trim: true
    },
    targetId: {
        type: String,
        default: ''
    },
    targetName: {
        type: String,
        default: ''
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String,
        default: '127.0.0.1'
    },
    status: {
        type: String,
        enum: ['success', 'failure'],
        default: 'success'
    }
}, {
    timestamps: true
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
