const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Mock req/res
const req = { user: { role: 'admin' } };
const res = {
    status: function (s) { this.statusCode = s; return this; },
    json: function (j) { console.log('JSON RESPONSE:', JSON.stringify(j, null, 2)); }
};

async function test() {
    try {
        dotenv.config({ path: './server/.env' });

        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const adminController = require('./server/controllers/adminController');

        console.log('Running getPlatformStats...');
        await adminController.getPlatformStats(req, res);

        process.exit(0);
    } catch (err) {
        console.error('DIAGNOSTIC CRASH:', err);
        process.exit(1);
    }
}

test();
