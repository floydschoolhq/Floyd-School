const CodeSnippet = require('../models/CodeSnippet');

const parseLanguageId = (value) => {
    const languageId = Number.parseInt(value, 10);
    return Number.isNaN(languageId) ? null : languageId;
};

exports.getSnippet = async (req, res) => {
    try {
        const languageId = parseLanguageId(req.params.languageId);

        if (languageId === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language ID'
            });
        }

        const snippet = await CodeSnippet.findOne({
            user: req.user._id,
            languageId
        });

        res.status(200).json({
            success: true,
            data: snippet
        });
    } catch (error) {
        console.error('[CodeSnippetController:getSnippet] Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to load saved code',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.saveSnippet = async (req, res) => {
    try {
        const languageId = parseLanguageId(req.params.languageId);
        const { code, languageName } = req.body;

        if (languageId === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language ID'
            });
        }

        if (typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Code content is required'
            });
        }

        const update = {
            code
        };

        if (languageName) {
            update.languageName = languageName;
        }

        const snippet = await CodeSnippet.findOneAndUpdate(
            {
                user: req.user._id,
                languageId
            },
            {
                $set: update,
                $setOnInsert: {
                    user: req.user._id,
                    languageId,
                    languageName: languageName || 'Unknown'
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: snippet
        });
    } catch (error) {
        console.error('[CodeSnippetController:saveSnippet] Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to save code',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.deleteSnippet = async (req, res) => {
    try {
        const languageId = parseLanguageId(req.params.languageId);

        if (languageId === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language ID'
            });
        }

        await CodeSnippet.findOneAndDelete({
            user: req.user._id,
            languageId
        });

        res.status(200).json({
            success: true,
            message: 'Saved code deleted'
        });
    } catch (error) {
        console.error('[CodeSnippetController:deleteSnippet] Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to delete saved code',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
