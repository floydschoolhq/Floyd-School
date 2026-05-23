const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

async function checkUsers() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully!');

        const users = await User.find({});
        console.log(`Total users in DB: ${users.length}`);
        users.forEach((u, i) => {
            console.log(`[${i+1}] Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, Provider: ${u.provider}, permissions:`, u.permissions);
        });

    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();
