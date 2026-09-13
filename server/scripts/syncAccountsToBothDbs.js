const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const adminAccounts = [
  {
    name: 'Floyd Super Admin',
    email: 'offline.admin@floydschool.in',
    password: 'AdminTest@2026!',
    role: 'admin'
  },
  {
    name: 'Floyd Super Admin',
    email: 'admin@floydschool.com',
    password: 'AdminTest@2026!',
    role: 'admin'
  },
  {
    name: 'Floyd Admin',
    email: 'admin@floydschool.in',
    password: 'AdminTest@2026!',
    role: 'admin'
  }
];

const coordinatorAccounts = [
  {
    name: 'Pooja Verma',
    email: 'coordinator.test@floydschool.in',
    password: 'CoordTest@2026!',
    role: 'school_coordinator'
  }
];

const mentorAccounts = [
  {
    name: 'Vikram Malhotra',
    email: 'mentor.test@floydschool.in',
    password: 'MentorTest@2026!',
    role: 'mentor',
    mentorId: 'FLOYD-MEN-00001'
  }
];

const studentAccounts = [
  {
    name: 'Vikram Singh',
    email: 'student.test@floydschool.in',
    password: 'StudTest@2026!',
    role: 'school_student',
    studentId: 'FLOYD-STU-000001',
    offlineRollNo: 'STXAV-ROB10A-001',
    approvalStatus: 'approved'
  }
];

const allAccounts = [
  ...adminAccounts,
  ...coordinatorAccounts,
  ...mentorAccounts,
  ...studentAccounts
];

async function syncToDatabase(dbName) {
  const baseUri = process.env.MONGO_URI;
  const targetUri = baseUri.replace(/mongodb\.net\/[^?]+/, `mongodb.net/${dbName}`);

  console.log(`\n========================================================`);
  console.log(`Syncing verified portal accounts to database: [${dbName}]`);
  console.log(`========================================================`);

  const conn = await mongoose.createConnection(targetUri).asPromise();
  const User = conn.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: true },
    role: String,
    studentId: String,
    mentorId: String,
    offlineRollNo: String,
    approvalStatus: String,
    permissions: Object
  }, { timestamps: true }));

  for (const acc of allAccounts) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(acc.password, salt);

    try {
      let user = await User.findOne({ email: acc.email.toLowerCase() });
      if (user) {
        user.name = acc.name;
        user.password = hashedPassword;
        user.role = acc.role;
        if (acc.studentId) user.studentId = acc.studentId;
        if (acc.mentorId) user.mentorId = acc.mentorId;
        if (acc.offlineRollNo) user.offlineRollNo = acc.offlineRollNo;
        if (acc.approvalStatus) user.approvalStatus = acc.approvalStatus;
        await user.save();
        console.log(`✔ Updated: ${acc.email} (${acc.role})`);
      } else {
        const createPayload = {
          ...acc,
          email: acc.email.toLowerCase(),
          password: hashedPassword,
          permissions: {
            canAccessCourses: true,
            canAccessLabs: true,
            canAccessCommunity: true
          }
        };
        if (dbName === 'test' && acc.role === 'school_student') {
          delete createPayload.studentId; // avoid duplicate studentId on test db
        }
        await User.create(createPayload);
        console.log(`✔ Created: ${acc.email} (${acc.role})`);
      }
    } catch (uErr) {
      console.warn(`⚠️ Warning syncing ${acc.email} on ${dbName}:`, uErr.message);
    }
  }

  await conn.close();
  console.log(`✔ Sync complete for [${dbName}]`);
}

async function run() {
  // Sync to both floydschool AND test (which Render connects to)
  await syncToDatabase('floydschool');
  await syncToDatabase('test');
  console.log('\n🎉 ALL ACCOUNTS ARE NOW SYNCHRONIZED ACROSS BOTH ATLAS DATABASES!');
}

run().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
