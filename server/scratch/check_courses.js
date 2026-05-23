const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');

async function checkCourses() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('CONNECTED TO DATABASE.');

        const courses = await Course.find({}, 'title category _id');
        console.log('Courses found:', courses.length);
        courses.forEach(c => {
            console.log(`- Title: "${c.title}" | Category: "${c.category}" | ID: ${c._id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Check failed:', error);
        process.exit(1);
    }
}

checkCourses();
