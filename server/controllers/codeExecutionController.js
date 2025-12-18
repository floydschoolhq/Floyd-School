const judge0Service = require('../services/judge0Service');

// @desc    Execute code
// @route   POST /api/execute
// @access  Private
exports.executeCode = async (req, res) => {
    try {
        const { sourceCode, languageId, stdin, expectedOutput } = req.body;

        if (!sourceCode || !languageId) {
            return res.status(400).json({
                success: false,
                message: 'Source code and language ID are required for execution'
            });
        }

        console.log(`[CodeExecution:executeCode] Initializing for LanguageID: ${languageId}`);

        // Submit code to Judge0
        const submission = await judge0Service.submitCode(sourceCode, languageId, stdin, expectedOutput);

        if (!submission?.token) {
            throw new Error('Judge0 failed to return submission token');
        }

        // Poll for result
        let result = await judge0Service.getSubmission(submission.token);
        let attempts = 0;
        const maxAttempts = 15; // Increased for complex builds

        while (result.status.id <= 2 && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            result = await judge0Service.getSubmission(submission.token);
            attempts++;
        }

        console.log(`[CodeExecution:executeCode] Finished with status: ${result.status.description}`);

        // Emit Socket.io event for real-time update
        const io = req.app.get('io');
        if (io && req.user?._id) {
            io.to(req.user._id.toString()).emit('code:result', {
                token: submission.token,
                status: result.status,
                stdout: result.stdout
            });
        }

        res.status(200).json({
            success: true,
            data: {
                token: submission.token,
                status: result.status,
                stdout: result.stdout,
                stderr: result.stderr,
                compile_output: result.compile_output,
                time: result.time,
                memory: result.memory,
                language: judge0Service.getLanguageById(languageId)
            }
        });
    } catch (error) {
        console.error(`[CodeExecution:executeCode] Error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Code execution failed during processing',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get supported languages
// @route   GET /api/execute/languages
// @access  Public
exports.getLanguages = async (req, res) => {
    try {
        const languages = await judge0Service.getSupportedLanguages();
        res.status(200).json({ success: true, count: languages.length, data: languages });
    } catch (error) {
        console.error(`[CodeExecution:getLanguages] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to fetch supported languages' });
    }
};

// @desc    Get submission status
// @route   GET /api/execute/status/:token
// @access  Private
exports.getSubmissionStatus = async (req, res) => {
    try {
        const { token } = req.params;
        const result = await judge0Service.getSubmission(token);

        res.status(200).json({
            success: true,
            data: {
                status: result.status,
                stdout: result.stdout,
                stderr: result.stderr,
                compile_output: result.compile_output,
                time: result.time,
                memory: result.memory
            }
        });
    } catch (error) {
        console.error(`[CodeExecution:getSubmissionStatus] Error: ${error.message}`);
        res.status(500).json({ success: false, message: 'Failed to retrieve submission status' });
    }
};
