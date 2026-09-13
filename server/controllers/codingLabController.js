const CodingProblem = require('../models/CodingProblem');
const CodingSubmission = require('../models/CodingSubmission');
const CodeSnippet = require('../models/CodeSnippet');
const judge0Service = require('../services/judge0Service');

// Concurrency Queue to gracefully manage execution bursts
class ExecutionQueue {
    constructor(maxConcurrent = 8) {
        this.maxConcurrent = maxConcurrent;
        this.currentRunning = 0;
        this.queue = [];
    }

    enqueue(task) {
        return new Promise((resolve, reject) => {
            if (this.queue.length > 50) {
                return reject(new Error('Server execution capacity reached. Please retry in a few moments.'));
            }
            this.queue.push({ task, resolve, reject });
            this.processNext();
        });
    }

    processNext() {
        if (this.currentRunning >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }

        const { task, resolve, reject } = this.queue.shift();
        this.currentRunning++;

        task()
            .then(res => resolve(res))
            .catch(err => reject(err))
            .finally(() => {
                this.currentRunning--;
                this.processNext();
            });
    }
}

const executionQueue = new ExecutionQueue(8);

function normalizeOutput(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim();
}

// @desc    Get all coding problems with student progress status
// @route   GET /api/coding-lab/problems
// @access  Private
exports.getProblems = async (req, res) => {
    try {
        const studentId = req.user._id;
        const problems = await CodingProblem.find({ isActive: true })
            .select('-hiddenTestCases')
            .sort({ order: 1, createdAt: 1 })
            .lean();

        // Fetch student's submissions
        const submissions = await CodingSubmission.find({ student: studentId })
            .select('problem status score createdAt')
            .lean();

        // Map status by problem ID
        const problemStatusMap = {};
        for (const sub of submissions) {
            const pid = sub.problem.toString();
            if (!problemStatusMap[pid]) {
                problemStatusMap[pid] = {
                    isSolved: false,
                    isAttempted: false,
                    attempts: 0,
                    bestScore: 0
                };
            }
            problemStatusMap[pid].attempts++;
            if (sub.status === 'Accepted') {
                problemStatusMap[pid].isSolved = true;
            } else {
                problemStatusMap[pid].isAttempted = true;
            }
            if (sub.score > problemStatusMap[pid].bestScore) {
                problemStatusMap[pid].bestScore = sub.score;
            }
        }

        let solvedCount = 0;
        let attemptedCount = 0;
        let totalPointsEarned = 0;

        const enrichedProblems = problems.map(prob => {
            const pMeta = problemStatusMap[prob._id.toString()];
            let status = 'Not Started';
            let bestScore = 0;
            let attempts = 0;

            if (pMeta) {
                attempts = pMeta.attempts;
                bestScore = pMeta.bestScore;
                if (pMeta.isSolved) {
                    status = 'Solved';
                    solvedCount++;
                    totalPointsEarned += (prob.points || 100);
                } else if (pMeta.isAttempted) {
                    status = 'Attempted';
                    attemptedCount++;
                }
            }

            return {
                ...prob,
                status,
                bestScore,
                attempts,
                sampleTestCasesCount: prob.sampleTestCases ? prob.sampleTestCases.length : 0
            };
        });

        res.json({
            success: true,
            data: enrichedProblems,
            stats: {
                totalProblems: problems.length,
                solved: solvedCount,
                attempted: attemptedCount,
                points: totalPointsEarned
            }
        });
    } catch (err) {
        console.error('[CodingLab:getProblems] Error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve coding problems' });
    }
};

// @desc    Get single problem by slug with student latest saved/submitted code
// @route   GET /api/coding-lab/problems/:slug
// @access  Private
exports.getProblemBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const problem = await CodingProblem.findOne({ slug, isActive: true })
            .select('-hiddenTestCases')
            .lean();

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Coding problem not found' });
        }

        // Fetch student's latest submission for this problem
        const latestSubmission = await CodingSubmission.findOne({
            student: req.user._id,
            problem: problem._id
        }).sort({ createdAt: -1 }).lean();

        // Check if student solved it
        const acceptedSub = await CodingSubmission.findOne({
            student: req.user._id,
            problem: problem._id,
            status: 'Accepted'
        }).lean();

        res.json({
            success: true,
            data: {
                ...problem,
                isSolved: !!acceptedSub,
                latestCode: latestSubmission ? latestSubmission.code : null,
                latestLanguageId: latestSubmission ? latestSubmission.languageId : null,
                latestStatus: latestSubmission ? latestSubmission.status : null
            }
        });
    } catch (err) {
        console.error('[CodingLab:getProblemBySlug] Error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve problem details' });
    }
};

// @desc    Run code against sample test cases or custom stdin without saving submission
// @route   POST /api/coding-lab/run
// @access  Private
exports.runCode = async (req, res) => {
    try {
        const { sourceCode, languageId, testCases, customInput } = req.body;

        if (!sourceCode || !languageId) {
            return res.status(400).json({ success: false, message: 'sourceCode and languageId are required' });
        }

        // Case 1: Custom input execution
        if (typeof customInput === 'string' && (!testCases || testCases.length === 0)) {
            const execResult = await executionQueue.enqueue(() => 
                judge0Service.submitCode(sourceCode, languageId, customInput)
            );

            return res.json({
                success: true,
                data: {
                    stdout: execResult.stdout,
                    stderr: execResult.stderr,
                    compile_output: execResult.compile_output,
                    status: execResult.status,
                    time: execResult.time,
                    memory: execResult.memory
                }
            });
        }

        // Case 2: Run against sample test cases
        const cases = Array.isArray(testCases) && testCases.length > 0
            ? testCases
            : [{ input: '', expectedOutput: '' }];

        const testResults = [];
        let allPassed = true;

        for (let i = 0; i < cases.length; i++) {
            const tc = cases[i];
            const tcInput = String(tc.input || '');
            const tcExpected = normalizeOutput(tc.expectedOutput || '');

            const execResult = await executionQueue.enqueue(() =>
                judge0Service.submitCode(sourceCode, languageId, tcInput)
            );

            const actualOutput = normalizeOutput(execResult.stdout || '');
            const errorOutput = execResult.stderr || execResult.compile_output || null;
            const passed = (!errorOutput && actualOutput === tcExpected);

            if (!passed) allPassed = false;

            testResults.push({
                testCaseIndex: i + 1,
                input: tcInput,
                expectedOutput: tcExpected,
                actualOutput,
                passed,
                error: errorOutput,
                executionTime: execResult.time || '0.05',
                status: execResult.status?.description || 'Accepted'
            });
        }

        res.json({
            success: true,
            data: {
                allPassed,
                results: testResults
            }
        });
    } catch (err) {
        console.error('[CodingLab:runCode] Error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Execution failed during run'
        });
    }
};

// @desc    Submit code against all sample and hidden test cases, grade & save submission
// @route   POST /api/coding-lab/submit
// @access  Private
exports.submitSolution = async (req, res) => {
    try {
        const { problemId, sourceCode, languageId, languageName } = req.body;
        const studentId = req.user._id;

        if (!problemId || !sourceCode || !languageId) {
            return res.status(400).json({ success: false, message: 'problemId, sourceCode, and languageId are required' });
        }

        const problem = await CodingProblem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        // Combine sample test cases and hidden test cases
        const allCases = [];
        (problem.sampleTestCases || []).forEach(tc => {
            allCases.push({ input: tc.input || '', expectedOutput: tc.expectedOutput, isHidden: false });
        });
        (problem.hiddenTestCases || []).forEach(tc => {
            allCases.push({ input: tc.input || '', expectedOutput: tc.expectedOutput, isHidden: true });
        });

        if (allCases.length === 0) {
            allCases.push({ input: '', expectedOutput: '', isHidden: false });
        }

        const testResults = [];
        let passedCount = 0;
        let finalStatus = 'Accepted';
        let maxTime = '0.00';
        let maxMemory = '0';

        for (let i = 0; i < allCases.length; i++) {
            const tc = allCases[i];
            const tcInput = String(tc.input || '');
            const tcExpected = normalizeOutput(tc.expectedOutput || '');

            const execResult = await executionQueue.enqueue(() =>
                judge0Service.submitCode(sourceCode, languageId, tcInput)
            );

            const actualOutput = normalizeOutput(execResult.stdout || '');
            const errorOutput = execResult.stderr || execResult.compile_output || null;
            const isMatch = (!errorOutput && actualOutput === tcExpected);

            if (isMatch) {
                passedCount++;
            } else if (finalStatus === 'Accepted') {
                if (execResult.status?.id === 5 || execResult.status?.description === 'Time Limit Exceeded') {
                    finalStatus = 'Time Limit Exceeded';
                } else if (execResult.compile_output) {
                    finalStatus = 'Compilation Error';
                } else if (execResult.stderr) {
                    finalStatus = 'Runtime Error';
                } else {
                    finalStatus = 'Wrong Answer';
                }
            }

            if (parseFloat(execResult.time || '0') > parseFloat(maxTime)) {
                maxTime = execResult.time;
            }
            if (parseInt(execResult.memory || '0', 10) > parseInt(maxMemory, 10)) {
                maxMemory = execResult.memory;
            }

            testResults.push({
                testCaseIndex: i + 1,
                passed: isMatch,
                input: tc.isHidden ? '[Hidden Test Case]' : tcInput,
                expectedOutput: tc.isHidden ? '[Hidden Output]' : tcExpected,
                actualOutput: tc.isHidden ? (isMatch ? '[Correct]' : '[Incorrect Output]') : actualOutput,
                executionTime: execResult.time || '0.05',
                error: tc.isHidden && !errorOutput ? null : errorOutput,
                isHidden: tc.isHidden
            });
        }

        const totalCases = allCases.length;
        const score = Math.round((passedCount / totalCases) * (problem.points || 100));

        const submission = await CodingSubmission.create({
            student: studentId,
            problem: problem._id,
            languageId,
            languageName: languageName || judge0Service.getLanguageById(languageId),
            code: sourceCode,
            status: finalStatus,
            passedTestCases: passedCount,
            totalTestCases: totalCases,
            score,
            testCaseResults: testResults,
            executionTime: maxTime,
            memoryUsage: maxMemory
        });

        res.status(201).json({
            success: true,
            data: {
                submissionId: submission._id,
                status: finalStatus,
                score,
                passedTestCases: passedCount,
                totalTestCases: totalCases,
                testCaseResults: testResults,
                executionTime: maxTime,
                memoryUsage: maxMemory,
                isAccepted: finalStatus === 'Accepted'
            }
        });
    } catch (err) {
        console.error('[CodingLab:submitSolution] Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Submission failed' });
    }
};

// @desc    Get student's past submissions for a problem
// @route   GET /api/coding-lab/submissions/:problemId
// @access  Private
exports.getSubmissions = async (req, res) => {
    try {
        const { problemId } = req.params;
        const submissions = await CodingSubmission.find({
            student: req.user._id,
            problem: problemId
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

        res.json({
            success: true,
            data: submissions
        });
    } catch (err) {
        console.error('[CodingLab:getSubmissions] Error:', err);
        res.status(500).json({ success: false, message: 'Failed to retrieve submissions' });
    }
};

// @desc    Get / Save playground scratchpad snippet
// @route   GET/PUT /api/coding-lab/playground/:languageId
// @access  Private
exports.getPlaygroundSnippet = async (req, res) => {
    try {
        const { languageId } = req.params;
        const snippet = await CodeSnippet.findOne({
            user: req.user._id,
            languageId: Number(languageId)
        });

        res.json({
            success: true,
            data: snippet || null
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch snippet' });
    }
};

exports.savePlaygroundSnippet = async (req, res) => {
    try {
        const { languageId } = req.params;
        const { code, languageName } = req.body;

        const snippet = await CodeSnippet.findOneAndUpdate(
            { user: req.user._id, languageId: Number(languageId) },
            {
                code,
                languageName: languageName || judge0Service.getLanguageById(languageId)
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({
            success: true,
            message: 'Snippet saved successfully',
            data: snippet
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save snippet' });
    }
};
