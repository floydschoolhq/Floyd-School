const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const User = require('../models/User');

async function checkCourseInstructors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('CONNECTED TO DATABASE.');

        const courses = await Course.find({}).populate('instructor');
        console.log('\n--- Courses & Instructors ---');
        courses.forEach(c => {
            console.log(`Course Title: "${c.title}"`);
            console.log(`  ID: ${c._id}`);
            if (c.instructor) {
                console.log(`  Instructor: "${c.instructor.name}" (Email: ${c.instructor.email}, ID: ${c.instructor._id})`);
            } else {
                console.log(`  Instructor: None/null`);
            }
            console.log('------------------------------');
        });

        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
}

checkCourseInstructors();
