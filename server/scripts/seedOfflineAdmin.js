const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

async function seedOfflineAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');

        const adminEmail = 'offline.admin@floydschool.in';
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            console.log(`Creating test Super Admin: ${adminEmail}`);
            admin = await User.create({
                name: 'Floyd Super Admin',
                email: adminEmail,
                password: 'AdminTest@2026!',
                role: 'admin',
                isActive: true,
                isTemporaryPassword: false,
                permissions: {
                    canAccessCourses: true,
                    canAccessLabs: true,
                    canAccessCommunity: true
                }
            });
            console.log('Super Admin created successfully:', admin._id);
        } else {
            console.log(`Super Admin already exists: ${adminEmail}`);
            admin.password = 'AdminTest@2026!';
            admin.role = 'admin';
            admin.isActive = true;
            await admin.save();
            console.log('Super Admin password & role verified.');
        }

        await mongoose.disconnect();
        console.log('Seeding completed.');
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seedOfflineAdmin();
