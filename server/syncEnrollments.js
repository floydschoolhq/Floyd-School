const mongoose = require('mongoose');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const syncEnrollments = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI not found in environment');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Nexus Database');

        const enrollments = await Enrollment.find({ paymentStatus: 'completed' });
        console.log(`Found ${enrollments.length} completed enrollments`);

        for (const enrollment of enrollments) {
            if (enrollment.student) {
                await Course.findByIdAndUpdate(enrollment.course, {
                    $addToSet: { enrolledStudents: enrollment.student }
                });
                console.log(`Synced student ${enrollment.student} to course ${enrollment.course}`);
            }
        }

        console.log('Synchronization Complete');
        process.exit(0);
    } catch (err) {
        console.error('Sync Error:', err);
        process.exit(1);
    }
};

syncEnrollments();
