require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Batch = require('../models/Batch');
const School = require('../models/School');
const crypto = require('crypto');

async function seedMentorTest() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas.');

        const email = 'mentor.test@floydschool.in';
        let mentor = await User.findOne({ email });

        if (!mentor) {
            const sessionToken = crypto.randomBytes(16).toString('hex');
            mentor = await User.create({
                name: 'Vikram Malhotra',
                email,
                password: 'MentorTest@2026!',
                role: 'mentor',
                mobileNumber: '9876543210',
                studentMobile: '9876543210',
                approvalStatus: 'approved',
                sessionToken
            });
            console.log('Created dedicated test mentor:', mentor.email);
        } else {
            mentor.role = 'mentor';
            mentor.password = 'MentorTest@2026!';
            await mentor.save();
            console.log('Updated dedicated test mentor:', mentor.email);
        }

        // Find test school STXAV and batch ROB10A
        const school = await School.findOne({ code: 'STXAV' });
        let batch = await Batch.findOne({ code: 'ROB10A' });

        if (batch) {
            batch.instructor = mentor._id;
            if (school && !batch.school) batch.school = school._id;
            await batch.save();
            console.log(`Assigned mentor ${mentor.email} to batch ${batch.name} (${batch.code})`);
        }

        // Also check if there's a second batch or create one for Delhi Public STEM School (DPSS)
        const school2 = await School.findOne({ code: 'DPSS' });
        if (school2) {
            let batch2 = await Batch.findOne({ code: 'AI10B' });
            if (!batch2) {
                batch2 = await Batch.create({
                    name: 'Grade 10 AI & Embedded Systems Section B',
                    code: 'AI10B',
                    school: school2._id,
                    instructor: mentor._id,
                    subject: 'Applied Artificial Intelligence',
                    scheduleDays: ['Tuesday', 'Thursday'],
                    scheduleTime: '02:00 PM - 03:30 PM',
                    roomVenue: 'AI Computing Lab 2',
                    status: 'active',
                    academicYear: '2025-2026'
                });
                console.log('Created second batch for DPSS assigned to test mentor:', batch2.name);
            } else {
                batch2.instructor = mentor._id;
                await batch2.save();
            }
        }

        console.log('Seeding test mentor complete!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedMentorTest();
