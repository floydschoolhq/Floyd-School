const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function auditInventory() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('========================================================================');
  console.log(`DATABASE AUDIT: ${mongoose.connection.name} @ ${mongoose.connection.host}`);
  console.log('========================================================================\n');

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  collections.sort((a, b) => a.name.localeCompare(b.name));

  let totalDocs = 0;
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    totalDocs += count;
    console.log(`  • ${col.name.padEnd(25)}: ${String(count).padStart(5, ' ')} documents`);
  }

  console.log(`\nTotal Collections: ${collections.length}`);
  console.log(`Total Documents  : ${totalDocs}`);

  // Check for any orphaned or test records
  const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
  const testUsers = await User.find({ email: { $regex: /wf1|test\d+/i } }).select('email name role');
  console.log(`\nRemaining Ephemeral Test Users Count: ${testUsers.length}`);
  if (testUsers.length > 0) {
    console.log('Found:', testUsers.map(u => `${u.email} (${u.role})`));
  } else {
    console.log('✔ Clean: No ephemeral workflow test users remaining in database.');
  }

  await mongoose.disconnect();
}

auditInventory().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
