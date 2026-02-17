const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictPopulate', false);
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        if (error.message.includes('ENOTFOUND')) {
            console.error('CRITICAL: MongoDB SRV record could not be resolved. Please check your MONGO_URI and network connection.');
        }
        process.exit(1);
    }
};

module.exports = connectDB;
