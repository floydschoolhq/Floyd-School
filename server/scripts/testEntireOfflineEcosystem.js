const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const xlsx = require('xlsx');

const API_BASE = 'http://localhost:5000/api';

const results = { passed: 0, failed: 0, tests: [] };

function assert(condition, testName, detail = '') {
  if (condition) {
    results.passed++;
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${testName}${detail ? ` (${detail})` : ''}`);
  } else {
    results.failed++;
    console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${testName}${detail ? ` (${detail})` : ''}`);
    throw new Error(`Assertion failed: ${testName} - ${detail}`);
  }
}

async function runComprehensiveAudit() {
  console.log('========================================================================');
  console.log('🔍 FULL 4-PORTAL OFFLINE ECOSYSTEM COMPREHENSIVE VERIFICATION AUDIT');
  console.log('========================================================================\n');

  try {
    // -------------------------------------------------------------
    // 1. SUPER ADMIN: OFFLINE ADMIN PORTAL (:5181)
    // -------------------------------------------------------------
    console.log('--- SECTION 1: Super Admin Operations (OfflineAdmin:5181) ---');
    const adminLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'offline.admin@floydschool.in',
      password: 'AdminTest@2026!'
    });
    const adminToken = adminLoginRes.data.token;
    assert(adminLoginRes.status === 200 && !!adminToken, 'Super Admin Authentication', adminLoginRes.data.role);
    const adminHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };

    // 1.1 Dashboard KPIs
    const dashRes = await axios.get(`${API_BASE}/offline-admin/dashboard`, adminHeaders);
    assert(dashRes.status === 200 && dashRes.data.success, 'Fetch Admin Dashboard Telemetry', `Schools: ${dashRes.data.data?.kpis?.totalSchools}`);

    // 1.2 School Provisioning
    const schoolCode = `SCH${Date.now().toString().slice(-4)}`;
    const schoolRes = await axios.post(`${API_BASE}/offline-admin/schools`, {
      name: `Delhi Public School ${schoolCode}`,
      code: schoolCode,
      city: 'Gurugram',
      state: 'Haryana',
      address: 'Sector 45, Urban Estate',
      principalName: 'Dr. Meenakshi Sundaram',
      principalPhone: '+91 9876500001',
      coordinatorName: 'Rajesh Malhotra',
      coordinatorEmail: `coordinator.${schoolCode.toLowerCase()}@floydschool.in`,
      coordinatorPhone: '+91 9876500002',
      curriculum: 'CBSE'
    }, adminHeaders);
    const school = schoolRes.data.data;
    assert(schoolRes.status === 201 && !!school?._id, 'Admin Provisions Partner School', `Code: ${school.code}`);

    // 1.3 Mentor Provisioning
    const mentorEmail = `mentor.${Date.now()}@floydschool.in`;
    const mentorRes = await axios.post(`${API_BASE}/offline-admin/mentors`, {
      name: 'Pooja Bhattacharya',
      email: mentorEmail,
      mobileNumber: '+91 9876512345',
      assignedSchools: [school._id]
    }, adminHeaders);
    const mentor = mentorRes.data.data;
    assert(mentorRes.status === 201 && !!mentor?.mentorId, 'Admin Provisions Mentor with Permanent ID', `Mentor ID: ${mentor.mentorId}`);

    // 1.4 Batch Creation
    const batchCode = `ROB-${Date.now().toString().slice(-4)}`;
    const batchRes = await axios.post(`${API_BASE}/offline-admin/batches`, {
      name: `Class 10 Robotics Cohort ${batchCode}`,
      code: batchCode,
      schoolId: school._id,
      instructorId: mentor._id,
      subject: 'Robotics & MicroPython',
      scheduleDays: ['Monday', 'Wednesday', 'Friday'],
      scheduleTime: '09:00 AM - 10:30 AM',
      roomVenue: 'STEM Lab 1',
      capacity: 35,
      academicYear: '2025-2026'
    }, adminHeaders);
    const batch = batchRes.data.data;
    assert(batchRes.status === 201 && !!batch?._id, 'Admin Provisions Cohort Batch', `Batch: ${batch.code}`);

    // 1.5 Excel Import Simulation with Actual Workbook Generation
    console.log('\n--- SECTION 2: Excel Bulk Ingestion with Multipart Parsing ---');
    const importRows = [
      {
        'Student Name': 'Kavya Singhania',
        'School Code': school.code,
        'Class': '10',
        'Section': 'A',
        'Father Name': 'Vikram Singhania',
        'Student Mobile': '+91 9811223344',
        'Father Mobile': '+91 9811223355',
        'Email': `kavya.${Date.now()}@floydschool.in`,
        'Batch Code': batch.code
      }
    ];

    // Build real binary Excel buffer using xlsx
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(importRows);
    xlsx.utils.book_append_sheet(wb, ws, 'Students');
    const xlsxBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Post to multipart endpoint using FormData
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', xlsxBuffer, { filename: 'students.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const importPreviewRes = await axios.post(`${API_BASE}/offline-admin/students/import-preview`, form, {
      headers: {
        ...adminHeaders.headers,
        ...form.getHeaders()
      }
    });
    assert(importPreviewRes.status === 200 && importPreviewRes.data?.summary?.validCount === 1, 'Excel Ingestion & Schema Duplicate Validation', `Valid: ${importPreviewRes.data?.summary?.validCount}`);

    const importConfirmRes = await axios.post(`${API_BASE}/offline-admin/students/import-confirm`, {
      rows: importPreviewRes.data.rows
    }, adminHeaders);
    const provisionedStudentReport = importConfirmRes.data?.credentialsReport?.[0];
    assert(importConfirmRes.status === 201 && !!provisionedStudentReport?.studentId, 'Permanent Student ID Issuance & Temporary Credential', `ID: ${provisionedStudentReport?.studentId}`);

    // 1.6 Single Student Provisioning via Admin
    const singleStudentEmail = `student.single.${Date.now()}@floydschool.in`;
    const singleStudentRes = await axios.post(`${API_BASE}/offline-admin/students`, {
      name: 'Rohan Deshmukh',
      email: singleStudentEmail,
      schoolId: school._id,
      batchId: batch._id,
      grade: '10',
      section: 'A',
      fatherName: 'Anil Deshmukh',
      studentMobile: '+91 9876543219',
      fatherMobile: '+91 9876543218'
    }, adminHeaders);
    const singleStudent = singleStudentRes.data.data;
    assert(singleStudentRes.status === 201 && !!singleStudent?.studentId, 'Admin Provisions Single Student Directly', `ID: ${singleStudent.studentId}`);

    // 1.7 Admin Publishes Assignment and Quiz
    const adminAssignmentRes = await axios.post(`${API_BASE}/offline-admin/assignments`, {
      title: 'Admin Capstone: Microcontroller PWM Calibration',
      description: 'Compute duty cycle frequency for servo pulse signals.',
      batchId: batch._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      maxMarks: 100
    }, adminHeaders);
    const adminAssignment = adminAssignmentRes.data.data;
    assert(adminAssignmentRes.status === 201 && !!adminAssignment?._id, 'Admin Publishes Capstone Assignment');

    const adminQuizRes = await axios.post(`${API_BASE}/offline-admin/quizzes`, {
      title: 'Admin Baseline STEM Assessment',
      batchId: batch._id,
      timeLimitMinutes: 15,
      questions: [
        {
          questionText: 'What is the voltage logic level of ESP32 GPIO pins?',
          options: ['3.3V', '5V', '12V', '1.8V'],
          correctOption: 0
        },
        {
          questionText: 'Which protocol is used for I2C communication?',
          options: ['SDA and SCL', 'TX and RX', 'MISO and MOSI', 'VCC and GND'],
          correctOption: 0
        }
      ]
    }, adminHeaders);
    const adminQuiz = adminQuizRes.data.data;
    assert(adminQuizRes.status === 201 && !!adminQuiz?._id, 'Admin Publishes Assessment Quiz');

    // 1.8 Admin Publishes Learning Material
    const adminMatRes = await axios.post(`${API_BASE}/offline-admin/materials`, {
      title: 'ESP32 Technical Reference Manual',
      description: 'Datasheet and register specifications',
      batchId: batch._id,
      moduleName: 'Core Microcontroller Architecture',
      fileUrl: 'https://docs.floydschool.in/esp32_tech_ref.pdf',
      fileType: 'pdf'
    }, adminHeaders);
    assert(adminMatRes.status === 201 && adminMatRes.data.success, 'Admin Publishes Learning Material to Repository');

    // 1.9 CSV Report Exports (Students, Mentors, Attendance)
    const stuExportRes = await axios.get(`${API_BASE}/offline-admin/reports/export?type=students&school=${school._id}`, {
      ...adminHeaders,
      responseType: 'text'
    });
    assert(stuExportRes.status === 200 && stuExportRes.data.includes(singleStudent.studentId), 'Export Student Credential & Identity CSV');

    const mentorExportRes = await axios.get(`${API_BASE}/offline-admin/reports/export?type=mentors`, {
      ...adminHeaders,
      responseType: 'text'
    });
    assert(mentorExportRes.status === 200 && mentorExportRes.data.includes(mentor.mentorId), 'Export Mentor Credential & Roster CSV');

    // -------------------------------------------------------------
    // 2. MENTOR: MENTORSCHOOL PORTAL (:5180)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: Mentor Field Operations (MentorSchool:5180) ---');
    const mentorLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: mentor.email,
      password: mentor.temporaryPassword
    });
    const mentorToken = mentorLoginRes.data.token;
    assert(mentorLoginRes.status === 200 && !!mentorToken, 'Mentor Authentication on MentorSchool', `Mentor: ${mentor.name}`);
    const mentorHeaders = { headers: { Authorization: `Bearer ${mentorToken}` } };

    // 2.1 Mentor checks batches
    const mentorBatchesRes = await axios.get(`${API_BASE}/mentor/offline/batches`, mentorHeaders);
    assert(mentorBatchesRes.status === 200 && mentorBatchesRes.data.data?.length > 0, 'Mentor Sees Assigned Batches');

    // 2.2 Mentor Marks Attendance
    const mentorAttRes = await axios.post(`${API_BASE}/mentor/offline/mark-attendance`, {
      schoolId: school._id,
      batchId: batch._id,
      date: new Date().toISOString(),
      topicCovered: 'ESP32 PWM Servo Control & MicroPython Motors',
      records: [
        {
          studentId: singleStudent._id,
          status: 'present',
          remarks: 'Calibrated servo angle 0-180deg'
        }
      ]
    }, mentorHeaders);
    assert(mentorAttRes.status === 200 && mentorAttRes.data.success, 'Mentor Marks Live Session Attendance');

    // 2.3 Mentor Creates Class Guide
    const guideRes = await axios.post(`${API_BASE}/mentor/offline/class-guides`, {
      batchId: batch._id,
      schoolId: school._id,
      topic: 'Pulse Width Modulation (PWM) Mastery',
      objective: 'Understand timer frequency and angular position control',
      teachingPlan: '1. Theoretical PWM intro (15m) 2. Hardware wiring (20m) 3. Code calibration (40m)',
      labActivities: 'Wiring SG90 servo to Pin 18 on ESP32 development board',
      expectedOutcomes: 'Students successfully articulate motor angle via terminal commands'
    }, mentorHeaders);
    assert(guideRes.status === 201 && guideRes.data.success, 'Mentor Creates Standardized Class Guide');

    // -------------------------------------------------------------
    // 3. STUDENT: SCHOOLSTUDENT PORTAL (:5178)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Student Learning Experience (SchoolStudent:5178) ---');
    const studentLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: singleStudent.email,
      password: singleStudent.temporaryPassword
    });
    const studentToken = studentLoginRes.data.token;
    assert(studentLoginRes.status === 200 && !!studentToken, 'Student Authentication on SchoolStudent', `ID: ${singleStudent.studentId}`);
    const studentHeaders = { headers: { Authorization: `Bearer ${studentToken}` } };

    // 3.1 Student Dashboard
    const stuDashRes = await axios.get(`${API_BASE}/school-student/dashboard`, studentHeaders);
    assert(stuDashRes.status === 200 && stuDashRes.data.data?.student?.offlineRollNo !== 'Pending Allotment', 'Student Dashboard Shows Allotted Roll & Timetable', `Roll: ${stuDashRes.data.data?.student?.offlineRollNo}`);

    // 3.2 Student Views Personal Attendance Record
    const stuAttRes = await axios.get(`${API_BASE}/school-student/attendance`, studentHeaders);
    const stuAttList = Array.isArray(stuAttRes.data.data) ? stuAttRes.data.data : (stuAttRes.data.data?.history || []);
    assert(stuAttRes.status === 200 && stuAttList.length > 0 && stuAttList[0].status === 'present', 'Student Verifies Mentor Attendance Record', `Status: ${stuAttList[0]?.status}`);

    // 3.3 Student Accesses Published Learning Materials
    const stuMatRes = await axios.get(`${API_BASE}/school-student/materials`, studentHeaders);
    assert(stuMatRes.status === 200 && stuMatRes.data.data?.length > 0, 'Student Accesses Class Materials Repository');

    // 3.4 Student Takes Quiz and Submits Answers
    const stuQuizListRes = await axios.get(`${API_BASE}/school-student/quizzes`, studentHeaders);
    const targetQuiz = stuQuizListRes.data.data?.find(q => q._id === adminQuiz._id);
    assert(!!targetQuiz && targetQuiz.questions[0].correctOption === undefined, 'Anti-Cheating Security: Correct Option Omitted From Student Payload');

    const stuQuizSubmitRes = await axios.post(`${API_BASE}/school-student/quizzes/${adminQuiz._id}/submit`, {
      answers: [
        { questionIndex: 0, selectedOption: 0 }, // 3.3V (correct)
        { questionIndex: 1, selectedOption: 0 }  // SDA and SCL (correct)
      ]
    }, studentHeaders);
    assert(stuQuizSubmitRes.status === 200 && stuQuizSubmitRes.data.data?.percentage === 100, 'Student Submits Quiz & Auto-Graded (100%)', `Score: ${stuQuizSubmitRes.data.data?.score}/${stuQuizSubmitRes.data.data?.totalMarks}`);

    // 3.5 Student Submits Assignment
    const stuHwSubmitRes = await axios.post(`${API_BASE}/school-student/assignments/${adminAssignment._id}/submit`, {
      content: 'Configured timer frequency at 50Hz, duty cycle mapped between 1000us and 2000us.'
    }, studentHeaders);
    assert(stuHwSubmitRes.status === 200, 'Student Submits Homework Challenge Response');

    // 3.6 Student Profile & Contact Update
    const stuProfRes = await axios.get(`${API_BASE}/school-student/profile`, studentHeaders);
    assert(stuProfRes.status === 200 && stuProfRes.data.data?.studentId === singleStudent.studentId, 'Student Profile Displays Permanent Floyd Student ID', stuProfRes.data.data?.studentId);

    const stuUpdateProfRes = await axios.put(`${API_BASE}/school-student/profile`, {
      studentMobile: '+91 9876599999',
      fatherMobile: '+91 9876588888',
      fatherName: 'Anil R. Deshmukh'
    }, studentHeaders);
    assert(stuUpdateProfRes.status === 200 && stuUpdateProfRes.data.data?.studentMobile === '+91 9876599999', 'Student Updates Guardian Contact Details');

    // 3.7 Student Submits Help Ticket
    const ticketRes = await axios.post(`${API_BASE}/school-student/help`, {
      subject: 'Clarification regarding SPI chip select logic',
      issue: 'Is CS active low or active high for the RFID-RC522 reader module?'
    }, studentHeaders);
    assert(ticketRes.status === 201 && !!ticketRes.data.data?._id, 'Student Submits Academic Support Ticket');

    // -------------------------------------------------------------
    // 4. COORDINATOR: PARTNERSCHOOL PORTAL (:5179)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: Coordinator Oversight (PartnerSchool:5179) ---');
    const coordLoginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'coordinator.dps@floydschool.in',
      password: 'Coordinator@123'
    });
    const coordToken = coordLoginRes.data.token;
    assert(coordLoginRes.status === 200 && !!coordToken, 'Coordinator Authentication on PartnerSchool', 'DPS Coordinator');
    const coordHeaders = { headers: { Authorization: `Bearer ${coordToken}` } };

    // 4.1 Coordinator Dashboard Stats
    const coordStatsRes = await axios.get(`${API_BASE}/partner-school/stats`, coordHeaders);
    assert(coordStatsRes.status === 200 && coordStatsRes.data.success, 'Coordinator Fetches Institutional Dashboard Stats');

    // 4.2 Coordinator Views Attendance Ledger
    const coordAttRes = await axios.get(`${API_BASE}/partner-school/attendance`, {
      ...coordHeaders,
      params: { schoolId: school._id, batchId: batch._id }
    });
    assert(coordAttRes.status === 200, 'Coordinator Views School Attendance Ledger');

    // 4.3 Coordinator Single Student Registration
    const coordStudentEmail = `coord.student.${Date.now()}@floydschool.in`;
    const coordStudentRes = await axios.post(`${API_BASE}/partner-school/students`, {
      name: 'Aditi Nair',
      email: coordStudentEmail,
      grade: 'Grade 10',
      section: 'B',
      fatherName: 'Manoj Nair',
      studentMobile: '+91 9871100022',
      batchId: batch._id
    }, coordHeaders);
    assert(coordStudentRes.status === 201 && !!coordStudentRes.data.data?.studentId, 'Coordinator Registers Student with Generated Floyd Student ID', `ID: ${coordStudentRes.data.data?.studentId}`);

    // -------------------------------------------------------------
    // 5. MAINTENANCE MODE CONTROL & ISOLATION CHECK
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: Cross-Portal Maintenance Lockout & Recovery ---');
    // Lock Student portal specifically
    await axios.put(`${API_BASE}/offline-admin/maintenance`, {
      entirePlatform: { isActive: false, message: '' },
      schoolStudent: {
        isActive: true,
        message: 'Student Portal offline for scheduled hardware lab maintenance.'
      },
      partnerSchool: { isActive: false, message: '' },
      mentorSchool: { isActive: false, message: '' }
    }, adminHeaders);

    const publicStudentMaint = await axios.get(`${API_BASE}/public/maintenance-status?portal=schoolStudent`);
    assert(publicStudentMaint.data.isMaintenance === true, 'Selective Lockout: Student Portal In Maintenance', publicStudentMaint.data.message);

    const publicMentorMaint = await axios.get(`${API_BASE}/public/maintenance-status?portal=mentorSchool`);
    assert(publicMentorMaint.data.isMaintenance === false, 'Isolation Guarantee: Mentor Portal Stays Operational');

    // Restore Student portal
    await axios.put(`${API_BASE}/offline-admin/maintenance`, {
      entirePlatform: { isActive: false, message: '' },
      schoolStudent: { isActive: false, message: '' },
      partnerSchool: { isActive: false, message: '' },
      mentorSchool: { isActive: false, message: '' }
    }, adminHeaders);
    const restoredStudentMaint = await axios.get(`${API_BASE}/public/maintenance-status?portal=schoolStudent`);
    assert(restoredStudentMaint.data.isMaintenance === false, 'Maintenance Mode Restored to Normal Operations');

    // -------------------------------------------------------------
    // 6. APPEND-ONLY AUDIT LOGS & HEALTH TELEMETRY
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: System Telemetry & Immutable Audit Verification ---');
    const auditRes = await axios.get(`${API_BASE}/offline-admin/audit-logs`, adminHeaders);
    const auditLogs = auditRes.data.data || [];
    assert(auditRes.status === 200 && auditLogs.length > 0, 'Append-Only Audit Trail Recorded Administrative Events', `Logged: ${auditLogs.length} events`);

    const healthRes = await axios.get(`${API_BASE}/offline-admin/system-health`, adminHeaders);
    assert(healthRes.status === 200 && healthRes.data.data?.status === 'OPERATIONAL', 'Real-Time Health Telemetry Operational', `DB: ${healthRes.data.data?.services?.database?.latency}`);

    console.log('\n========================================================================');
    console.log(`🎉 ALL ECOSYSTEM AUDIT TESTS PASSED: ${results.passed} PASSED, ${results.failed} FAILED (100% SUCCESS)`);
    console.log('========================================================================\n');

  } catch (err) {
    console.error('\n\x1b[31mE2E Execution encountered an error:\x1b[0m', err.response?.data || err.message);
    process.exit(1);
  }
}

runComprehensiveAudit();
