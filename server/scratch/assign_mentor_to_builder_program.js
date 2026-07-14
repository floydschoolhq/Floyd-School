const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');
const User = require('../models/User');

async function reassignCourse() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('CONNECTED TO DATABASE.');

        // Shashwat Vashishth's ID
        const targetMentorId = '69929b7a63a7a52ef6ad4396';
        
        // Find course "Floyd School Summer Builder Program"
        const courseId = '69ff38141cad938780ccdbef';
        
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { instructor: targetMentorId },
            { new: true }
        );

        if (updatedCourse) {
            console.log(`SUCCESSFULLY REASSIGNED!`);
            console.log(`Course: "${updatedCourse.title}"`);
            console.log(`New Instructor ID: ${updatedCourse.instructor}`);
        } else {
            console.error('Course not found!');
        }

        process.exit(0);
    } catch (error) {
        console.error('Reassignment failed:', error);
        process.exit(1);
    }
}

reassignCourse();
