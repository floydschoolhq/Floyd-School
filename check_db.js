
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const LiveClass = require('./server/models/LiveClass');

async function checkLiveClasses() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thinkskool');
        console.log('Connected to MongoDB');

        const activeClasses = await LiveClass.find({ status: 'active' });
        console.log('Active Classes found:', activeClasses.length);
        activeClasses.forEach(c => {
            console.log(`- ${c.title} (${c.platform}) Mentor: ${c.mentorName}`);
        });

        const allCount = await LiveClass.countDocuments();
        console.log('Total live classes in DB:', allCount);

        process.exit(0);
    } catch (error) {
        console.error('Diagnostic failed:', error);
        process.exit(1);
    }
}

checkLiveClasses();
