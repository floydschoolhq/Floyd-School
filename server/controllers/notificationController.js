const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        console.error(`[NotificationController:getNotifications] Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve notifications',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.markAsRead();

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error(`[NotificationController:markAsRead] Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update notification',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { $set: { isRead: true, readAt: new Date() } }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error(`[NotificationController:markAllAsRead] Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to update notifications',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
