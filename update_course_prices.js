const mongoose = require('mongoose');
require('dotenv').config();

// Update course prices in database
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/thinkskool')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const Course = require('./server/models/Course');
    
    // Update all course prices to your desired amount
    const newPrice = 10; // Change this to your desired price
    
    const result = await Course.updateMany(
      {},
      { $set: { price: newPrice } }
    );
    
    console.log(`Updated ${result.modifiedCount} courses to price ₹${newPrice}`);
    
    // Verify the update
    const courses = await Course.find({});
    courses.forEach(course => {
      console.log(`Course: ${course.title} - Price: ₹${course.price}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
