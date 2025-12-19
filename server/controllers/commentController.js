const Comment = require('../models/Comment');

// Get all comments (for moderation)
exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .sort({ createdAt: -1 });
        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get comments for a module
exports.getCommentsByModule = async (req, res) => {
    try {
        const comments = await Comment.find({
            module: req.params.moduleId,
            status: { $ne: 'confirmed' }
        })
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Post a new comment
exports.createComment = async (req, res) => {
    try {
        const { moduleId, text, moduleTitle } = req.body;
        const comment = await Comment.create({
            module: moduleId,
            moduleTitle,
            student: req.user._id,
            studentName: req.user.name,
            text
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.replies.push({
            user: req.user._id,
            userName: req.user.name,
            userRole: req.user.role,
            text: req.body.text
        });

        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.markResolved = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.status = 'resolved';
        comment.resolvedBy = req.user._id;
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.confirmResolved = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.student.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        comment.status = 'confirmed';
        await comment.save();
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
