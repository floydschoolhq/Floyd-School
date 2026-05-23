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

exports.markMessageAsDoubt = async (req, res) => {
    try {
        const LiveChat = require('../models/LiveChat');
        const Doubt = require('../models/Doubt');

        const message = await LiveChat.findById(req.params.messageId);
        if (!message) {
            return res.status(404).json({ message: 'Chat message not found' });
        }

        message.isDoubt = true;
        await message.save();

        // Create a doubt record in MongoDB
        const doubt = await Doubt.create({
            student: message.sender,
            studentName: message.senderName,
            liveClass: message.liveClassId,
            question: message.text
        });

        const io = req.app.get('io');
        if (io) {
            // Notify the room that the chat message was updated
            io.to(`liveClass:${message.liveClassId}`).emit('liveClass:messageUpdated', message);
            // Alert standard doubts queue
            io.emit('doubt:new', doubt);
        }

        res.json({ success: true, doubt, message });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
