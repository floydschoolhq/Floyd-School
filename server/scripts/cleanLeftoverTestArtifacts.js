const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function purgeEarlyTestArtifacts() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Purging aborted test records from previous failed runs...');

  const db = mongoose.connection.db;

  // Clean ephemeral users created in previous runs
  const usersRes = await db.collection('users').deleteMany({
    $or: [
      { email: { $regex: /^wf1\.student\.\d+@floydschool\.in$/ } },
      { email: { $regex: /^mentor\.\d+@floydschool\.in$/ } },
      { email: { $regex: /^coord\.sch\d+@floydschool\.in$/ } }
    ]
  });
  console.log('✔ Purged leftover test users:', usersRes.deletedCount);

  // Clean ephemeral schools from previous runs
  const schoolsRes = await db.collection('schools').deleteMany({
    name: { $regex: /^Verification Partner School SCH/ }
  });
  console.log('✔ Purged leftover test schools:', schoolsRes.deletedCount);

  // Clean ephemeral batches from previous runs
  const batchesRes = await db.collection('batches').deleteMany({
    code: { $regex: /^BAT\d{4}$/ }
  });
  console.log('✔ Purged leftover test batches:', batchesRes.deletedCount);

  await mongoose.disconnect();
  console.log('Database cleanup finished.');
}

purgeEarlyTestArtifacts().catch(console.error);
