# Razorpay Payment Gateway Integration Guide

## Overview
This guide will walk you through setting up Razorpay payment integration for course enrollment in the THINKSKOOL platform.

## What's Been Integrated

### Backend Components
1. **Payment Controller** (`server/controllers/paymentController.js`)
   - `createOrder` - Creates Razorpay orders
   - `verifyPayment` - Verifies payment signatures
   - `getPaymentStatus` - Retrieves payment status
   - `getEnrollment` - Checks if user is enrolled

2. **Routes** (`server/routes/paymentRoutes.js`)
   - `POST /api/payments/create-order` - Initialize payment
   - `POST /api/payments/verify-payment` - Complete payment
   - `GET /api/payments/status/:enrollmentId` - Check status
   - `GET /api/payments/enrollment/:courseId` - Check enrollment

3. **Models**
   - **Enrollment Model** - Tracks course enrollments with payment details
   - **Course Model** - Updated with `price` and `currency` fields

### Frontend Components
1. **PaymentModal** (`Client/src/components/PaymentModal.jsx`)
   - Multi-step form (Details → Payment → Success/Error)
   - Razorpay integration
   - Payment verification

2. **CourseDetails Page** - Updated to use PaymentModal instead of RegistrationForm

## Setup Instructions

### Step 1: Get Razorpay Credentials

1. Sign up on [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Go to **Settings** → **API Keys**
3. Copy your:
   - **Key ID** (starts with `rzp_live_` or `rzp_test_`)
   - **Key Secret** (keep this secure!)

### Step 2: Configure Environment Variables

#### Server (.env)
Create/Update `server/.env` file:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/thinkskool
MONGODB_URI=mongodb://localhost:27017/thinkskool

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Razorpay Configuration (USE YOUR LIVE KEYS)
RAZORPAY_KEY_ID=rzp_live_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here

# Other configs
NODE_ENV=production
PORT=5000
```

**IMPORTANT**: 
- Use your live API keys only in production
- For testing, use test keys (rzp_test_*)
- Never commit .env file to git (already in .gitignore)

### Step 3: Start the Server

```bash
cd server
npm install  # Install dependencies if not done
npm run dev  # Start development server
```

The server will now accept payment requests with your Razorpay credentials.

### Step 4: Update Course Prices

The courses now have sample prices. Update them as needed in:
- `Client/src/constants/siteData.js` - Frontend display prices
- Database - For backend stored prices

Current sample prices:
- AI & ML: ₹29,999
- Web Development: ₹24,999
- IoT & Robotics: ₹32,999
- Cyber Security: ₹34,999

### Step 5: Test the Integration

1. **Start the Client**
   ```bash
   cd Client
   npm run dev
   ```

2. **Visit a Course Page**
   - Navigate to a course detail page
   - Click "Apply Now"

3. **Fill in Details**
   - Enter your name, email, phone
   - Review the price

4. **Process Payment**
   - Click "Proceed to Payment"
   - Razorpay modal will open
   - For testing, use:
     - **Card**: 4111 1111 1111 1111
     - **Expiry**: Any future date (e.g., 12/25)
     - **CVV**: Any 3 digits
   - OTP: 123456

5. **Verify Success**
   - You should see a success message
   - Check database for enrollment record

## Directory Structure

```
THINKSKOOL-/
├── server/
│   ├── controllers/
│   │   └── paymentController.js (NEW)
│   ├── models/
│   │   ├── Course.js (UPDATED)
│   │   └── Enrollment.js (NEW)
│   ├── routes/
│   │   └── paymentRoutes.js (NEW)
│   ├── index.js (UPDATED)
│   ├── package.json (razorpay added)
│   └── .env.example (NEW)
├── Client/
│   └── src/
│       ├── components/
│       │   └── PaymentModal.jsx (NEW)
│       ├── pages/
│       │   └── CourseDetails.jsx (UPDATED)
│       └── constants/
│           └── siteData.js (UPDATED with prices)
```

## API Endpoints

### POST /api/payments/create-order
**Purpose**: Create a Razorpay order

**Request**:
```json
{
  "courseId": "1",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

**Response**:
```json
{
  "success": true,
  "order": {
    "id": "order_IluGWxBm9U8KXt",
    "amount": 2999900,
    "currency": "INR"
  },
  "enrollmentId": "enrollment_id_here",
  "razorpayKeyId": "rzp_live_xxx"
}
```

### POST /api/payments/verify-payment
**Purpose**: Verify payment completion

**Request**:
```json
{
  "razorpayOrderId": "order_IluGWxBm9U8KXt",
  "razorpayPaymentId": "pay_IluGWxBm9U8KXt",
  "razorpaySignature": "signature_here",
  "enrollmentId": "enrollment_id_here"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "enrollment": {
    "_id": "enrollment_id",
    "courseName": "Foundation of AI...",
    "paymentStatus": "completed",
    "enrollmentDate": "2026-04-03..."
  }
}
```

## Security Notes

1. **Never expose API secret** - Keep RAZORPAY_KEY_SECRET in .env only
2. **Verify signatures** - Always verify payment signatures on backend
3. **CORS headers** - Already configured in server/index.js
4. **Token authentication** - Payment endpoints require JWT token
5. **Unique enrollments** - Only one active enrollment per student per course

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- This is unrelated to Razorpay
- Configure Firebase credentials in `Client/.env`

### Error: "Razorpay library failed to load"
- Ensure `https://checkout.razorpay.com/v1/checkout.js` is accessible
- Check browser console for network errors

### Error: "Invalid payment signature"
- Verify your RAZORPAY_KEY_SECRET is correct
- Check that test/live keys match (don't mix them)

### Payment order not creating
- Verify user is authenticated (JWT token in headers)
- Check courseId is valid
- Ensure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set

### Database connection errors
- Ensure MongoDB is running
- Check MONGO_URI in .env

## Testing Checklist

- [ ] Server starts with Razorpay credentials
- [ ] Course prices display correctly
- [ ] "Apply Now" button opens PaymentModal
- [ ] Form validation works
- [ ] Payment order creation succeeds
- [ ] Razorpay modal opens with correct amount
- [ ] Test payment completes
- [ ] Enrollment is created in database
- [ ] Success page displays
- [ ] User can access enrolled course

## Production Deployment

1. **Get Live Keys**
   - Switch to live mode in Razorpay dashboard
   - Copy live Key ID and Secret

2. **Update .env on server**
   ```env
   RAZORPAY_KEY_ID=rzp_live_your_live_key
   RAZORPAY_KEY_SECRET=your_live_secret
   NODE_ENV=production
   ```

3. **Deploy**
   - Push changes to production
   - Restart server with new .env

4. **Verify**
   - Test a real payment
   - Check Razorpay dashboard for transactions

## Support

For Razorpay issues: [Razorpay Support](https://razorpay.com/support)
For integration issues: Check server logs and browser console

---

**Last Updated**: April 3, 2026
**Integration Status**: ✅ Complete
