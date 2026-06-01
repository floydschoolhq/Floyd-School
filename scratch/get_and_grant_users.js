const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
const mongoose = require('mongoose');
const User = require('../server/models/User');

const run = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thinkskool';
    console.log('Connecting to Mongo at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    const users = await User.find();
    console.log(`Found ${users.length} users in DB:`);
    users.forEach(u => {
      console.log(`- ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, permissions:`, u.permissions);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error running script:', err);
    process.exit(1);
  }
};

run();
