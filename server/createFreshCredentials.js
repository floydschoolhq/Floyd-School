const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const PartnerSchool = require('./models/PartnerSchool');
const OfflineBatch = require('./models/OfflineBatch');

const createFreshCredentials = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkskool';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);

        // Delete existing if any
        await User.deleteMany({ email: { $in: ['partner@floydschool.in', 'student@floydschool.in'] } });
        await PartnerSchool.deleteMany({ code: 'FLOYD-SCH-01' });
        await OfflineBatch.deleteMany({ code: 'FLOYD-AI-01' });

        // 1. Create Partner School
        const school = await PartnerSchool.create({
            name: 'Floyd National STEM Academy',
            code: 'FLOYD-SCH-01',
            principalName: 'Dr. Rajesh Khanna',
            contactEmail: 'partner@floydschool.in',
            contactPhone: '+91 99999 88888',
            city: 'New Delhi',
            address: 'Floyd Innovation Hub, Vasant Kunj, New Delhi',
            partnershipStatus: 'Active',
            activeBatchesCount: 1,
            studentQuota: 500,
            curriculumPlan: 'Advanced AI, MicroPython & Industrial Robotics'
        });

        // 2. Create Partner School User
        const partnerUser = await User.create({
            name: 'Floyd School Partner Admin',
            email: 'partner@floydschool.in',
            password: 'Partner@123',
            role: 'school_partner',
            schoolId: school._id,
            provider: 'local'
        });

        // 3. Create Offline Batch
        const batch = await OfflineBatch.create({
            name: 'Grade 10 AI & Robotics Batch 1',
            code: 'FLOYD-AI-01',
            schoolId: school._id,
            subject: 'AI & STEM Microcontroller Hardware',
            scheduleDays: ['Mon', 'Wed', 'Fri'],
            scheduleTime: '10:00 AM - 11:30 AM',
            roomVenue: 'Offline Innovation Lab 1',
            status: 'Active',
            enrolledCount: 1
        });

        // 4. Create Offline Student User
        const studentUser = await User.create({
            name: 'Vikram Singh',
            email: 'student@floydschool.in',
            password: 'Student@123',
            role: 'school_student',
            schoolId: school._id,
            batchId: batch._id,
            offlineRollNo: 'FL-STU-101',
            grade: 'Grade 10-A',
            provider: 'local'
        });

        console.log('\n=================================================');
        console.log('NEW LOGIN CREDENTIALS CREATED SUCCESSFULLY!');
        console.log('=================================================');
        console.log('1. PARTNER SCHOOL PORTAL (http://localhost:5178)');
        console.log('   Email:    partner@floydschool.in');
        console.log('   Password: Partner@123');
        console.log('-------------------------------------------------');
        console.log('2. OFFLINE SCHOOL STUDENT PORTAL (http://localhost:5179)');
        console.log('   Email:    student@floydschool.in');
        console.log('   Password: Student@123');
        console.log('=================================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error creating fresh credentials:', error);
        process.exit(1);
    }
};

createFreshCredentials();
