const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const { generateStudentId, generateMentorId } = require('../utils/studentIdGenerator');

async function sync() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  const students = await User.find({
    role: { $in: ['school_student', 'student'] },
    $or: [{ studentId: { $exists: false } }, { studentId: null }, { studentId: '' }]
  });

  console.log(`Found ${students.length} students without permanent studentId`);
  for (const s of students) {
    s.studentId = await generateStudentId();
    await s.save();
    console.log(`Assigned student ${s.name} (${s.email}) -> ${s.studentId}`);
  }

  const mentors = await User.find({
    role: 'mentor',
    $or: [{ mentorId: { $exists: false } }, { mentorId: null }, { mentorId: '' }]
  });

  console.log(`Found ${mentors.length} mentors without permanent mentorId`);
  for (const m of mentors) {
    m.mentorId = await generateMentorId();
    await m.save();
    console.log(`Assigned mentor ${m.name} (${m.email}) -> ${m.mentorId}`);
  }

  await mongoose.disconnect();
  console.log('Sync complete.');
}

sync().catch(console.error);
