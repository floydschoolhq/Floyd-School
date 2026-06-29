import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const PaymentModal = ({ isOpen, onClose, course }) => {
    const courseId = course?._id;
    const courseTitle = course?.title || '';
    const coursePrice = course?.price || 0;
    const [step, setStep] = useState('details'); // details, success, error
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const response = await api.post('/coupons/validate', {
                code: couponCode,
                courseId: courseId,
                amount: coursePrice
            });
            setAppliedCoupon(response.data);
            setCouponError('');
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Invalid coupon code');
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    const handleProceedToPayment = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrorMessage('');

        try {
            // Create Razorpay order
            const response = await api.post('/payments/create-order', {
                courseId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                couponCode: appliedCoupon ? appliedCoupon.couponCode : null
            });

            const { order, razorpayKeyId } = response.data;

            // Initialize Razorpay
            const options = {
                key: razorpayKeyId,
                amount: order.amount,
                currency: order.currency,
                name: 'Floyd School',
                description: courseTitle,
                order_id: order.id,
                handler: async (response) => {
                    // Payment successful - verify with backend
                    console.log('[Frontend Debug] Razorpay response:', response);
                    console.log('[Frontend Debug] Response keys:', Object.keys(response));
                    console.log('[Frontend Debug] Response properties:');
                    Object.keys(response).forEach(key => {
                        console.log(`  ${key}:`, response[key]);
                    });
                    
                    // Handle different Razorpay response formats
                    const paymentData = {
                        razorpay_order_id: response.razorpay_order_id || response.order_id,
                        razorpay_payment_id: response.razorpay_payment_id || response.payment_id,
                        razorpay_signature: response.razorpay_signature || response.signature
                    };
                    
                    console.log('[Frontend Debug] Extracted payment data:', paymentData);
                    
                    // If still empty, try all possible combinations
                    if (!paymentData.razorpay_order_id || !paymentData.razorpay_payment_id || !paymentData.razorpay_signature) {
                        console.log('[Frontend Debug] Trying to find properties manually...');
                        const keys = Object.keys(response);
                        console.log('[Frontend Debug] Available keys:', keys);
                        
                        // Try to find order ID
                        const orderId = response[keys.find(k => k.toLowerCase().includes('order'))] || 
                                       response[keys.find(k => k.toLowerCase().includes('id'))];
                        
                        // Try to find payment ID  
                        const paymentId = response[keys.find(k => k.toLowerCase().includes('payment'))] ||
                                        response[keys.find(k => k.toLowerCase().includes('razorpay_payment'))];
                        
                        // Try to find signature
                        const signature = response[keys.find(k => k.toLowerCase().includes('signature'))] ||
                                        response[keys.find(k => k.toLowerCase().includes('razorpay_signature'))];
                        
                        console.log('[Frontend Debug] Manual extraction:', { orderId, paymentId, signature });
                        
                        paymentData.razorpay_order_id = paymentData.razorpay_order_id || orderId;
                        paymentData.razorpay_payment_id = paymentData.razorpay_payment_id || paymentId;
                        paymentData.razorpay_signature = paymentData.razorpay_signature || signature;
                    }
                    
                    console.log('[Frontend Debug] Final payment data:', paymentData);
                    
                    try {
                        const verifyResponse = await api.post('/payments/verify', paymentData);
                        
                        console.log('[Frontend Debug] Verify response:', verifyResponse.data);

                        if (verifyResponse.data.success) {
                            setStep('success');
                            setSuccessMessage('Payment completed successfully! You are now enrolled in the course.');
                            
                            // Auto-close after 4 seconds
                            setTimeout(() => {
                                handleClose();
                            }, 4000);
                        } else {
                            // Payment verification failed - initiate refund
                            setStep('error');
                            setErrorMessage('Payment verification failed. Initiating refund...');
                            
                            // Try to initiate refund
                            try {
                                await api.post('/payments/refund', {
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    amount: order.amount,
                                    reason: 'Payment verification failed'
                                });
                                setErrorMessage('Payment verification failed. Refund initiated. You should receive your money back within 5-7 working days.');
                            } catch (refundError) {
                                setErrorMessage('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
                            }
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        setStep('error');
                        
                        // Check if it's a network error or server error
                        if (error.code === 'NETWORK_ERROR' || error.response?.status >= 500) {
                            setErrorMessage('Network error. Please check your connection and try again. Your payment is safe and will be refunded if needed.');
                        } else {
                            setErrorMessage('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
                        }
                    }
                },
                modal: {
                    ondismiss: async () => {
                        setLoading(false);
                        // If payment was cancelled, update enrollment status
                        try {
                            await api.post('/payments/cancel', {
                                razorpay_order_id: order.id
                            });
                        } catch (error) {
                            console.error('Payment cancellation error:', error);
                        }
                        // Reset to details step so user can try again
                        setStep('details');
                    },
                    handle_failure: async (response) => {
                        setStep('error');
                        setErrorMessage('Payment failed. Please try again.');
                        setLoading(false);

                        // Log the failure for debugging
                        console.error('Payment failed:', response);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: '#3B82F6'
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.error('Payment creation error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to create payment order. Please try again.';
            setErrorMessage(errorMsg);
            setStep('error');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep('details');
        setFormData({
            fullName: '',
            email: '',
            phone: ''
        });
        setErrors({});
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(false);
        setCouponCode('');
        setAppliedCoupon(null);
        onClose();
    };

    const handleRetry = () => {
        setStep('details');
        setErrorMessage('');
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 max-h-[98vh] overflow-y-auto hide-scrollbar"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 md:p-8">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Course Enrollment</h2>
                                <p className="text-xs md:text-sm text-slate-400 mt-1">{courseTitle}</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* Details Form Step */}
                            {step === 'details' && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-3.5 md:space-y-5"
                                >
                                    <div>
                                        <label className="block text-[11px] md:text-sm font-semibold text-slate-300 mb-1.5 md:mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className={`w-full px-4 py-2.5 md:py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.fullName ? 'border-red-500' : 'border-slate-600'
                                            }`}
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] md:text-sm font-semibold text-slate-300 mb-1.5 md:mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className={`w-full px-4 py-2.5 md:py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.email ? 'border-red-500' : 'border-slate-600'
                                            }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] md:text-sm font-semibold text-slate-300 mb-1.5 md:mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit phone number"
                                            className={`w-full px-4 py-2.5 md:py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.phone ? 'border-red-500' : 'border-slate-600'
                                            }`}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Coupon Section */}
                                    <div className="space-y-2">
                                        <label className="block text-[11px] md:text-sm font-semibold text-slate-300">
                                            Coupon Code (Optional)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder="ENTER CODE"
                                                disabled={appliedCoupon || couponLoading}
                                                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase text-sm"
                                            />
                                            <button
                                                onClick={appliedCoupon ? handleRemoveCoupon : handleApplyCoupon}
                                                disabled={!couponCode || couponLoading}
                                                className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all ${
                                                    appliedCoupon 
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                                                }`}
                                            >
                                                {couponLoading ? <Loader size={14} className="animate-spin" /> : (appliedCoupon ? 'Remove' : 'Apply')}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-400 text-[10px] mt-1">{couponError}</p>}
                                        {appliedCoupon && <p className="text-green-400 text-[10px] mt-1 font-medium italic">Applied! You saved ₹{appliedCoupon.discount.toLocaleString('en-IN')}</p>}
                                    </div>

                                    {/* Price Display */}
                                    <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-3.5 md:p-4 mt-4 md:mt-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm md:text-base text-slate-300 font-medium">
                                                {appliedCoupon ? 'Final Price:' : 'Course Fee:'}
                                            </span>
                                            <div className="flex items-end gap-2">
                                                {(course?.originalPrice > 0 || appliedCoupon) && (
                                                    <span className="text-xs md:text-sm font-medium text-slate-400 line-through mb-1">
                                                        ₹{(appliedCoupon ? coursePrice : course.originalPrice).toLocaleString('en-IN')}
                                                    </span>
                                                )}
                                                <span className="text-xl md:text-2xl font-bold text-blue-400">
                                                    ₹{(appliedCoupon ? appliedCoupon.finalAmount : coursePrice).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 md:py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 md:mt-6"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Loader size={16} className="animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            'Proceed to Payment'
                                        )}
                                    </button>

                                    <p className="text-center text-[10px] md:text-xs text-slate-500 mt-2 md:mt-4">
                                        Your information is secure and encrypted
                                    </p>
                                </motion.div>
                            )}

                            {/* Success Step */}
                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                    >
                                        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        Registration Confirmed!
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-2">
                                        Thank you for registering for <span className="text-blue-400 font-semibold">{courseTitle}</span>.
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        We will share the enrollment details and next steps with you soon.
                                    </p>
                                </motion.div>
                            )}

                            {/* Error Step */}
                            {step === 'error' && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-12 text-center"
                                >
                                    <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Submission Failed
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        {errorMessage || 'Something went wrong. Please try again.'}
                                    </p>
                                    <button
                                        onClick={handleRetry}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:from-blue-700 hover:to-blue-800 transition-all"
                                    >
                                        Try Again
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;
