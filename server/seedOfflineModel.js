const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const PartnerSchool = require('./models/PartnerSchool');
const OfflineBatch = require('./models/OfflineBatch');
const Attendance = require('./models/Attendance');
const Quiz = require('./models/Quiz');
const QuizSubmission = require('./models/QuizSubmission');
const OfflineAssignment = require('./models/OfflineAssignment');

const seedOfflineData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkskool';
        console.log('Connecting to MongoDB for seeding offline model data:', mongoUri);
        await mongoose.connect(mongoUri);

        console.log('Clearing old offline demo records...');
        await PartnerSchool.deleteMany({ code: 'STX-OFFLINE' });
        await OfflineBatch.deleteMany({ code: 'STX-AI-01' });
        await User.deleteMany({ email: { $in: ['schoolpartner@stxaviers.edu', 'arav.sharma@stxaviers.edu', 'ananya.verma@stxaviers.edu', 'rohan.gupta@stxaviers.edu'] } });

        // 1. Create Partner School
        const school = await PartnerSchool.create({
            name: 'St. Xavier Science & STEM Academy',
            code: 'STX-OFFLINE',
            principalName: 'Dr. V. K. Sharma',
            contactEmail: 'schoolpartner@stxaviers.edu',
            contactPhone: '+91 98765 43210',
            city: 'New Delhi',
            address: 'Block B, Vasant Vihar, New Delhi',
            partnershipStatus: 'Active',
            activeBatchesCount: 1,
            studentQuota: 250,
            curriculumPlan: 'AI, Microcontrollers & STEM Robotics'
        });
        console.log('Created Partner School:', school.name);

        // 2. Create Partner School User
        const schoolPartnerUser = await User.create({
            name: 'St. Xavier Admin Coordinator',
            email: 'schoolpartner@stxaviers.edu',
            password: 'password123',
            role: 'school_partner',
            schoolId: school._id,
            provider: 'local'
        });
        console.log('Created Partner School User:', schoolPartnerUser.email);

        // 3. Create Offline Batch
        const batch = await OfflineBatch.create({
            name: 'Grade 10 AI & Robotics Batch A',
            code: 'STX-AI-01',
            schoolId: school._id,
            subject: 'AI & Microcontroller Hardware',
            scheduleDays: ['Mon', 'Wed', 'Fri'],
            scheduleTime: '10:00 AM - 11:30 AM',
            roomVenue: 'Offline Innovation Lab 102',
            status: 'Active',
            enrolledCount: 3
        });
        console.log('Created Offline Batch:', batch.name);

        // 4. Create School Students
        const student1 = await User.create({
            name: 'Arav Sharma',
            email: 'arav.sharma@stxaviers.edu',
            password: 'password123',
            role: 'school_student',
            schoolId: school._id,
            batchId: batch._id,
            offlineRollNo: 'STX-101',
            grade: 'Grade 10-A',
            provider: 'local'
        });

        const student2 = await User.create({
            name: 'Ananya Verma',
            email: 'ananya.verma@stxaviers.edu',
            password: 'password123',
            role: 'school_student',
            schoolId: school._id,
            batchId: batch._id,
            offlineRollNo: 'STX-102',
            grade: 'Grade 10-A',
            provider: 'local'
        });

        const student3 = await User.create({
            name: 'Rohan Gupta',
            email: 'rohan.gupta@stxaviers.edu',
            password: 'password123',
            role: 'school_student',
            schoolId: school._id,
            batchId: batch._id,
            offlineRollNo: 'STX-103',
            grade: 'Grade 10-A',
            provider: 'local'
        });
        console.log('Created 3 Offline School Students');

        // 5. Create Attendance Records
        await Attendance.create({
            batchId: batch._id,
            schoolId: school._id,
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            topicCovered: 'Introduction to Ultrasonic Sensors & Arduino Circuitry',
            records: [
                { studentId: student1._id, status: 'present', remarks: 'Good engagement' },
                { studentId: student2._id, status: 'present', remarks: 'Completed circuit wiring' },
                { studentId: student3._id, status: 'late', remarks: 'Arrived 10 mins late' }
            ]
        });

        await Attendance.create({
            batchId: batch._id,
            schoolId: school._id,
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            topicCovered: 'Python Fundamentals & MicroPython Control',
            records: [
                { studentId: student1._id, status: 'present', remarks: 'Excellent code syntax' },
                { studentId: student2._id, status: 'present', remarks: 'Built motor control loop' },
                { studentId: student3._id, status: 'present', remarks: 'Completed exercise' }
            ]
        });
        console.log('Created Sample Attendance Records');

        // 6. Create Quiz
        const quiz = await Quiz.create({
            title: 'Robotics Sensors & Microcontroller Quiz 1',
            description: 'Evaluate basic knowledge of pins, sensors, and voltage regulators.',
            schoolId: school._id,
            batchId: batch._id,
            subject: 'STEM Robotics',
            timeLimitMinutes: 15,
            totalMarks: 30,
            isPublished: true,
            questions: [
                {
                    questionText: 'Which sensor is primarily used to measure distance using sound waves?',
                    options: ['IR Obstacle Sensor', 'HC-SR04 Ultrasonic Sensor', 'DHT11 Temperature Sensor', 'LDR Light Sensor'],
                    correctAnswerIndex: 1,
                    points: 10
                },
                {
                    questionText: 'What voltage level is standard for powering Arduino UNO digital pins?',
                    options: ['3.3V', '5V', '12V', '24V'],
                    correctAnswerIndex: 1,
                    points: 10
                },
                {
                    questionText: 'Which keyword in Python is used to define a function?',
                    options: ['function', 'func', 'def', 'create'],
                    correctAnswerIndex: 2,
                    points: 10
                }
            ]
        });
        console.log('Created Sample Quiz:', quiz.title);

        // 7. Create Offline Assignment
        const assignment = await OfflineAssignment.create({
            title: 'Build a Smart Distance Alert Prototype',
            description: 'Connect an ultrasonic sensor to an LED buzzer circuit. Write Python/C code to sound buzzer when object distance < 10 cm.',
            schoolId: school._id,
            batchId: batch._id,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            maxMarks: 50,
            submissions: [
                {
                    studentId: student1._id,
                    submissionText: 'Completed breadboard circuit and uploaded Python code to Github repo.',
                    fileUrl: 'https://github.com/arav/distance-alert-prototype',
                    submittedAt: new Date(),
                    status: 'Submitted'
                }
            ]
        });
        console.log('Created Sample Offline Assignment:', assignment.title);

        console.log('\n==========================================');
        console.log('SUCCESS: Offline Model Data Seeded Successfully!');
        console.log('Partner School Login: schoolpartner@stxaviers.edu / password123');
        console.log('School Student Login: arav.sharma@stxaviers.edu / password123');
        console.log('==========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedOfflineData();
