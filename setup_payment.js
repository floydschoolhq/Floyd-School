const fs = require('fs');
const path = require('path');

// Razorpay credentials provided by user
const razorpayCredentials = `
# Razorpay Payment Gateway Credentials
RAZORPAY_KEY_ID=rzp_live_SZ5dQW5i5KF73f
RAZORPAY_KEY_SECRET=E54B28doPGgP1a1geSg5NkPk

# Database
MONGO_URI=mongodb://localhost:27017/thinkskool

# JWT
JWT_SECRET=your_jwt_secret_here_change_this_in_production

# Server
PORT=5000
`;

console.log('🚀 Setting up Razorpay Payment Gateway...');
console.log('');

// Update .env file
const envPath = path.join(__dirname, 'server', '.env');
try {
    fs.writeFileSync(envPath, razorpayCredentials.trim() + '\n');
    console.log('✅ Updated server/.env with Razorpay credentials');
} catch (error) {
    console.log('❌ Could not update .env file automatically');
    console.log('📝 Please manually add these credentials to server/.env:');
    console.log(razorpayCredentials);
}

console.log('');
console.log('🎯 Next Steps:');
console.log('1. Restart the server: cd server && npm start');
console.log('2. Test the payment gateway on course pages');
console.log('3. Check server logs for "Environment loaded. RAZORPAY_KEY_ID: rzp_live_SZ5dQW5i5KF73f"');
console.log('');
console.log('💳 Razorpay Payment Gateway Ready!');
