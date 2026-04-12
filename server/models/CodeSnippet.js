const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    languageId: {
        type: Number,
        required: true,
        index: true
    },
    languageName: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        default: ''
    }
}, {
    timestamps: true
});

codeSnippetSchema.index({ user: 1, languageId: 1 }, { unique: true });

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

module.exports = CodeSnippet;
