const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: path.join(__dirname, '.env') });

const users = [
    {
        name: "Abhay Admin",
        email: "admin@thinkskool.com",
        password: "abhay",
        role: "admin"
    },
    {
        name: "Abhay Mentor",
        email: "mentor@thinkskool.com",
        password: "abhay",
        role: "mentor"
    },
    {
        name: "Abhay Associate",
        email: "associate@thinkskool.com",
        password: "abhay",
        role: "growth_associate"
    }
];

const seedUsers = async () => {
    try {
        await connectDB();
        console.log('MongoDB connected...');

        for (const userData of users) {
            const userExists = await User.findOne({ email: userData.email });
            if (userExists) {
                console.log(`User ${userData.email} already exists, skipping...`);
                continue;
            }
            await User.create(userData);
            console.log(`User created: ${userData.email} (Role: ${userData.role})`);
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding users:', err);
        process.exit(1);
    }
};

seedUsers();
