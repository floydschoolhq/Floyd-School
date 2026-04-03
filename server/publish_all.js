const mongoose = require('mongoose');
require('dotenv').config();

async function publishAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Manual model definition to avoid needing the full app environment
    const Course = mongoose.model('Course', new mongoose.Schema({ 
      status: String, 
      isActive: Boolean 
    }, { collection: 'courses' }));
    
    const result = await Course.updateMany(
      { status: { $ne: 'published' } },
      { $set: { status: 'published', isActive: true } }
    );
    
    console.log(`Successfully updated ${result.modifiedCount} courses to published status.`);
    
    // Also, let's ensure the student has all permissions for testing
    const User = mongoose.model('User', new mongoose.Schema({
      role: String,
      permissions: {
        canAccessCourses: Boolean,
        canAccessLabs: Boolean,
        canAccessCommunity: Boolean
      }
    }, { collection: 'users' }));
    
    const studentUpdate = await User.updateMany(
        { role: 'student' },
        { $set: { 
            'permissions.canAccessCourses': true,
            'permissions.canAccessLabs': true,
            'permissions.canAccessCommunity': true
          } 
        }
    );
    console.log(`Updated permissions for ${studentUpdate.modifiedCount} students.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

publishAll();
