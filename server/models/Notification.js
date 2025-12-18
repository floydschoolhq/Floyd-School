const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: [
            'assignment_created',
            'assignment_graded',
            'course_enrolled',
            'course_updated',
            'submission_received',
            'general'
        ],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        // Can reference different models based on type
    },
    relatedModel: {
        type: String,
        enum: ['Assignment', 'Course', 'Submission', null]
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
    this.isRead = true;
    this.readAt = new Date();
    await this.save();
    return this;
};

// Static method to create and emit notification
notificationSchema.statics.createAndEmit = async function (data, io) {
    const notification = await this.create(data);

    // Emit via Socket.io if io instance is provided and valid
    if (io && typeof io.to === 'function') {
        try {
            io.to(data.recipient.toString()).emit('notification:new', notification);
        } catch (error) {
            console.error('Socket.io emit error:', error.message);
        }
    }

    return notification;
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
