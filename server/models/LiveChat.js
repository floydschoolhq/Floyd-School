const mongoose = require('mongoose');

const liveChatSchema = new mongoose.Schema({
    liveClassId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LiveClass',
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    role: String,
    text: {
        type: String,
        required: true
    },
    isDoubt: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const LiveChat = mongoose.model('LiveChat', liveChatSchema);

module.exports = LiveChat;
