const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const User = require('./models/User');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '.env') });

const users = [
    {
        name: "Abhay Admin",
        email: "admin@floydschool.in",
        password: "abhay",
        role: "admin"
    },
    {
        name: "Shashwat Vashishth",
        email: "mentor@floydschool.in",
        password: "abhay",
        role: "mentor"
    },
    {
        name: "Floyd School Admin",
        email: "admin@floydschool.com",
        password: "shan",
        role: "admin"
    },
    {
        name: "Abhay Associate",
        email: "associate@floydschool.com",
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
                // Reset the mentor@floydschool.in account if it already exists, to ensure the password is correct.
                if (userData.email === 'mentor@floydschool.in') {
                    userExists.name = userData.name;
                    userExists.role = userData.role;
                    userExists.provider = userData.provider || 'local';
                    userExists.password = userData.password;
                    await userExists.save();
                    console.log(`User ${userData.email} exists; password reset to seed value.`);
                } else {
                    console.log(`User ${userData.email} already exists, skipping...`);
                }
                continue;
            }

            await User.create({ ...userData, provider: userData.provider || 'local' });
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
