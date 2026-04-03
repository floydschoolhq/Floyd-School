const AccessRequest = require('../models/AccessRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Request access to a feature
 * @route   POST /api/students/request-access
 * @access  Private/Student
 */
exports.requestAccess = async (req, res) => {
    try {
        const { permission, message } = req.body;

        // Validate permission type
        const validPermissions = ['canAccessCourses', 'canAccessLabs', 'canAccessCommunity'];
        if (!validPermissions.includes(permission)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid permission type'
            });
        }

        // Check if user already has this permission
        if (req.user.permissions && req.user.permissions[permission]) {
            return res.status(400).json({
                success: false,
                message: 'You already have this permission'
            });
        }

        // Check for existing pending request
        const existingRequest = await AccessRequest.findOne({
            student: req.user._id,
            requestedPermission: permission,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending request for this permission'
            });
        }

        // Create access request
        const accessRequest = await AccessRequest.create({
            student: req.user._id,
            requestedPermission: permission,
            message: message || ''
        });

        // Notify all admins
        const admins = await User.find({ role: 'admin' }).select('_id');
        const notifications = admins.map(admin => ({
            recipient: admin._id,
            title: 'New Access Request',
            message: `${req.user.name} has requested ${permission.replace('canAccess', '')} access`,
            type: 'info'
        }));

        await Notification.insertMany(notifications);

        // Emit real-time notification
        const io = req.app.get('io');
        if (io) {
            io.emit('access-request', {
                studentName: req.user.name,
                permission
            });
        }

        res.status(201).json({
            success: true,
            message: 'Access request submitted successfully',
            request: accessRequest
        });
    } catch (error) {
        console.error('Request Access Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit access request'
        });
    }
};

/**
 * @desc    Get all access requests (Admin)
 * @route   GET /api/admin/access-requests
 * @access  Private/Admin
 */
exports.getAccessRequests = async (req, res) => {
    try {
        const requests = await AccessRequest.find()
            .populate('student', 'name email')
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Get Access Requests Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch access requests'
        });
    }
};

/**
 * @desc    Approve/Reject access request
 * @route   PATCH /api/admin/access-requests/:id
 * @access  Private/Admin
 */
exports.reviewAccessRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "approved" or "rejected"'
            });
        }

        const request = await AccessRequest.findById(id).populate('student');
        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Access request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request has already been reviewed'
            });
        }

        request.status = status;
        request.reviewedBy = req.user._id;
        request.reviewedAt = Date.now();
        await request.save();

        // If approved, update user permissions
        if (status === 'approved') {
            const student = await User.findById(request.student._id);
            if (student) {
                if (!student.permissions) student.permissions = {};
                student.permissions[request.requestedPermission] = true;
                student.markModified('permissions');
                await student.save();

                // Notify student
                await Notification.create({
                    recipient: student._id,
                    title: 'Access Granted',
                    message: `Your request for ${request.requestedPermission.replace('canAccess', '')} access has been approved`,
                    type: 'success'
                });
            }
        } else {
            // Notify student of rejection
            await Notification.create({
                recipient: request.student._id,
                title: 'Access Request Denied',
                message: `Your request for ${request.requestedPermission.replace('canAccess', '')} access has been denied`,
                type: 'warning'
            });
        }

        res.status(200).json({
            success: true,
            message: `Access request ${status}`,
            request
        });
    } catch (error) {
        console.error('Review Access Request Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to review access request'
        });
    }
};
