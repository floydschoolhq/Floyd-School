# Floyd School Offline Portals — Technical Knowledge Base & Ecosystem Architecture

> **Document Version**: 1.0.0  
> **Last Verified**: September 2026  
> **Target Systems**: `SchoolStudent/` (Student Portal), `PartnerSchool/` (Coordinator Portal), `server/` (Unified Backend), Mentor Portal, and Admin Portal.

---

## 1. Executive Summary

The **Floyd School Offline Portals** provide an institutional digital companion for physical classroom schools offering STEM, Robotics, Embedded Systems, and AI curricula. 

All portals communicate with a single unified Express.js backend and a single shared MongoDB Atlas cluster (`thinkskool`). Offline records exist alongside online course records without breaking existing online students, courses, or permissions.

---

## 2. Complete Feature Matrix — Offline SchoolStudent Portal

The `SchoolStudent` portal (`http://localhost:5178`) is purpose-built for students attending offline laboratory sessions.

| # | Feature / Page | Route | Description & User Capabilities | Technical Implementation | Data Status |
|---|---|---|---|---|---|
| **1** | **Authentication & Dual Entry** | `/login` | • Email & password login.<br>• Validates role (`school_student`, `student`, or `admin`).<br>• Remembers JWT token in `localStorage`. | `api.post('/auth/login')`<br>Redirects to `/` on success. | **Live Database** |
| **2** | **Student Self-Registration** | `/login` (Register tab) | • Fetches active partner schools dynamically for dropdown.<br>• Collects: Name, Email, Password, Grade, Section, Father Name, Student Mobile, Father Mobile, School Selection.<br>• Sets status to `pending` quarantine. | `api.get('/school-student/public-schools')`<br>`api.post('/school-student/register')` | **Live Database** |
| **3** | **Quarantine / Approval Pending View** | `/` | • Restricts newly self-registered students from accessing homework/quizzes until verified by an offline mentor.<br>• Shows clean banner with next steps. | Checked via `isPendingApproval: true` returned from `/api/school-student/dashboard`. | **Live Database** |
| **4** | **Classroom Command Dashboard** | `/` | • Displays 4 KPI metric cards:<br>  - **Attendance Rate** (calculated %)<br>  - **Classes Attended** vs Total Sessions<br>  - **Pending Quizzes** count<br>  - **Pending Homework** count<br>• Displays offline batch details: Subject, Lab Venue, Scheduled Days & Time.<br>• Quick shortcut links to all sections. | `api.get('/school-student/dashboard')`<br>Populates `User` with `School` and `Batch`. | **Live Database** |
| **5** | **Session Attendance History** | `/attendance` | • Overall attendance percentage dial.<br>• Detailed history table: Date, Batch Name, Hands-on Topic Covered, Status (`PRESENT`, `LATE`, `ABSENT`), Remarks. | `api.get('/school-student/attendance')`<br>Queries `Attendance` collection for batch and student record. | **Live Database** |
| **6** | **Assessments & Quizzes** | `/quizzes` | • Lists batch quizzes with status (`Completed` vs `Start Quiz`).<br>• MCQ quiz taker with countdown timer and radio buttons.<br>• **Anti-Cheating Projection**: Correct options are hidden server-side (`select: false`).<br>• Immediate evaluation and score display.<br>• Prevents duplicate quiz submissions. | `api.get('/school-student/quizzes')`<br>`api.post('/school-student/quizzes/:id/submit')`<br>Saved in `QuizSubmission`. | **Live Database** |
| **7** | **Homework & Project Submissions** | `/assignments` | • Displays active homework challenges, lab experiments, deadlines, and max marks.<br>• Modal upload for project files (`.ino`, `.py`, `.pdf`, `.zip`, images) and project description notes.<br>• Displays instructor evaluation: Marks obtained (e.g. `96/100`) and feedback text. | `api.get('/school-student/assignments')`<br>`api.post('/school-student/assignments/:id/submit')`<br>Uses Multer storage in `server/uploads/assignments/`. | **Live Database** |
| **8** | **Classroom Batch Schedule** | `/schedule` | • Timetable view of classroom days, timings, lab room number, and mentor subject.<br>• **Socket.io Live Sync**: Automatically re-fetches when server emits schedule updates. | `api.get('/school-student/dashboard')` + Socket event `batch-schedule-updated`. | **Live Database** |
| **9** | **Digital & Printable Lab ID Pass** | Modal from `/profile` or Header | • Printable official Floyd School lab pass.<br>• Displays: Full Name, Roll No (`STXAV-ROB10A-001`), School Name, Batch Name, Grade, Section, Father Name, Academic Year, QR code badge.<br>• 1-Click "Print ID Card" formatting for thermal/plastic card printing. | `StudentIDCard.jsx` driven by live student profile data. | **Live Database** |
| **10** | **Profile & Contact Management** | `/profile` | • Read-only institutional credentials: Roll No, School, Batch.<br>• Editable guardian details: Student Mobile, Father Mobile, Father Name, Password.<br>• Backend prevents unauthorized alteration of roll number, school, or batch. | `api.get('/school-student/profile')`<br>`api.put('/school-student/profile')` | **Live Database** |
| **11** | **In-App Notification Center** | Bell icon in Header | • Popover drawer showing notifications for:<br>  - Registration received<br>  - Mentor approval & roll number issuance<br>  - Quiz result ready<br>  - Homework graded by mentor<br>• Unread indicator badge and mark-as-read tracking. | `api.get('/school-student/notifications')`<br>`api.put('/school-student/notifications/:id/read')` | **Live Database** |
| **12** | **Doubt Clearing & Helpdesk** | `/help` | • Form to submit technical queries or lab hardware issues directly to mentors.<br>• Ticket history with status (`open`, `in-progress`, `resolved`) and mentor response message threads. | `api.get('/school-student/help')`<br>`api.post('/school-student/help')`<br>Stored in `SupportTicket`. | **Live Database** |
| **13** | **Offline Learning Modules (Curriculum Companion)** | `/learning` | • Offline guide and syllabus reference for Robotics, MicroPython, Sensor Interfacing, and Embedded Electronics. | `LearningModules.jsx` | Static Companion |

---

## 3. Ecosystem Architecture & Inter-Portal Connections

```
                             ┌──────────────────────────────────────┐
                             │       MongoDB Atlas (thinkskool)     │
                             │  User | School | Batch | Attendance  │
                             │  Quiz | QuizSubmission | Assignment  │
                             │  Submission | Notification | Ticket  │
                             └──────────────────▲───────────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 │                              │                              │
        ┌────────┴────────┐            ┌────────┴────────┐            ┌────────┴────────┐
        │  SchoolStudent  │            │  Mentor Portal  │            │  PartnerSchool  │
        │  Portal (:5178) │            │ (Offline Ctrl)  │            │ Portal (:5179)  │
        └─────────────────┘            └─────────────────┘            └─────────────────┘
                 ▲                              ▲                              ▲
                 │                              │                              │
                 └──────────────────────────────┼──────────────────────────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │      Admin Portal     │
                                    │ (Full God-Mode Access)│
                                    └───────────────────────┘
```

### A. Student Portal ↔ Mentor Portal Connection

1. **Student Onboarding & Approval Flow**:
   - When a student registers at `/login`, `User.approvalStatus` is set to `pending`.
   - Mentors view pending candidates via `GET /api/mentor/offline/pending-students`.
   - When the mentor selects a batch and clicks **Approve** (`POST /api/mentor/offline/approve-student`):
     - The student is assigned to `Batch.students`.
     - A deterministic roll number is generated: `[SchoolCode]-[BatchCode]-[001]` (e.g. `STXAV-ROB10A-001`).
     - Status transitions to `approved`.
     - An in-app `Notification` is sent to the student.
     - A Socket.io event (`student:approved`) unlocks the student's dashboard in real time.

2. **Attendance Session Logging**:
   - Mentors record session attendance via `POST /api/mentor/offline/mark-attendance`.
   - Once submitted, the student's dashboard dynamically recalculates `attendancePercentage`, `attendedClasses`, and displays the session under `/attendance`.

3. **Academic Doubt Clearing**:
   - Questions submitted by students under `/help` are logged as `SupportTicket` documents with `priority: 'medium'` and `status: 'open'`, allowing mentors to reply directly to the student.

---

### B. Student Portal ↔ Partner School (Coordinator) Portal Connection

1. **Direct Onboarding (Bypassing Mentors)**:
   - School Coordinators can onboard students individually or via **Bulk CSV Import** (`POST /api/partner-school/students/bulk`).
   - If assigned to a batch during import, students are automatically given unique roll numbers and marked as `approved`, skipping the quarantine queue.

2. **Classroom Attendance**:
   - Coordinators have identical authority to mentors to record daily attendance via `POST /api/partner-school/attendance`.

3. **Homework Evaluation & Grading**:
   - When students submit homework at `/assignments`, it appears in the coordinator's assessment list (`GET /api/partner-school/assessments`).
   - Coordinators grade submissions via `POST /api/partner-school/assignments/:id/grade`, updating `marksObtained` and providing qualitative `feedback`.
   - The student's homework card updates with marks and feedback.

4. **Cohort Academic Promotion**:
   - At the end of the academic year, coordinators select an entire class batch and run **Promote Class** (`POST /api/partner-school/promote-students`).
   - All students in the cohort are batch-promoted (e.g. `Grade 10` → `Grade 11`, `2025-2026` → `2026-2027`) while maintaining all historical attendance, submissions, and grades.

---

### C. Student Portal ↔ Admin Portal Connection

1. **Universal Access**:
   - Every offline endpoint uses `authorize('school_coordinator', 'admin')` or `authorize('mentor', 'admin')` or `authorize('school_student', 'student', 'admin')`.
   - System administrators can perform any mentor or coordinator action (approving students, reassigning batches, editing attendance logs, creating quizzes/assignments).

2. **Cross-School Scoping**:
   - While coordinators are restricted to their own school, administrators can supply `schoolId` as a query parameter or body property to manage any affiliated school.

---

## 4. Standardized Deterministic Roll Number Generation

All offline roll numbers are programmatically assigned using `server/utils/rollNumberGenerator.js`:

$$\text{Roll Number Format} = \mathbf{[SchoolCode]}-\mathbf{[BatchCode]}-\mathbf{[SequenceNumber]}$$

### Examples:
- School: *St. Xavier's STEM Academy* (`STXAV`)
- Batch: *Grade 10 Robotics Section A* (`ROB10A`)
- Assigned Roll Number: `STXAV-ROB10A-001`, `STXAV-ROB10A-002`, etc.

### Collision Protection:
- The generator inspects existing database records using a regular expression prefix search (`^STXAV-ROB10A-`).
- If a sequence number already exists, it auto-increments until a guaranteed vacant slot is allocated.
- Enforced with a `sparse: true, unique: true` index on `User.offlineRollNo`.

---

## 5. Security & Anti-Cheating Architecture

1. **Quiz Answer Leakage Prevention**:
   - In `server/models/Quiz.js`, the schema field `questions.correctOption` has `{ select: false }`.
   - When students query quizzes via `GET /api/school-student/quizzes`, answers are completely omitted from the payload.
   - When `POST /api/school-student/quizzes/:id/submit` is called, the backend explicitly invokes `.select('+questions.correctOption')` for server-side evaluation.

2. **Duplicate Submission Prevention**:
   - `QuizSubmission` uses a compound unique index `{ quiz: 1, student: 1 }`.
   - A second submission attempt returns HTTP 400 with `'You have already submitted this quiz'`.

3. **Profile Parameter Tampering Protection**:
   - `PUT /api/school-student/profile` explicitly accepts only `studentMobile`, `fatherMobile`, `fatherName`, and `password`.
   - Any injected parameters for `role`, `offlineRollNo`, `school`, `batch`, or `approvalStatus` are completely ignored by the controller.

4. **File Upload Security**:
   - Handled via `multer` in `server/middleware/uploadMiddleware.js`.
   - Capped at 10 MB per file.
   - Saves into `uploads/assignments/` with unique timestamps and sanitization.

---

## 6. Automated Verification Test Suite (22/22 PASSED)

A 22-point end-to-end integration test (`server/scripts/testSchoolStudentComprehensive.js`) was executed against the production MongoDB Atlas database:

```text
===============================================================
🧪 COMPREHENSIVE SCHOOLSTUDENT PORTAL & ECOSYSTEM TEST SUITE 🧪
===============================================================

Connected to MongoDB Atlas successfully.

✅ PASS: Public Schools Directory (GET /public-schools) (Found 2 active schools)
✅ PASS: Student Self-Registration (POST /register) (Email: test.student...floydschool.in)
✅ PASS: Registration Initial State is Pending (No roll number before approval)
✅ PASS: Student Dashboard Pending Detection (GET /dashboard) (UI renders pending allotment banner)
✅ PASS: Mentor Approval & Batch Allotment (POST /api/mentor/offline/approve-student) (Assigned: STXAV-ROB10A-002)
✅ PASS: Approval Notification Generated for Student (Registration Approved & Batch Allotted!)
✅ PASS: Student Dashboard Approved State (GET /dashboard) (Roll: STXAV-ROB10A-002, Venue: Robotics Lab 101)
✅ PASS: Classroom Attendance Marked by Mentor/Coordinator (Status: present)
✅ PASS: Student Attendance Records Query (GET /attendance) (Found 1 session(s))
✅ PASS: Quiz Anti-Cheating Security (GET /quizzes - correctOption hidden from student query)
✅ PASS: Student Quiz Submission & Auto-Evaluation (POST /quizzes/:id/submit) (Score: 20/20 - 100%)
✅ PASS: Duplicate Quiz Submission Prevention (Requirement 17) (Single submission strictly enforced)
✅ PASS: Homework Project Submission (POST /assignments/:id/submit) (File: /uploads/assignments/obstacle_avoidance.ino)
✅ PASS: Assignment Graded by Mentor/Coordinator (Feedback visible to student) (Marks: 96/100)
✅ PASS: Student Profile Fetch (GET /profile) (Roll: STXAV-ROB10A-002)
✅ PASS: Student Profile Update Contact Details (PUT /profile) (Guardian & mobile updated)
✅ PASS: Profile Security: Sensitive Fields Immutable by Student (RollNo, school, batch, status protected)
✅ PASS: Student Help Desk Ticket Creation (POST /help) (Subject: PWM Frequency Query)
✅ PASS: Student Support Tickets Retrieval (GET /help) (Retrieved 1 ticket(s))
✅ PASS: Notifications Inbox Query (GET /notifications) (Found 2 notifications)
✅ PASS: Mark Notification Read (PUT /notifications/:id/read) (Read flag updated with timestamp)
✅ PASS: Digital & Printable Student ID Card Data Availability (Roll: STXAV-ROB10A-002)

🧹 Test teardown and cleanup completed cleanly.

===============================================================
📊 FINAL RESULT: 22/22 TESTS PASSED (100%)
===============================================================
```

### Production Build Verification:
- `SchoolStudent` Frontend: **`npm run build` passed with 0 errors**.
- `PartnerSchool` Frontend: **`npm run build` passed with 0 errors**.

---

## 7. Verified Test Credentials Ready for Immediate Use

The following test accounts are pre-seeded in the live MongoDB Atlas database:

| Persona / Portal | Email | Password | Role / Access Details |
|---|---|---|---|
| **School Student (Approved)** | `student.test@floydschool.in` | `StudTest@2026!` | Active student with Roll No: `STXAV-ROB10A-001`, Batch: `ROB10A`. Can take quizzes, view attendance, submit homework, print ID card. |
| **School Student (Pending)** | `pending.student@floydschool.in` | `PendTest@2026!` | Registered candidate awaiting batch allotment. Tests the quarantine banner. |
| **Partner School Coordinator** | `coordinator.test@floydschool.in` | `CoordTest@2026!` | School Coordinator for St. Xavier's STEM Academy (`STXAV`). Can mark attendance, create batches, enroll students, and grade homework. |
| **Offline Mentor** | `mentor@floydschool.com` | `mentor123` | Can approve pending students, allot batches, and log attendance. |
| **Super Admin** | `admin@floydschool.com` | `admin123` | Full administrative oversight across all portals and schools. |

---

## 8. Operational Guide & Run Instructions

### A. Starting the Applications Locally

Open 3 PowerShell terminal windows:

**1. Main Express.js Backend**:
```powershell
cd c:\Users\shans\OneDrive\Desktop\3.4.26\THINKSKOOL-\server
npm start
# Server listens on http://localhost:5000/api
```

**2. SchoolStudent Frontend Portal**:
```powershell
cd c:\Users\shans\OneDrive\Desktop\3.4.26\THINKSKOOL-\SchoolStudent
npm run dev
# Vite runs on http://localhost:5178
```

**3. PartnerSchool Coordinator Portal**:
```powershell
cd c:\Users\shans\OneDrive\Desktop\3.4.26\THINKSKOOL-\PartnerSchool
npm run dev
# Vite runs on http://localhost:5179
```

---

### B. Production Deployment Notes

1. **Environment Variables**:
   - In `SchoolStudent/.env`:
     ```env
     VITE_API_URL=https://your-production-backend.com/api
     ```
   - In `PartnerSchool/.env`:
     ```env
     VITE_API_URL=https://your-production-backend.com/api
     ```
2. **CORS Whitelist**:
   - In `server/index.js`, ensure your production frontend domains are included in `allowedOrigins`.
3. **Static File Serving**:
   - Uploaded assignment files are served statically from `/uploads`.
   - On ephemeral cloud hosts (e.g. Render Free Tier, Vercel Serverless), local files in `uploads/` are not persisted across server restarts. For permanent cloud storage, configure AWS S3, Cloudinary, or Google Cloud Storage in `server/middleware/uploadMiddleware.js`.
4. **Vercel SPA Rewrites**:
   - Both `SchoolStudent/vercel.json` and `PartnerSchool/vercel.json` are pre-configured with `{ "source": "/(.*)", "destination": "/index.html" }` to prevent 404 errors on browser page reloads.

---

## 9. Recommended Future Enhancements

1. **Physical Lab Equipment & Sensor Kit Tracker**:
   - Enable students to digitally sign out microcontroller development boards (Arduino, ESP32, Raspberry Pi Pico) and sensors from the physical school lab inventory.
2. **Public Student STEM Portfolio**:
   - A shareable URL for each student highlighting physical robot builds, photos, wiring schematics, and code repositories.
3. **Automated Course Completion Certificate**:
   - Dynamic PDF generation with verification QR code when an offline student completes > 75% attendance and all required quizzes.
4. **Automated Parent SMS / WhatsApp Attendance Notifications**:
   - Integrate Twilio or an Indian SMS gateway (e.g. Fast2SMS / Gupshup) to notify parents via SMS whenever a student is marked absent in an offline lab session.
