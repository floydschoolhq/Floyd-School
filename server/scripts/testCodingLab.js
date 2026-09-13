const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCodingLab() {
  console.log('====================================================');
  console.log('TESTING CODING LAB BACKEND PIPELINE');
  console.log('====================================================\n');

  // 1. Authenticate student
  console.log('1. Authenticating student...');
  const loginRes = await axios.post(API_BASE + '/auth/login', {
    email: 'student.test@floydschool.in',
    password: 'StudentPass@123'
  });
  const token = loginRes.data.token;
  if (!token) throw new Error('Failed to get student token');
  console.log('✔ Authenticated student:', loginRes.data.user?.name);
  const headers = { headers: { Authorization: 'Bearer ' + token } };

  // 2. Fetch Problems List
  console.log('\n2. Fetching problem list...');
  const problemsRes = await axios.get(API_BASE + '/coding-lab/problems', headers);
  const problems = problemsRes.data.data;
  console.log('✔ Found ' + problems.length + ' problems in database.');
  const stats = problemsRes.data.stats;
  console.log('✔ Stats: Total=' + stats.totalProblems + ', Solved=' + stats.solved + ', Attempted=' + stats.attempted + ', Points=' + stats.points);

  if (!problems || problems.length === 0) throw new Error('No problems returned');

  // 3. Fetch Single Problem
  console.log('\n3. Fetching problem details for "sum-of-two-numbers"...');
  const probRes = await axios.get(API_BASE + '/coding-lab/problems/sum-of-two-numbers', headers);
  const problem = probRes.data.data;
  console.log('✔ Title: ' + problem.title + ', Category: ' + problem.category + ', Difficulty: ' + problem.difficulty);
  console.log('✔ Sample test cases: ' + problem.sampleTestCases.length);

  // 4. Run Sample Test Cases (Python)
  console.log('\n4. Testing Run Code against sample test cases (Python)...');
  const pyCode = 'import sys\nnums = list(map(int, sys.stdin.read().split()))\nprint(nums[0] + nums[1])';
  const runRes = await axios.post(API_BASE + '/coding-lab/run', {
    sourceCode: pyCode,
    languageId: 71,
    testCases: problem.sampleTestCases
  }, headers);

  console.log('✔ Run allPassed: ' + runRes.data.data.allPassed);
  runRes.data.data.results.forEach(r => {
    console.log('   Case ' + r.testCaseIndex + ': Input "' + r.input + '" -> Expected: "' + r.expectedOutput + '", Actual: "' + r.actualOutput + '", Passed: ' + r.passed);
  });
  if (!runRes.data.data.allPassed) throw new Error('Sample test cases did not pass');

  // 5. Submit Solution (Full test against hidden + sample)
  console.log('\n5. Submitting Solution (all test cases evaluation)...');
  const submitRes = await axios.post(API_BASE + '/coding-lab/submit', {
    problemId: problem._id,
    sourceCode: pyCode,
    languageId: 71,
    languageName: 'Python'
  }, headers);

  const subData = submitRes.data.data;
  console.log('✔ Submission Status: ' + subData.status);
  console.log('✔ Passed Test Cases: ' + subData.passedTestCases + '/' + subData.totalTestCases);
  console.log('✔ Score: ' + subData.score);
  console.log('✔ Execution Time: ' + subData.executionTime + 's, Memory: ' + subData.memoryUsage + 'KB');
  if (subData.status !== 'Accepted') throw new Error('Submission was not Accepted');

  // 6. Check Past Submissions
  console.log('\n6. Fetching student submission history for problem...');
  const historyRes = await axios.get(API_BASE + '/coding-lab/submissions/' + problem._id, headers);
  console.log('✔ Past submissions found: ' + historyRes.data.data.length);

  // 7. Verify Problem Status updated to Solved in Dashboard
  console.log('\n7. Checking updated dashboard telemetry...');
  const updatedProblemsRes = await axios.get(API_BASE + '/coding-lab/problems', headers);
  const updatedProb = updatedProblemsRes.data.data.find(p => p.slug === 'sum-of-two-numbers');
  console.log('✔ Problem status on dashboard: ' + updatedProb?.status);
  console.log('✔ Total Solved: ' + updatedProblemsRes.data.stats.solved + ', Total Points: ' + updatedProblemsRes.data.stats.points);
  if (updatedProb?.status !== 'Solved') throw new Error('Problem status was not updated to Solved');

  // 8. Test Scratchpad / Playground
  console.log('\n8. Testing Playground Snippet Save & Retrieve...');
  await axios.put(API_BASE + '/coding-lab/playground/71', {
    code: 'print("Playground code stored!")',
    languageName: 'Python'
  }, headers);
  const snippetRes = await axios.get(API_BASE + '/coding-lab/playground/71', headers);
  console.log('✔ Retrieved playground snippet: "' + snippetRes.data.data?.code + '"');

  console.log('\n====================================================');
  console.log('🎉 ALL CODING LAB BACKEND PIPELINE TESTS PASSED!');
  console.log('====================================================\n');
}

testCodingLab().catch(err => {
  console.error('\n❌ Test failed:', err.response?.data || err.message);
  process.exit(1);
});
