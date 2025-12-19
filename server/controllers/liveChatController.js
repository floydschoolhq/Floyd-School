const LiveChat = require('../models/LiveChat');

exports.getMessagesByClass = async (req, res) => {
    try {
        const messages = await LiveChat.find({ liveClassId: req.params.classId })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { classId, text } = req.body;
        const chat = await LiveChat.create({
            liveClassId: classId,
            sender: req.user._id,
            senderName: req.user.name,
            role: req.user.role,
            text
        });

        const io = req.app.get('io');
        if (io) {
            io.to(`liveClass:${classId}`).emit('liveClass:message', chat);
        }

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
