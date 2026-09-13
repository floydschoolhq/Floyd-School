const express = require('express');
const router = express.Router();
const {
    getProblems,
    getProblemBySlug,
    runCode,
    submitSolution,
    getSubmissions,
    getPlaygroundSnippet,
    savePlaygroundSnippet
} = require('../controllers/codingLabController');
const { protect, checkPermission } = require('../middleware/authMiddleware');

// All coding lab routes require authentication and lab permissions
router.use(protect);
router.use(checkPermission('canAccessLabs'));

// Problems & Dashboard
router.get('/problems', getProblems);
router.get('/problems/:slug', getProblemBySlug);

// Code Execution & Testing
router.post('/run', runCode);
router.post('/submit', submitSolution);

// Submissions History
router.get('/submissions/:problemId', getSubmissions);

// Playground Scratchpad
router.get('/playground/:languageId', getPlaygroundSnippet);
router.put('/playground/:languageId', savePlaygroundSnippet);

module.exports = router;
