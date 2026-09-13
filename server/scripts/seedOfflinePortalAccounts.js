const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const School = require('../models/School');
const Batch = require('../models/Batch');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const Notification = require('../models/Notification');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedOfflineData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment');
        }

        console.log('Connecting to MongoDB Atlas...');
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB Atlas successfully.');

        // 1. Seed or find Partner Schools
        let school = await School.findOne({ code: 'STXAV' });
        if (!school) {
            school = await School.create({
                name: "St. Xavier's STEM Academy",
                code: 'STXAV',
                city: 'New Delhi',
                address: 'Sector 12, RK Puram, New Delhi',
                contactPerson: 'Mr. Arvind Sharma',
                contactEmail: 'contact@stxaviers-delhi.edu.in',
                contactPhone: '+91 11 2617 8900',
                studentQuota: 500,
                isActive: true,
                academicYear: '2025-2026'
            });
            console.log('Created Partner School:', school.name, `(${school.code})`);
        } else {
            console.log('Partner School already exists:', school.name);
        }

        let school2 = await School.findOne({ code: 'DPSS' });
        if (!school2) {
            school2 = await School.create({
                name: 'Delhi Public STEM School',
                code: 'DPSS',
                city: 'Noida',
                address: 'Sector 30, Noida',
                contactPerson: 'Ms. Neha Gupta',
                contactEmail: 'contact@dps-noida.edu.in',
                contactPhone: '+91 120 4567 890',
                studentQuota: 500,
                isActive: true,
                academicYear: '2025-2026'
            });
            console.log('Created Partner School:', school2.name, `(${school2.code})`);
        }

        // 2. Seed Coordinator Test Account
        const coordinatorEmail = process.env.TEST_COORDINATOR_EMAIL || 'coordinator.test@floydschool.in';
        const coordinatorPassword = process.env.TEST_COORDINATOR_PASSWORD || 'CoordTest@2026!';

        let coordinator = await User.findOne({ email: coordinatorEmail });
        if (!coordinator) {
            coordinator = await User.create({
                name: 'Pooja Verma',
                email: coordinatorEmail,
                password: coordinatorPassword,
                role: 'school_coordinator',
                school: school._id,
                mobileNumber: '+91 98112 34567'
            });
            console.log('Created Coordinator Test Account:', coordinator.email);
        } else {
            coordinator.role = 'school_coordinator';
            coordinator.school = school._id;
            await coordinator.save();
            console.log('Coordinator Test Account verified:', coordinator.email);
        }

        // Ensure coordinator is registered in school.coordinators
        if (!school.coordinators.includes(coordinator._id)) {
            school.coordinators.push(coordinator._id);
            await school.save();
        }

        // 2b. Seed DPS Coordinator Account
        let coordDps = await User.findOne({ email: 'coordinator.dps@floydschool.in' });
        if (!coordDps) {
            coordDps = await User.create({
                name: 'DPS School Coordinator',
                email: 'coordinator.dps@floydschool.in',
                password: 'Coordinator@123',
                role: 'school_coordinator',
                school: school2._id,
                mobileNumber: '+91 9876543210'
            });
            console.log('Created DPS Coordinator Account:', coordDps.email);
        } else {
            coordDps.role = 'school_coordinator';
            coordDps.password = 'Coordinator@123';
            coordDps.school = school2._id;
            await coordDps.save();
            console.log('DPS Coordinator Account verified:', coordDps.email);
        }
        if (!school2.coordinators.includes(coordDps._id)) {
            school2.coordinators.push(coordDps._id);
            await school2.save();
        }

        // 3. Seed Batch
        let batch = await Batch.findOne({ school: school._id, code: 'ROB10A' });
        if (!batch) {
            batch = await Batch.create({
                name: 'Grade 10 AI & Robotics Section A',
                code: 'ROB10A',
                school: school._id,
                instructor: coordinator._id,
                subject: 'Robotics & STEM Lab',
                scheduleDays: ['Mon', 'Wed', 'Fri'],
                scheduleTime: '10:00 AM - 11:30 AM',
                roomVenue: 'Robotics Lab 101',
                status: 'active',
                capacity: 40,
                academicYear: '2025-2026'
            });
            console.log('Created Offline Batch:', batch.name);
        } else {
            console.log('Offline Batch already exists:', batch.name);
        }

        // 4. Seed Approved Student Test Account
        const studentEmail = process.env.TEST_STUDENT_EMAIL || 'student.test@floydschool.in';
        const studentPassword = process.env.TEST_STUDENT_PASSWORD || 'StudTest@2026!';

        let student = await User.findOne({ email: studentEmail });
        if (!student) {
            student = await User.create({
                name: 'Vikram Singh',
                email: studentEmail,
                password: studentPassword,
                role: 'school_student',
                grade: 'Grade 10',
                section: 'A',
                fatherName: 'Rajesh Singh',
                studentMobile: '+91 98765 43210',
                fatherMobile: '+91 98765 00001',
                mobileNumber: '+91 98765 43210',
                school: school._id,
                batch: batch._id,
                offlineRollNo: 'STXAV-ROB10A-001',
                approvalStatus: 'approved',
                approvedAt: new Date(),
                approvedBy: coordinator._id
            });
            console.log('Created Approved Student Test Account:', student.email, `(Roll: ${student.offlineRollNo})`);
        } else {
            student.role = 'school_student';
            student.school = school._id;
            student.batch = batch._id;
            student.approvalStatus = 'approved';
            student.offlineRollNo = student.offlineRollNo || 'STXAV-ROB10A-001';
            await student.save();
            console.log('Approved Student Test Account verified:', student.email);
        }

        // Ensure student is in batch.students
        if (!batch.students.includes(student._id)) {
            batch.students.push(student._id);
            await batch.save();
        }

        // 5. Seed Pending Student Test Account (to test registration approval workflow)
        const pendingEmail = 'pending.student@floydschool.in';
        let pendingStudent = await User.findOne({ email: pendingEmail });
        if (!pendingStudent) {
            pendingStudent = await User.create({
                name: 'Aanya Sharma',
                email: pendingEmail,
                password: 'PendTest@2026!',
                role: 'school_student',
                grade: 'Grade 10',
                section: 'B',
                fatherName: 'Deepak Sharma',
                studentMobile: '+91 98765 88888',
                fatherMobile: '+91 98765 99999',
                mobileNumber: '+91 98765 88888',
                school: school._id,
                batch: null,
                approvalStatus: 'pending'
            });
            console.log('Created Pending Student Test Account:', pendingStudent.email);
        }

        // 6. Seed Sample Attendance Records
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendanceLog = await Attendance.findOne({ batch: batch._id, date: today });
        if (!attendanceLog) {
            attendanceLog = await Attendance.create({
                school: school._id,
                batch: batch._id,
                date: today,
                topicCovered: 'Ultrasonic Sensor & MicroPython Distance Measurement',
                markedBy: coordinator._id,
                records: [
                    {
                        student: student._id,
                        status: 'present',
                        remarks: 'Clean circuit connection on breadboard'
                    }
                ]
            });
            console.log('Created Sample Attendance Log for Batch:', batch.name);
        }

        // 7. Seed Sample Assignment
        let assignment = await Assignment.findOne({ batch: batch._id, title: 'Ultrasonic Radar Project' });
        if (!assignment) {
            assignment = await Assignment.create({
                title: 'Ultrasonic Radar Project',
                description: 'Interface HC-SR04 ultrasonic distance sensor with ESP32 microcontroller. Log distance in cm to serial monitor.',
                school: school._id,
                batch: batch._id,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                maxMarks: 100,
                maxPoints: 100,
                status: 'published',
                createdBy: coordinator._id
            });
            console.log('Created Sample Assignment:', assignment.title);
        }

        // 8. Seed Sample Quiz
        let quiz = await Quiz.findOne({ batch: batch._id, title: 'Microcontroller & Robotics Quiz 1' });
        if (!quiz) {
            quiz = await Quiz.create({
                title: 'Microcontroller & Robotics Quiz 1',
                description: 'Test your understanding of digital GPIO, ultrasonic sound waves, and microcontroller pins.',
                school: school._id,
                batch: batch._id,
                totalMarks: 20,
                timeLimitMinutes: 15,
                status: 'published',
                createdBy: coordinator._id,
                questions: [
                    {
                        questionText: 'What type of sound wave is utilized by the HC-SR04 sensor to calculate distance?',
                        options: ['Infrared light wave', 'Ultrasonic acoustic wave', 'Radio frequency wave', 'Microwave'],
                        correctOption: 1
                    },
                    {
                        questionText: 'Which pin on the ultrasonic sensor triggers the high-frequency sound pulse?',
                        options: ['Echo Pin', 'Trigger Pin', 'VCC Pin', 'GND Pin'],
                        correctOption: 1
                    },
                    {
                        questionText: 'In electronics, what is the standard operating voltage for most digital sensors?',
                        options: ['120V AC', '5V or 3.3V DC', '24V DC', '0.5V AC'],
                        correctOption: 1
                    },
                    {
                        questionText: 'What does GPIO stand for in microcontroller systems?',
                        options: ['General Purpose Input Output', 'Global Process Integrated Output', 'Graphic Processing Internal Operation', 'Ground Pin In Orbit'],
                        correctOption: 0
                    }
                ]
            });
            console.log('Created Sample Quiz:', quiz.title);
        }

        console.log('\n========================================');
        console.log('OFFLINE PORTAL SEEDING COMPLETE');
        console.log('========================================');
        console.log('Partner School: St. Xavier\'s STEM Academy (Code: STXAV)');
        console.log('Batch: Grade 10 AI & Robotics Section A (Code: ROB10A)');
        console.log('\nTest Credentials:');
        console.log('1. Student (Approved):');
        console.log(`   Email: ${studentEmail}`);
        console.log(`   Password: ${studentPassword}`);
        console.log(`   Roll No: ${student.offlineRollNo}`);
        console.log('\n2. Coordinator:');
        console.log(`   Email: ${coordinatorEmail}`);
        console.log(`   Password: ${coordinatorPassword}`);
        console.log('\n3. Student (Pending Allotment):');
        console.log(`   Email: ${pendingEmail}`);
        console.log(`   Password: PendTest@2026!`);
        console.log('========================================\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedOfflineData();
