require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const SchoolPartnershipLead = require('./server/models/SchoolPartnershipLead');

const checkDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGO_URI or MONGODB_URI not found in env');
      return;
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');
    
    const count = await SchoolPartnershipLead.countDocuments();
    console.log('Total leads:', count);
    
    const latest = await SchoolPartnershipLead.find().sort({ createdAt: -1 }).limit(5);
    console.log('Latest 5 leads:', JSON.stringify(latest, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkDB();
