# 🚀 Quick Start - Razorpay Integration

## What Was Done ✅

Your Razorpay payment gateway integration is now complete! Here's what's been set up:

### Backend (Server)
- ✅ Payment controller with order creation and verification
- ✅ Enrollment model to track payments
- ✅ Payment API routes
- ✅ Razorpay SDK installed
- ✅ Course model updated with price fields

### Frontend (Client)
- ✅ PaymentModal component for payment flow
- ✅ Course prices configured
- ✅ CourseDetails integrated with payment modal
- ✅ Multi-step form: Details → Payment → Success

## Setup in 3 Steps 🎯

### Step 1: Add Your Razorpay Keys
Edit `server/.env` and add:
```
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

### Step 2: Start the Server
```bash
cd server
npm run dev
```

### Step 3: Start the Client
```bash
cd Client
npm run dev
```

That's it! 🎉

## Payment Flow

1. User clicks "Apply Now" on course page
2. PaymentModal opens asking for details (Name, Email, Phone)
3. User proceeds to payment
4. Razorpay modal opens for payment
5. Payment is processed
6. Backend verifies signature
7. Enrollment is created
8. Success page is shown

## Test Credentials (Razorpay Test Mode)

When using test keys (rzp_test_*):
- **Card**: 4111 1111 1111 1111
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3 digits
- **OTP**: 123456

## File Locations

### New Files Created
- `server/controllers/paymentController.js` - Payment logic
- `server/models/Enrollment.js` - Enrollment tracking
- `server/routes/paymentRoutes.js` - Payment API routes
- `Client/src/components/PaymentModal.jsx` - Payment UI
- `RAZORPAY_SETUP.md` - Detailed setup guide

### Updated Files
- `server/index.js` - Added payment routes
- `server/models/Course.js` - Added price fields
- `server/package.json` - Added razorpay package
- `Client/src/pages/CourseDetails.jsx` - Replaced registration with payment
- `Client/src/constants/siteData.js` - Added prices to courses

## Course Prices (Configurable)

| Course | Price |
|--------|-------|
| AI & ML | ₹29,999 |
| Web Development | ₹24,999 |
| IoT & Robotics | ₹32,999 |
| Cyber Security | ₹34,999 |

Change prices in `Client/src/constants/siteData.js`

## Important Security Notes 🔐

1. **Never share your Secret Key** - Keep it in .env only
2. **Use Live Keys in Production** - Test keys (`rzp_test_*`) are for development
3. **Verify Signatures** - Backend automatically verifies payment signatures
4. **CORS is Configured** - Razorpay popups work securely
5. **Authentication Required** - Payment endpoints need JWT token

## Troubleshooting Quick Tips

### "Razorpay Key ID not found"
→ Check `RAZORPAY_KEY_ID` is set in `server/.env`

### "Invalid API Key"
→ Verify your Key ID is correct (starts with `rzp_live_` or `rzp_test_`)

### "Payment Modal doesn't open"
→ Check browser console, ensure Razorpay script loaded

### "Payment created but not verified"
→ Check server logs for signature verification issues

### "Enrollment not created"
→ Verify database is running and connected

## Next Steps

1. Add your live Razorpay keys from dashboard.razorpay.com
2. Test the payment flow with test credentials
3. Deploy to production with live keys
4. Monitor transactions in Razorpay dashboard

## Documentation

For more detailed setup instructions, see: `RAZORPAY_SETUP.md`

For Razorpay API docs: https://razorpay.com/docs/

---

**Status**: ✅ Ready to go!
**Installation Date**: April 3, 2026
