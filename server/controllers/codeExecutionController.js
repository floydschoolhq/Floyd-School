const judge0Service = require('../services/judge0Service');

// Execute code
exports.executeCode = async (req, res) => {
    try {
        const { sourceCode, languageId, stdin, expectedOutput } = req.body;

        console.log('Code execution request:', { languageId, codeLength: sourceCode?.length });

        if (!sourceCode || !languageId) {
            return res.status(400).json({ message: 'Source code and language ID are required' });
        }

        // Submit code to Judge0
        console.log('Submitting to Judge0...');
        const submission = await judge0Service.submitCode(sourceCode, languageId, stdin, expectedOutput);
        console.log('Submission created:', submission.token);

        // Poll for result
        let result = await judge0Service.getSubmission(submission.token);
        let attempts = 0;
        const maxAttempts = 10;

        while (result.status.id <= 2 && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            result = await judge0Service.getSubmission(submission.token);
            attempts++;
        }

        console.log('Execution completed:', result.status.description);

        // Emit Socket.io event for real-time update
        const io = req.app.get('io');
        if (io) {
            io.to(req.user._id.toString()).emit('code:result', {
                token: submission.token,
                result: result
            });
        }

        res.json({
            token: submission.token,
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            time: result.time,
            memory: result.memory,
            language: judge0Service.getLanguageById(languageId)
        });
    } catch (error) {
        console.error('Code execution error:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Code execution failed', error: error.message });
    }
};

// Get supported languages
exports.getLanguages = async (req, res) => {
    try {
        const languages = await judge0Service.getSupportedLanguages();
        res.json(languages);
    } catch (error) {
        console.error('Get languages error:', error);
        res.status(500).json({ message: 'Failed to fetch languages', error: error.message });
    }
};

// Get submission status
exports.getSubmissionStatus = async (req, res) => {
    try {
        const { token } = req.params;
        const result = await judge0Service.getSubmission(token);

        res.json({
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            time: result.time,
            memory: result.memory
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({ message: 'Failed to get submission status', error: error.message });
    }
};
