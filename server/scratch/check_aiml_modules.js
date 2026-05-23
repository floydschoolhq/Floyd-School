const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Course = require('../models/Course');

async function checkModules() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');

        const course = await Course.findById('69ff38141cad938780ccdbeb');
        if (!course) {
            console.log('Course AI & ML not found in MongoDB!');
        } else {
            console.log(`Course Found: "${course.title}"`);
            console.log(`Modules Count: ${course.modules?.length || 0}`);
            if (course.modules && course.modules.length > 0) {
                console.log('Modules:');
                course.modules.forEach((m, idx) => {
                    console.log(`  Week ${idx + 1}: ${m.title}`);
                });
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Failed to query:', error);
        process.exit(1);
    }
}

checkModules();
