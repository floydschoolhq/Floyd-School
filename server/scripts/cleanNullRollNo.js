const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

async function fix() {
    await mongoose.connect(process.env.MONGO_URI);
    const res = await User.updateMany({ offlineRollNo: null }, { $unset: { offlineRollNo: 1 } });
    console.log('Unset offlineRollNo: null count:', res.modifiedCount);
    await mongoose.disconnect();
}
fix();
