const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Mock req/res
const req = { user: { role: 'admin' }, app: { get: () => ({ emit: () => { } }) } };
const res = {
    status: function (s) { this.statusCode = s; return this; },
    json: function (j) { console.log('JSON RESPONSE:', JSON.stringify(j, null, 2)); }
};

async function test() {
    try {
        dotenv.config({ path: '.env' });

        // Connect to DB
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI missing in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const adminController = require('./controllers/adminController');

        console.log('Running getPlatformStats...');
        await adminController.getPlatformStats(req, res);

        console.log('Test complete');
        process.exit(0);
    } catch (err) {
        console.error('DIAGNOSTIC CRASH:', err);
        process.exit(1);
    }
}

test();
