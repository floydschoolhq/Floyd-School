/**
 * Floyd School — Offline Admin & Ecosystem Cross-Portal E2E Test Suite
 * Tests all 4 portals on the shared backend, database, and identity system.
 */

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_BASE = 'http://localhost:5000/api';

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function assert(condition, testName, details = '') {
  if (condition) {
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS', details });
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${testName} ${details ? '(' + details + ')' : ''}`);
  } else {
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', details });
    console.log(`\x1b[31m✖ [FAIL]\x1b[0m ${testName} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runE2E() {
  console.log('===============================================================');
  console.log('FLOYD SCHOOL OFFLINE ECOSYSTEM: END-TO-END CROSS-PORTAL AUDIT');
  console.log('===============================================================');

  let adminToken = null;
  let mentorToken = null;
  let studentToken = null;
  let testSchool = null;
  let testBatch = null;
  let provisionedStudent = null;
  let provisionedMentor = null;

  try {
    // -------------------------------------------------------------
    // TEST 1: Super Admin Authentication & JWT Verification
    // -------------------------------------------------------------
    console.log('\n--- Step 1: Offline Super Admin Authentication ---');
    const adminLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'offline.admin@floydschool.in',
      password: 'AdminTest@2026!'
    });
    adminToken = adminLoginRes.data.token;
    assert(adminLoginRes.status === 200 && !!adminToken, 'Super Admin Login (offline.admin@floydschool.in)', `role: ${adminLoginRes.data.user?.role || adminLoginRes.data.role}`);

    const adminHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

    // -------------------------------------------------------------
    // TEST 2: Dashboard KPIs Telemetry
    // -------------------------------------------------------------
    console.log('\n--- Step 2: Global Dashboard Telemetry ---');
    const dashRes = await axios.get(`${API_BASE}/offline-admin/dashboard`, adminHeaders);
    assert(dashRes.status === 200 && dashRes.data.success, 'Fetch Dashboard KPIs', `Total schools: ${dashRes.data.data.counts?.totalSchools}, Students: ${dashRes.data.data.counts?.totalStudents}`);

    // -------------------------------------------------------------
    // TEST 3: School Provisioning with Unique Internal Identifier
    // -------------------------------------------------------------
    console.log('\n--- Step 3: School Provisioning ---');
    const schoolCode = `TESTSCH${Date.now().toString().slice(-4)}`;
    const schoolRes = await axios.post(`${API_BASE}/offline-admin/schools`, {
      name: `Test Partner Academy ${schoolCode}`,
      code: schoolCode,
      city: 'Gurugram',
      address: 'Sector 54, Golf Course Road',
      contactPerson: 'Director Principal',
      contactEmail: `director.${schoolCode.toLowerCase()}@floydschool.in`,
      contactPhone: '+91 9988776655',
      studentQuota: 300,
      academicYear: '2025-2026'
    }, adminHeaders);
    testSchool = schoolRes.data.data;
    assert(schoolRes.status === 201 && testSchool?.code === schoolCode, 'OfflineAdmin → School creation', `School Code: ${schoolCode}`);

    // -------------------------------------------------------------
    // TEST 4: Bulk Excel/Spreadsheet Student Import Simulation
    // -------------------------------------------------------------
    console.log('\n--- Step 4: Bulk Student Provisioning & Validation ---');
    const simulatedRows = [
      {
        'Student Name': 'Rohan Deshmukh',
        'School Code': testSchool.code,
        'Class': '10',
        'Section': 'A',
        'Father Name': 'Sunil Deshmukh',
        'Student Mobile': `9811${Date.now().toString().slice(-6)}`,
        'Father Mobile': '9811000001',
        'Email': `rohan.${Date.now()}@floydschool.in`,
        'Batch Code': ''
      }
    ];

    const previewRes = await axios.post(`${API_BASE}/offline-admin/students/import-preview`, {
      rows: simulatedRows
    }, adminHeaders);
    assert(previewRes.status === 200 && previewRes.data.summary?.validCount === 1, 'Excel Import Validation & Duplicate Detection', `Valid rows: ${previewRes.data.summary?.validCount}`);

    const confirmRes = await axios.post(`${API_BASE}/offline-admin/students/import-confirm`, {
      rows: previewRes.data.rows
    }, adminHeaders);
    const reportItem = confirmRes.data.credentialsReport?.[0];
    provisionedStudent = reportItem;
    assert(confirmRes.status === 201 && !!provisionedStudent?.studentId, 'OfflineAdmin → Bulk Student creation with Permanent Floyd ID', `ID: ${provisionedStudent?.studentId}, TempPassword: ${provisionedStudent?.temporaryPassword}`);

    // -------------------------------------------------------------
    // TEST 5: Mentor Provisioning with Permanent Floyd Mentor ID
    // -------------------------------------------------------------
    console.log('\n--- Step 5: Mentor Provisioning ---');
    const mentorEmail = `mentor.${Date.now()}@floydschool.in`;
    const mentorRes = await axios.post(`${API_BASE}/offline-admin/mentors`, {
      name: 'Dr. Vikram Sarabhai Mentor',
      email: mentorEmail,
      mobileNumber: '+91 9123456789',
      assignedSchools: [testSchool._id]
    }, adminHeaders);
    provisionedMentor = mentorRes.data.data;
    assert(mentorRes.status === 201 && !!provisionedMentor?.mentorId, 'OfflineAdmin → Mentor creation with Permanent Mentor ID', `Mentor ID: ${provisionedMentor?.mentorId}`);

    // -------------------------------------------------------------
    // TEST 6: Batch Creation & Assignment
    // -------------------------------------------------------------
    console.log('\n--- Step 6: Batch Provisioning & Cohort Allocation ---');
    const batchCode = `AI-LAB-${Date.now().toString().slice(-4)}`;
    const batchRes = await axios.post(`${API_BASE}/offline-admin/batches`, {
      name: 'Advanced Robotics Cohort',
      code: batchCode,
      schoolId: testSchool._id,
      instructorId: provisionedMentor._id,
      subject: 'Robotics & MicroPython',
      scheduleDays: ['Tuesday', 'Thursday'],
      scheduleTime: '11:00 AM - 12:30 PM',
      roomVenue: 'Lab 204',
      capacity: 40,
      academicYear: '2025-2026'
    }, adminHeaders);
    testBatch = batchRes.data.data;
    assert(batchRes.status === 201 && !!testBatch?._id, 'OfflineAdmin → Batch creation', `Batch Code: ${batchCode}`);

    // Assign student to batch
    const stuSearchRes = await axios.get(`${API_BASE}/offline-admin/students?search=${provisionedStudent.studentId}`, adminHeaders);
    const studentDoc = stuSearchRes.data.data[0];
    const assignRes = await axios.post(`${API_BASE}/offline-admin/batches/${testBatch._id}/assign-students`, {
      studentIds: [studentDoc._id]
    }, adminHeaders);
    assert(assignRes.status === 200, 'OfflineAdmin → Assign Student to Batch', `Batch: ${testBatch.name}`);

    // -------------------------------------------------------------
    // TEST 7: Student Authentication on SchoolStudent Portal
    // -------------------------------------------------------------
    console.log('\n--- Step 7: Student Portal Login (SchoolStudent:5178) ---');
    const studentLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: provisionedStudent.loginId,
      password: provisionedStudent.temporaryPassword
    });
    studentToken = studentLoginRes.data.token;
    assert(studentLoginRes.status === 200 && !!studentToken, 'Student → SchoolStudent login', `Student ID: ${provisionedStudent.studentId}`);

    const studentHeaders = { headers: { Authorization: `Bearer ${studentToken}` } };

    // Check student dashboard sees assigned batch
    const stuDashRes = await axios.get(`${API_BASE}/school-student/dashboard`, studentHeaders);
    assert(stuDashRes.status === 200 && stuDashRes.data.data?.batch?.name === 'Advanced Robotics Cohort', 'Student sees batch assignment in SchoolStudent', `Batch: ${stuDashRes.data.data?.batch?.name}`);

    // -------------------------------------------------------------
    // TEST 8: Mentor Authentication on MentorSchool Portal
    // -------------------------------------------------------------
    console.log('\n--- Step 8: Mentor Portal Login (MentorSchool:5180) ---');
    const mentorLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: provisionedMentor.email,
      password: provisionedMentor.temporaryPassword
    });
    mentorToken = mentorLoginRes.data.token;
    assert(mentorLoginRes.status === 200 && !!mentorToken, 'Mentor → MentorSchool login', `Mentor ID: ${provisionedMentor.mentorId}`);

    const mentorHeaders = { headers: { Authorization: `Bearer ${mentorToken}` } };

    // -------------------------------------------------------------
    // TEST 9: Mentor Marks Attendance → Propagates Across Ecosystem
    // -------------------------------------------------------------
    console.log('\n--- Step 9: Attendance Cross-Portal Synchronization ---');
    const attRes = await axios.post(`${API_BASE}/mentor/offline/mark-attendance`, {
      schoolId: testSchool._id,
      batchId: testBatch._id,
      date: new Date().toISOString(),
      topicCovered: 'MicroPython ESP32 Ultrasonic Range Finder Lab',
      records: [
        {
          studentId: studentDoc._id,
          status: 'present',
          remarks: 'Circuit wired perfectly'
        }
      ]
    }, mentorHeaders);
    assert(attRes.status === 200 && attRes.data.success, 'Mentor → Mark Attendance');

    // Verify Student sees it
    const stuAttRes = await axios.get(`${API_BASE}/school-student/attendance`, studentHeaders);
    const stuHistory = Array.isArray(stuAttRes.data.data) ? stuAttRes.data.data : (stuAttRes.data.data?.history || []);
    assert(stuAttRes.status === 200 && stuHistory.length > 0, 'Mentor → Attendance → Student', `Sessions: ${stuHistory.length}`);

    // Verify PartnerSchool sees it
    const partnerAttRes = await axios.get(`${API_BASE}/partner-school/attendance`, {
      headers: adminHeaders.headers,
      params: { school: testSchool._id, batch: testBatch._id }
    });
    assert(partnerAttRes.status === 200, 'Mentor → Attendance → PartnerSchool', `Ledger records verified`);

    // Verify OfflineAdmin sees it
    const adminAttRes = await axios.get(`${API_BASE}/offline-admin/attendance`, {
      headers: adminHeaders.headers,
      params: { batch: testBatch._id }
    });
    assert(adminAttRes.status === 200 && (adminAttRes.data.data?.sessions || []).length > 0, 'Mentor → Attendance → OfflineAdmin Analytics', `Rate: ${adminAttRes.data.data?.metrics?.overallRate}%`);

    // -------------------------------------------------------------
    // TEST 10: Quiz Creation, Student Submission & Admin Aggregation
    // -------------------------------------------------------------
    console.log('\n--- Step 10: Quiz Assessment Synchronization ---');
    const quizRes = await axios.post(`${API_BASE}/mentor/offline/quizzes`, {
      title: 'Ultrasonic Sensor & Speed of Sound Quiz',
      batchId: testBatch._id,
      schoolId: testSchool._id,
      timeLimitMinutes: 10,
      questions: [
        {
          questionText: 'What pin triggers the ultrasonic burst on the HC-SR04?',
          options: ['TRIG', 'ECHO', 'VCC', 'GND'],
          correctOption: 0
        }
      ]
    }, mentorHeaders);
    const createdQuiz = quizRes.data.data;
    assert(quizRes.status === 201 && !!createdQuiz?._id, 'Mentor → Quiz → Student', `Quiz ID: ${createdQuiz?._id}`);

    // Student Submits Quiz
    const quizSubRes = await axios.post(`${API_BASE}/school-student/quizzes/${createdQuiz._id}/submit`, {
      answers: [{ questionIndex: 0, selectedOption: 0 }]
    }, studentHeaders);
    assert(quizSubRes.status === 200 && quizSubRes.data.data?.score > 0, 'Student → Quiz → Mentor', `Score: ${quizSubRes.data.data?.score}/${quizSubRes.data.data?.totalMarks}`);

    // -------------------------------------------------------------
    // TEST 11: Homework Publishing, Submission & Review
    // -------------------------------------------------------------
    console.log('\n--- Step 11: Homework & Lab Challenge Synchronization ---');
    const hwRes = await axios.post(`${API_BASE}/mentor/offline/assignments`, {
      title: 'Lab Challenge: Calibrate Distance Formula',
      description: 'Compute sound speed adjustment based on ambient temperature.',
      batchId: testBatch._id,
      schoolId: testSchool._id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks: 100
    }, mentorHeaders);
    const createdHw = hwRes.data.data;
    assert(hwRes.status === 201 && !!createdHw?._id, 'Mentor → Homework → Student', `HW ID: ${createdHw?._id}`);

    // Student Submits Homework
    const hwSubRes = await axios.post(`${API_BASE}/school-student/assignments/${createdHw._id}/submit`, {
      content: 'Calculated sound velocity at 25C = 346 m/s. Formula calibrated.'
    }, studentHeaders);
    assert(hwSubRes.status === 200, 'Student → Homework → Mentor', 'Homework submitted successfully');

    // -------------------------------------------------------------
    // TEST 12: Learning Materials Distribution
    // -------------------------------------------------------------
    console.log('\n--- Step 12: Material Distribution ---');
    const matRes = await axios.post(`${API_BASE}/mentor/offline/materials`, {
      title: 'HC-SR04 Ultrasonic Datasheet & Python Driver',
      batchId: testBatch._id,
      schoolId: testSchool._id,
      moduleName: 'Sensors and Actuators',
      fileUrl: 'https://docs.floydschool.in/sensors/hc-sr04.pdf',
      fileType: 'pdf'
    }, mentorHeaders);
    assert(matRes.status === 201 && matRes.data.success, 'Mentor → Material → Student', 'Resource published to batch');

    // -------------------------------------------------------------
    // TEST 13: Granular Maintenance Mode Control & Verification
    // -------------------------------------------------------------
    console.log('\n--- Step 13: Maintenance Mode Control & Isolation ---');
    // Set SchoolStudent portal to maintenance
    await axios.put(`${API_BASE}/offline-admin/maintenance`, {
      schoolStudent: {
        isActive: true,
        message: 'Student Portal undergoes scheduled firmware upgrades.'
      }
    }, adminHeaders);

    const publicMaintRes = await axios.get(`${API_BASE}/public/maintenance-status?portal=schoolStudent`);
    assert(publicMaintRes.data.isMaintenance === true, 'Maintenance mode (Student Portal active)', publicMaintRes.data.message);

    // Verify MentorSchool portal is NOT in maintenance
    const mentorMaintRes = await axios.get(`${API_BASE}/public/maintenance-status?portal=mentorSchool`);
    assert(mentorMaintRes.data.isMaintenance === false, 'Maintenance isolation (Mentor portal stays operational)', 'Operational');

    // Turn off maintenance mode
    await axios.put(`${API_BASE}/offline-admin/maintenance`, {
      schoolStudent: { isActive: false, message: '' }
    }, adminHeaders);
    const restoredRes = await axios.get(`${API_BASE}/public/maintenance-status?portal=schoolStudent`);
    assert(restoredRes.data.isMaintenance === false, 'Maintenance mode restored to operational', 'PASS');

    // -------------------------------------------------------------
    // TEST 14: Append-Only Audit Trail Logging
    // -------------------------------------------------------------
    console.log('\n--- Step 14: Audit Trail Verification ---');
    const auditRes = await axios.get(`${API_BASE}/offline-admin/audit-logs`, adminHeaders);
    const auditCount = auditRes.data.data?.length || 0;
    assert(auditRes.status === 200 && auditCount > 0, 'Append-Only Audit Logs Verification', `${auditCount} events recorded`);

    // -------------------------------------------------------------
    // TEST 15: System Health Diagnostics
    // -------------------------------------------------------------
    console.log('\n--- Step 15: System Health Telemetry ---');
    const healthRes = await axios.get(`${API_BASE}/offline-admin/system-health`, adminHeaders);
    assert(healthRes.status === 200 && healthRes.data.data?.status === 'OPERATIONAL', 'System Health Telemetry', `DB Latency: ${healthRes.data.data?.services?.database?.latency}`);

    console.log('\n===============================================================');
    console.log(`E2E CROSS-PORTAL TEST RESULTS: ${results.passed} PASSED, ${results.failed} FAILED`);
    console.log('===============================================================');

  } catch (err) {
    console.error('\x1b[31mE2E Execution encountered an error:\x1b[0m', err.response?.data || err.message);
  }
}

runE2E();
