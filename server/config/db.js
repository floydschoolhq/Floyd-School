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
        console.error(`CRITICAL: MongoDB Connection Error: ${error.message}`);
        if (error.message.includes('alert number 80') || error.message.includes('ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR') || error.message.includes('MongooseServerSelectionError')) {
            console.error('--------------------------------------------------------------------------------');
            console.error('[MONGODB ATLAS IP NOT WHITELISTED]');
            console.error('MongoDB Atlas rejected the connection with TLS SSL alert 80.');
            console.error('Your machine\'s public IP is not whitelisted in MongoDB Atlas Network Access.');
            console.error('To fix: Open https://cloud.mongodb.com -> Security -> Network Access -> Add IP Address -> "Allow Access from Anywhere" (0.0.0.0/0).');
            console.error('--------------------------------------------------------------------------------');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('CRITICAL: MongoDB SRV record could not be resolved. Please check your MONGO_URI and network connection.');
        }
        console.error('Server will continue to run but database dependent routes will fail fast (503).');
    }
};

module.exports = connectDB;
