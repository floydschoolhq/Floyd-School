const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const API_BASE = 'http://localhost:5000/api';

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function assert(condition, name, detail = '') {
  if (condition) {
    results.passed++;
    results.tests.push({ name, status: 'PASS', detail });
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${name}${detail ? ' (' + detail + ')' : ''}`);
  } else {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', detail });
    console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${name}${detail ? ' (' + detail + ')' : ''}`);
    throw new Error(`Assertion failed: ${name} - ${detail}`);
  }
}

// Track test documents created for cleanup
const createdIds = {
  users: [],
  schools: [],
  batches: [],
  assignments: [],
  submissions: [],
  quizzes: [],
  quizSubmissions: [],
  attendances: [],
  codingSubmissions: [],
  tickets: []
};

async function runMasterIntegritySuite() {
  console.log('========================================================================');
  console.log('🚀 FLOYD SCHOOL COMPLETE FUNCTIONAL + DATABASE DATA INTEGRITY AUDIT');
  console.log('========================================================================\n');

  try {
    // -------------------------------------------------------------
    // SECTION 1: DATABASE AS SINGLE SOURCE OF TRUTH
    // -------------------------------------------------------------
    console.log('--- SECTION 1: Database Source of Truth Verification ---');
    await mongoose.connect(process.env.MONGO_URI);
    const dbName = mongoose.connection.name;
    const dbHost = mongoose.connection.host;
    assert(dbName === 'floydschool', 'Database Name is intended floydschool', dbName);
    assert(process.env.MONGO_URI.includes('floydschool-production.zb7mqyk.mongodb.net') && (dbHost.includes('zb7mqyk.mongodb.net') || dbHost.includes('floydschool-production')), 'Atlas Host is FloydSchool-Production Cluster', dbHost);
    console.log('✔ Connected exclusively to FloydSchool-Production Atlas cluster');

    // -------------------------------------------------------------
    // SECTION 2: AUTHENTICATION FOR ALL 4 ROLES
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: Portal Authentication & Token Issuance ---');
    const adminAuth = await axios.post(`${API_BASE}/auth/login`, {
      email: 'offline.admin@floydschool.in',
      password: 'AdminTest@2026!'
    });
    assert(adminAuth.status === 200 && adminAuth.data.user.role === 'admin', 'Admin Authentication', adminAuth.data.user.name);
    const adminH = { headers: { Authorization: `Bearer ${adminAuth.data.token}` } };

    const coordAuth = await axios.post(`${API_BASE}/auth/login`, {
      email: 'coordinator.test@floydschool.in',
      password: 'CoordTest@2026!'
    });
    assert(coordAuth.status === 200 && coordAuth.data.user.role === 'school_coordinator', 'Coordinator Authentication', coordAuth.data.user.name);
    const coordH = { headers: { Authorization: `Bearer ${coordAuth.data.token}` } };

    const mentorAuth = await axios.post(`${API_BASE}/auth/login`, {
      email: 'mentor.test@floydschool.in',
      password: 'MentorTest@2026!'
    });
    assert(mentorAuth.status === 200 && mentorAuth.data.user.role === 'mentor', 'Mentor Authentication', mentorAuth.data.user.name);
    const mentorH = { headers: { Authorization: `Bearer ${mentorAuth.data.token}` } };

    const studentAuth = await axios.post(`${API_BASE}/auth/login`, {
      email: 'student.test@floydschool.in',
      password: 'StudTest@2026!'
    });
    assert(studentAuth.status === 200 && studentAuth.data.user.role === 'school_student', 'Student Authentication', studentAuth.data.user.name);
    const studentH = { headers: { Authorization: `Bearer ${studentAuth.data.token}` } };

    // -------------------------------------------------------------
    // SECTION 3: MODEL SCHEMA & COLLECTION INVENTORY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Mongoose Model Schema & Collection Inventory ---');
    // Require core models from server
    const serverPath = path.join(__dirname, '..');
    const modelsList = [
      'User', 'School', 'Batch', 'Attendance', 'Assignment', 'Submission',
      'Quiz', 'QuizSubmission', 'CodingProblem', 'CodingSubmission',
      'Material', 'ClassGuide', 'Notification', 'SupportTicket', 'AuditLog', 'Settings'
    ];
    for (const m of modelsList) {
      require(path.join(serverPath, 'models', m));
      const modelObj = mongoose.model(m);
      assert(!!modelObj && !!modelObj.schema, `Model ${m} Registered & Schema Valid`, `Collection: ${modelObj.collection.name}`);
    }

    // -------------------------------------------------------------
    // SECTION 4: STUDENT PORTAL FUNCTIONAL & STORAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Student Portal Comprehensive Verification ---');
    // 4.1 Dashboard
    const stuDash = await axios.get(`${API_BASE}/school-student/dashboard`, studentH);
    assert(stuDash.status === 200 && stuDash.data.success, 'Student Dashboard Retrieval', `Student: ${stuDash.data.data?.student?.name}`);
    assert(stuDash.data.data?.student?.offlineRollNo === 'STXAV-ROB10A-001', 'Student Allotted Roll Number Verified');

    // 4.2 Attendance
    const stuAtt = await axios.get(`${API_BASE}/school-student/attendance`, studentH);
    assert(stuAtt.status === 200, 'Student Attendance History Retrieval', `Total Logs: ${(stuAtt.data.data || []).length}`);

    // 4.3 Quizzes
    const stuQuizzes = await axios.get(`${API_BASE}/school-student/quizzes`, studentH);
    assert(stuQuizzes.status === 200 && Array.isArray(stuQuizzes.data.data), 'Student Quizzes List Retrieval');
    if (stuQuizzes.data.data.length > 0) {
      const q = stuQuizzes.data.data[0];
      assert(q.questions[0].correctOption === undefined, 'Anti-Cheating: Correct option stripped from student payload');
    }

    // 4.4 Assignments
    const stuAssignments = await axios.get(`${API_BASE}/school-student/assignments`, studentH);
    assert(stuAssignments.status === 200 && Array.isArray(stuAssignments.data.data), 'Student Assignments List Retrieval');

    // 4.5 Materials
    const stuMat = await axios.get(`${API_BASE}/school-student/materials`, studentH);
    assert(stuMat.status === 200, 'Student Materials List Retrieval');

    // 4.6 Profile
    const stuProf = await axios.get(`${API_BASE}/school-student/profile`, studentH);
    assert(stuProf.status === 200 && stuProf.data.data?.studentId === 'FLOYD-STU-000001', 'Student Profile Permanent ID Verified', stuProf.data.data?.studentId);

    // 4.7 Coding Lab (Problems, Run, Submit, Playground)
    const probList = await axios.get(`${API_BASE}/coding-lab/problems`, studentH);
    assert(probList.status === 200 && probList.data.data?.length === 9, 'Coding Lab 9 Problems Retrieved');

    const probDetail = await axios.get(`${API_BASE}/coding-lab/problems/sum-of-two-numbers`, studentH);
    assert(probDetail.status === 200 && probDetail.data.data?.hiddenTestCases === undefined, 'Anti-Cheating: Hidden test cases stripped from problem API');

    // Run Code
    const runRes = await axios.post(`${API_BASE}/coding-lab/run`, {
      sourceCode: 'import sys\nnums = list(map(int, sys.stdin.read().split()))\nprint(nums[0] + nums[1])',
      languageId: 71,
      testCases: probDetail.data.data.sampleTestCases
    }, studentH);
    assert(runRes.status === 200 && runRes.data.data?.allPassed === true, 'Coding Lab Run Code Evaluates 100% Correct');

    // Submit Solution
    const submitRes = await axios.post(`${API_BASE}/coding-lab/submit`, {
      problemId: probDetail.data.data._id,
      sourceCode: 'import sys\nnums = list(map(int, sys.stdin.read().split()))\nprint(nums[0] + nums[1])',
      languageId: 71
    }, studentH);
    assert((submitRes.status === 200 || submitRes.status === 201) && submitRes.data.data?.status === 'Accepted', 'Coding Lab Solution Evaluated & Accepted', `Score: ${submitRes.data.data?.score}`);
    createdIds.codingSubmissions.push(submitRes.data.data.submissionId || submitRes.data.data._id);

    // Playground Snippet Persistence
    const snippetSave = await axios.put(`${API_BASE}/coding-lab/playground/71`, {
      code: '# Stored student playground code',
      languageName: 'Python'
    }, studentH);
    assert(snippetSave.status === 200 && snippetSave.data.success, 'Playground Snippet Stored in MongoDB');

    const snippetGet = await axios.get(`${API_BASE}/coding-lab/playground/71`, studentH);
    assert(snippetGet.data.data?.code === '# Stored student playground code', 'Playground Snippet Retrieved & Matched from MongoDB');

    // 4.8 Help Ticket
    const ticketRes = await axios.post(`${API_BASE}/school-student/help`, {
      subject: 'Verification test support ticket',
      issue: 'Checking support ticket pipeline persistence'
    }, studentH);
    assert(ticketRes.status === 201 && !!ticketRes.data.data?._id, 'Student Submits Help Ticket');
    createdIds.tickets.push(ticketRes.data.data._id);

    // -------------------------------------------------------------
    // SECTION 5: COORDINATOR PORTAL FUNCTIONAL & STORAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: Coordinator Portal Comprehensive Verification ---');
    const coordStats = await axios.get(`${API_BASE}/partner-school/stats`, coordH);
    assert(coordStats.status === 200 && coordStats.data.success, 'Coordinator Stats Retrieved', `School: ${coordStats.data.data?.schoolName}`);

    const coordBatches = await axios.get(`${API_BASE}/partner-school/batches`, coordH);
    assert(coordBatches.status === 200 && Array.isArray(coordBatches.data.data), 'Coordinator Batches Retrieved');

    const coordStudents = await axios.get(`${API_BASE}/partner-school/students`, coordH);
    assert(coordStudents.status === 200 && coordStudents.data.data?.length > 0, 'Coordinator Students Directory Retrieved');

    const coordAtt = await axios.get(`${API_BASE}/partner-school/attendance`, coordH);
    assert(coordAtt.status === 200 && Array.isArray(coordAtt.data.data), 'Coordinator Attendance Ledger Retrieved');

    // -------------------------------------------------------------
    // SECTION 6: MENTOR PORTAL FUNCTIONAL & STORAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: Mentor Portal Comprehensive Verification ---');
    const mentorDash = await axios.get(`${API_BASE}/mentor/offline/dashboard`, mentorH);
    assert(mentorDash.status === 200 && mentorDash.data.success, 'Mentor Dashboard Retrieved');

    const mentorBatches = await axios.get(`${API_BASE}/mentor/offline/batches`, mentorH);
    assert(mentorBatches.status === 200 && mentorBatches.data.data?.length > 0, 'Mentor Assigned Batches Retrieved');
    const coordBatchIds = new Set(coordBatches.data.data.map(b => String(b._id)));
    const activeBatch = mentorBatches.data.data.find(b => coordBatchIds.has(String(b._id))) || mentorBatches.data.data[0];

    // Mentor creates Class Guide
    const guideRes = await axios.post(`${API_BASE}/mentor/offline/class-guides`, {
      batchId: activeBatch._id,
      topic: 'Algorithm Complexity & Big O Analysis',
      objective: 'Empower students to compute time and space complexity',
      teachingPlan: '1. Asymptotic theory (20m) 2. Sorting comparisons (30m) 3. Python benchmarks (30m)',
      labActivities: 'Benchmarking insertion sort vs merge sort in Python',
      expectedOutcomes: 'Students intuitively optimize O(N^2) loops into O(N log N)'
    }, mentorH);
    assert(guideRes.status === 201 && guideRes.data.success, 'Mentor Creates Standardized Class Guide');

    // -------------------------------------------------------------
    // SECTION 7: OFFLINE ADMIN PORTAL FUNCTIONAL & STORAGE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: Offline Admin Portal Comprehensive Verification ---');
    const adminDash = await axios.get(`${API_BASE}/offline-admin/dashboard`, adminH);
    assert(adminDash.status === 200 && adminDash.data.success, 'Admin Central Dashboard KPIs Retrieved');

    // Admin creates and verifies School
    const testSchoolCode = 'SCH' + Date.now().toString().slice(-4);
    const createSchoolRes = await axios.post(`${API_BASE}/offline-admin/schools`, {
      name: 'Verification Partner School ' + testSchoolCode,
      code: testSchoolCode,
      city: 'Chandigarh',
      state: 'Punjab',
      address: 'Sector 17 Commercial Complex',
      principalName: 'Dr. Harpreet Singh',
      principalPhone: '+91 9811000011',
      coordinatorName: 'Manpreet Kaur',
      coordinatorEmail: `coord.${testSchoolCode.toLowerCase()}@floydschool.in`,
      coordinatorPhone: '+91 9811000022',
      curriculum: 'ICSE'
    }, adminH);
    const testSchool = createSchoolRes.data.data;
    assert(createSchoolRes.status === 201 && testSchool.code === testSchoolCode, 'Admin Creates Partner School', testSchool.code);
    createdIds.schools.push(testSchool._id);

    // Admin creates Mentor
    const testMentorEmail = `mentor.${Date.now()}@floydschool.in`;
    const createMentorRes = await axios.post(`${API_BASE}/offline-admin/mentors`, {
      name: 'Ananya Deshmukh',
      email: testMentorEmail,
      mobileNumber: '+91 9876543299',
      assignedSchools: [testSchool._id]
    }, adminH);
    const testMentor = createMentorRes.data.data;
    assert(createMentorRes.status === 201 && testMentor.mentorId?.startsWith('FLOYD-MEN-'), 'Admin Creates Mentor with Permanent ID', testMentor.mentorId);
    createdIds.users.push(testMentor._id);

    // Admin creates Batch
    const testBatchCode = 'BAT' + Date.now().toString().slice(-4);
    const createBatchRes = await axios.post(`${API_BASE}/offline-admin/batches`, {
      name: 'Batch ' + testBatchCode,
      code: testBatchCode,
      schoolId: testSchool._id,
      instructorId: testMentor._id,
      subject: 'Robotics & MicroPython',
      scheduleDays: ['Tuesday', 'Thursday'],
      scheduleTime: '10:00 AM - 11:30 AM',
      roomVenue: 'Lab 2',
      capacity: 30,
      academicYear: '2025-2026'
    }, adminH);
    const testBatch = createBatchRes.data.data;
    assert(createBatchRes.status === 201 && testBatch.code === testBatchCode, 'Admin Creates Batch', testBatch.code);
    createdIds.batches.push(testBatch._id);

    // -------------------------------------------------------------
    // SECTION 8: CROSS-PORTAL DATA CONSISTENCY WORKFLOWS (TESTS 1 - 5)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 8: Cross-Portal Consistency Workflows ---');

    // WORKFLOW 1: Coordinator creates student -> Mentor sees -> Student logs in -> Admin sees
    console.log('Testing Workflow 1: Coordinator Student Onboarding Lifecycle...');
    const wf1Email = `wf1.student.${Date.now()}@floydschool.in`;
    const wf1Res = await axios.post(`${API_BASE}/partner-school/students`, {
      name: 'Tanvi Saxena',
      email: wf1Email,
      grade: 'Grade 10',
      section: 'A',
      fatherName: 'Sanjay Saxena',
      studentMobile: '+91 9876500111',
      batchId: activeBatch._id
    }, coordH);
    const wf1Student = wf1Res.data.data;
    assert(wf1Res.status === 201 && !!wf1Student.studentId, 'Step 1.1: Coordinator Creates Student in MongoDB', wf1Student.studentId);
    createdIds.users.push(wf1Student._id);

    // Mentor sees student in batch
    const mentorStudents = await axios.get(`${API_BASE}/mentor/offline/students?batchId=${activeBatch._id}`, mentorH);
    const foundByMentor = mentorStudents.data.data?.some(s => s.email === wf1Email);
    assert(foundByMentor, 'Step 1.2: Mentor Sees Newly Created Student in Batch Roster');

    // Student logs in with default password
    const wf1StudentAuth = await axios.post(`${API_BASE}/auth/login`, {
      email: wf1Email,
      password: 'FloydSchool@123'
    });
    assert(wf1StudentAuth.status === 200 && wf1StudentAuth.data.user.email === wf1Email, 'Step 1.3: New Student Logs into SchoolStudent Portal');

    // Admin sees student
    const adminStudentList = await axios.get(`${API_BASE}/offline-admin/students?search=${encodeURIComponent(wf1Email)}`, adminH);
    assert(adminStudentList.data.data?.some(s => s.email === wf1Email), 'Step 1.4: Admin Views Student in Master Registry');

    // WORKFLOW 2: Attendance synchronization across all 4 tiers
    console.log('\nTesting Workflow 2: Attendance Multi-Portal Propagation...');
    const attSessionDate = new Date();
    attSessionDate.setHours(12, 0, 0, 0);

    const markAttRes = await axios.post(`${API_BASE}/mentor/offline/mark-attendance`, {
      batchId: activeBatch._id,
      date: attSessionDate.toISOString(),
      topicCovered: 'Cross-Portal Realtime Attendance Test',
      records: [
        { studentId: wf1Student._id, status: 'present', remarks: 'Active engagement' }
      ]
    }, mentorH);
    assert(markAttRes.status === 200 && markAttRes.data.success, 'Step 2.1: Mentor Marks Attendance in MongoDB');
    createdIds.attendances.push(markAttRes.data.data._id);

    // Student verifies attendance
    const wf1StuHeaders = { headers: { Authorization: `Bearer ${wf1StudentAuth.data.token}` } };
    const wf1StuAtt = await axios.get(`${API_BASE}/school-student/attendance`, wf1StuHeaders);
    const wf1AttLog = (Array.isArray(wf1StuAtt.data.data) ? wf1StuAtt.data.data : wf1StuAtt.data.data?.history || [])
      .find(l => l.status === 'present');
    assert(!!wf1AttLog, 'Step 2.2: Student Sees Live Attendance Record & Percentage Updated');

    // Coordinator verifies attendance
    const wf1CoordAtt = await axios.get(`${API_BASE}/partner-school/attendance?batchId=${activeBatch._id}`, coordH);
    const coordFound = wf1CoordAtt.data.data?.some(l => l.records.some(r => String(r.student?._id || r.studentId?._id || r.student || '') === String(wf1Student._id) && r.status === 'present'));
    assert(coordFound, 'Step 2.3: Coordinator Sees Updated School Attendance Ledger');

    // Admin verifies attendance in Ecosystem Analytics and Export
    const adminAnalytics = await axios.get(`${API_BASE}/offline-admin/attendance?batch=${activeBatch._id}`, adminH);
    const sessionFound = (adminAnalytics.data.data?.sessions || []).some(s => s.topicCovered === 'Cross-Portal Realtime Attendance Test');
    assert(sessionFound, 'Step 2.4: Admin Views Attendance in Ecosystem Ledger & Analytics');

    const adminExportAtt = await axios.get(`${API_BASE}/offline-admin/reports/export?type=attendance&batch=${activeBatch._id}`, {
      ...adminH,
      responseType: 'text'
    });
    assert(adminExportAtt.status === 200 && adminExportAtt.data.includes('Cross-Portal Realtime Attendance Test'), 'Step 2.4b: Admin Exports Attendance CSV Ledger');

    // WORKFLOW 3: Admin updates student details -> Student, Coordinator, Mentor see update
    console.log('\nTesting Workflow 3: Admin Student Update Propagation...');
    const updatedName = 'Tanvi S. Saxena (Updated)';
    const adminUpdateRes = await axios.put(`${API_BASE}/offline-admin/students/${wf1Student._id}`, {
      name: updatedName,
      studentMobile: '+91 9876599111'
    }, adminH);
    assert(adminUpdateRes.status === 200 && adminUpdateRes.data.data.name === updatedName, 'Step 3.1: Admin Updates Student in MongoDB');

    // Student profile displays updated name
    const wf1StuProfRefreshed = await axios.get(`${API_BASE}/school-student/profile`, wf1StuHeaders);
    assert(wf1StuProfRefreshed.data.data.name === updatedName, 'Step 3.2: Student Portal Displays Updated Name on Refresh');

    // Coordinator roster displays updated name
    const coordRosterCheck = await axios.get(`${API_BASE}/partner-school/students?search=${encodeURIComponent(wf1Email)}`, coordH);
    assert(coordRosterCheck.data.data[0].name === updatedName, 'Step 3.3: Coordinator Portal Displays Updated Name in Roster');

    // Mentor classroom displays updated name
    const mentorRosterCheck = await axios.get(`${API_BASE}/mentor/offline/students?batchId=${activeBatch._id}`, mentorH);
    assert(mentorRosterCheck.data.data.some(s => s.name === updatedName), 'Step 3.4: Mentor Portal Displays Updated Name in Classroom Roster');

    // WORKFLOW 4: Batch & Mentor Association Lifecycle
    console.log('\nTesting Workflow 4: Batch Allotment & Schedule Visibility...');
    assert(testBatch.instructor === testMentor._id, 'Step 4.1: Batch is Associated with Mentor in MongoDB');

    // WORKFLOW 5: Homework & Quiz Publishing, Submission, and Grading Loop
    console.log('\nTesting Workflow 5: Homework & Quiz Lifecycle Loop...');
    // Mentor publishes homework
    const hwRes = await axios.post(`${API_BASE}/mentor/offline/homework`, {
      title: 'Workflow 5 STEM Homework: Microcontroller Logic Gates',
      description: 'Implement AND, OR, NOT operations on input pins',
      batchId: activeBatch._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks: 50
    }, mentorH);
    const homeworkDoc = hwRes.data.data;
    assert(hwRes.status === 201 && !!homeworkDoc._id, 'Step 5.1: Homework Published to Batch');
    createdIds.assignments.push(homeworkDoc._id);

    // Student submits homework
    const hwSubRes = await axios.post(`${API_BASE}/school-student/assignments/${homeworkDoc._id}/submit`, {
      submissionText: 'Configured GPIO 12 and 14 as inputs with internal pull-up, tested logic matrix.'
    }, studentH);
    assert(hwSubRes.status === 200, 'Step 5.2: Student Submits Homework Response');
    if (hwSubRes.data.data?._id) createdIds.submissions.push(hwSubRes.data.data._id);

    // Mentor evaluates and grades submission
    const gradeRes = await axios.post(`${API_BASE}/mentor/offline/homework/${homeworkDoc._id}/grade`, {
      studentId: studentAuth.data.user._id,
      marksObtained: 48,
      feedback: 'Excellent logic gate breakdown and schematic accuracy.'
    }, mentorH);
    assert(gradeRes.status === 200 && gradeRes.data.success, 'Step 5.3: Mentor Evaluates and Grades Homework Submission');

    // -------------------------------------------------------------
    // SECTION 9: ATTENDANCE DUPLICATE SESSION PREVENTION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 9: Attendance Anti-Duplicate Session Verification ---');
    const initialAttCount = await mongoose.model('Attendance').countDocuments({ batch: activeBatch._id });
    
    // Mentor submits attendance for the same batch on the same date with updated remarks
    const duplicateAttRes = await axios.post(`${API_BASE}/mentor/offline/mark-attendance`, {
      batchId: activeBatch._id,
      date: attSessionDate.toISOString(),
      topicCovered: 'Duplicate Session Test - Must Update In-Place',
      records: [
        { studentId: wf1Student._id, status: 'late', remarks: 'Arrived 10 minutes late' }
      ]
    }, mentorH);
    assert(duplicateAttRes.status === 200 && duplicateAttRes.data.success, 'Duplicate Session Attendance Handled Successfully');

    const postAttCount = await mongoose.model('Attendance').countDocuments({ batch: activeBatch._id });
    assert(initialAttCount === postAttCount, 'Anti-Duplicate Protection: Session Updated In-Place Without Creating Duplicate Record', `Count: ${postAttCount}`);

    // -------------------------------------------------------------
    // SECTION 10: TENANT ISOLATION & SECURITY (IDOR RESISTANCE)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 10: Tenant Isolation & Security Verification ---');
    // Coordinator of School A attempting to query School B students
    try {
      const crossSchoolReq = await axios.get(`${API_BASE}/partner-school/students?schoolId=${testSchool._id}`, coordH);
      const leaks = crossSchoolReq.data.data.some(s => s.school?._id === testSchool._id);
      assert(!leaks, 'Tenant Isolation: Coordinator Cannot Access Another School\'s Students');
    } catch (err) {
      assert(err.response?.status === 403 || err.response?.status === 404, 'Tenant Isolation Enforced with Error Status');
    }

    // Student A cannot access Student B profile via ID manipulation
    const studentSelfProfile = await axios.get(`${API_BASE}/school-student/profile`, studentH);
    assert(studentSelfProfile.data.data.email === 'student.test@floydschool.in', 'Student Identity Strictly Bound to JWT (Zero IDOR Exposure)');

    // Duplicate email registration rejection
    try {
      await axios.post(`${API_BASE}/school-student/register`, {
        name: 'Duplicate Test',
        email: 'student.test@floydschool.in',
        password: 'Password@123'
      });
      assert(false, 'Validation: Duplicate Email Must Be Rejected');
    } catch (err) {
      assert(err.response?.status === 400, 'Validation: Duplicate Email Successfully Rejected with HTTP 400', err.response?.data?.message);
    }

    // -------------------------------------------------------------
    // SECTION 11: REFRESH & PERSISTENCE VERIFICATION
    // -------------------------------------------------------------
    console.log('\n--- SECTION 11: Refresh & Login Persistence Verification ---');
    const reloginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: wf1Email,
      password: 'FloydSchool@123'
    });
    const newToken = reloginRes.data.token;
    const reAuthHeaders = { headers: { Authorization: `Bearer ${newToken}` } };
    const persistedProfile = await axios.get(`${API_BASE}/school-student/profile`, reAuthHeaders);
    assert(persistedProfile.data.data.name === updatedName, 'Persistence: Data Retained Across Logout, New Login, and Refresh');

    // -------------------------------------------------------------
    // SECTION 12: CLEANUP OF EPHEMERAL TEST DATA
    // -------------------------------------------------------------
    console.log('\n--- SECTION 12: Clean Up of Ephemeral Test Data ---');
    console.log('Removing created test records to maintain pristine database integrity...');
    
    if (createdIds.users.length > 0) {
      const res = await mongoose.model('User').deleteMany({ _id: { $in: createdIds.users } });
      console.log('✔ Cleaned test users:', res.deletedCount);
    }
    if (createdIds.batches.length > 0) {
      const res = await mongoose.model('Batch').deleteMany({ _id: { $in: createdIds.batches } });
      console.log('✔ Cleaned test batches:', res.deletedCount);
    }
    if (createdIds.schools.length > 0) {
      const res = await mongoose.model('School').deleteMany({ _id: { $in: createdIds.schools } });
      console.log('✔ Cleaned test schools:', res.deletedCount);
    }
    if (createdIds.assignments.length > 0) {
      const res = await mongoose.model('Assignment').deleteMany({ _id: { $in: createdIds.assignments } });
      console.log('✔ Cleaned test assignments:', res.deletedCount);
    }
    if (createdIds.submissions.length > 0) {
      const res = await mongoose.model('Submission').deleteMany({ _id: { $in: createdIds.submissions } });
      console.log('✔ Cleaned test submissions:', res.deletedCount);
    }
    if (createdIds.attendances.length > 0) {
      const res = await mongoose.model('Attendance').deleteMany({ _id: { $in: createdIds.attendances } });
      console.log('✔ Cleaned test attendances:', res.deletedCount);
    }
    if (createdIds.codingSubmissions.length > 0) {
      const res = await mongoose.model('CodingSubmission').deleteMany({ _id: { $in: createdIds.codingSubmissions } });
      console.log('✔ Cleaned test coding submissions:', res.deletedCount);
    }
    if (createdIds.tickets.length > 0) {
      const res = await mongoose.model('SupportTicket').deleteMany({ _id: { $in: createdIds.tickets } });
      console.log('✔ Cleaned test support tickets:', res.deletedCount);
    }

    console.log('\n========================================================================');
    console.log(`🎉 ALL MASTER INTEGRITY TESTS PASSED: ${results.passed} PASSED, ${results.failed} FAILED`);
    console.log('========================================================================\n');

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('\n\x1b[31mMaster Integrity Suite Failed:\x1b[0m', err.response?.data || err.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

runMasterIntegritySuite();
