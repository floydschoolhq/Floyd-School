const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const Course = mongoose.model('Course', new mongoose.Schema({ 
      title: String, 
      status: String, 
      isActive: Boolean,
      modules: [{ title: String, videoUrl: String }]
    }, { collection: 'courses' }));
    
    const allCourses = await Course.find();
    const fs = require('fs');
    const results = {
      counts,
      courseData: allCourses.map(c => ({
        title: c.title,
        moduleCount: c.modules?.length || 0,
        hasVideos: c.modules?.some(m => m.videoUrl) || false
      }))
    };
    fs.writeFileSync('db_results.txt', JSON.stringify(results, null, 2));
    console.log('Results updated');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
