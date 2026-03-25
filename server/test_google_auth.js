const mongoose = require('mongoose');
const User = require('./models/User');

// Test script to verify Google auth user storage
async function testGoogleAuthStorage() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkskool');
        console.log('Connected to MongoDB');

        // Find all Google users
        const googleUsers = await User.find({ provider: 'google' });
        console.log(`Found ${googleUsers.length} Google users:`);
        
        googleUsers.forEach(user => {
            console.log(`- ID: ${user._id}`);
            console.log(`  Name: ${user.name}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Google ID: ${user.googleId}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Mobile: ${user.mobileNumber || 'Not provided'}`);
            console.log(`  Last Login: ${user.lastLogin}`);
            console.log(`  Created: ${user.createdAt}`);
            console.log('---');
        });

        // Find all users (for comparison)
        const allUsers = await User.find({});
        console.log(`\nTotal users in database: ${allUsers.length}`);

        // Show recent users
        const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5);
        console.log('\nMost recent users:');
        recentUsers.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - Provider: ${user.provider || 'local'} - Created: ${user.createdAt}`);
        });

    } catch (error) {
        console.error('Test error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the test
testGoogleAuthStorage();
