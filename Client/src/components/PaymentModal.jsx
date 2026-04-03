import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const PaymentModal = ({ isOpen, onClose, courseId, courseTitle, coursePrice = 0 }) => {
    const [step, setStep] = useState('details'); // details, payment, success, error
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

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

    const handleProceedToPayment = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Create order
            const response = await api.post('/payments/create-order', {
                courseId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone
            });

            if (response.data.success) {
                setEnrollmentId(response.data.enrollmentId);
                setStep('payment');
                
                // Trigger payment after a very short delay to ensure state update
                setTimeout(() => {
                    handlePaymentClick(response.data);
                }, 100);
            } else {
                setErrorMessage(response.data.message || 'Failed to create order');
                setStep('error');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            const serverMessage = error.response?.data?.detail || error.response?.data?.message;
            setErrorMessage(serverMessage || 'Error creating payment order');
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentClick = (orderData) => {
        if (typeof window.Razorpay === 'undefined') {
            setErrorMessage('Razorpay library failed to load');
            setStep('error');
            return;
        }

        const options = {
            key: orderData.razorpayKeyId,
            amount: orderData.order.amount,
            currency: orderData.order.currency,
            order_id: orderData.order.id,
            name: 'THINKSKOOL',
            description: `Course: ${courseTitle}`,
            image: '/logo.png',
            prefill: {
                name: formData.fullName,
                email: formData.email,
                contact: formData.phone
            },
            handler: async (response) => {
                await handlePaymentSuccess(response, orderData.enrollmentId);
            },
            modal: {
                ondismiss: () => {
                    setStep('details');
                    setLoading(false);
                }
            }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    const handlePaymentSuccess = async (response, enrollmentId) => {
        setLoading(true);
        try {
            // Verify payment on backend
            const verifyResponse = await api.post('/payments/verify-payment', {
                razorpayOrderId: response.order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                enrollmentId: enrollmentId
            });

            if (verifyResponse.data.success) {
                setSuccessMessage('Payment successful! Your enrollment is confirmed.');
                setStep('success');

                // Close modal after 3 seconds
                setTimeout(() => {
                    handleClose();
                }, 3000);
            } else {
                setErrorMessage(verifyResponse.data.message || 'Payment verification failed');
                setStep('error');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setErrorMessage(error.response?.data?.message || 'Error verifying payment');
            setStep('error');
        } finally {
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
        setEnrollmentId(null);
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
                    className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Course Enrollment</h2>
                                <p className="text-sm text-slate-400 mt-1">{courseTitle}</p>
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
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.fullName ? 'border-red-500' : 'border-slate-600'
                                            }`}
                                        />
                                        {errors.fullName && (
                                            <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.email ? 'border-red-500' : 'border-slate-600'
                                            }`}
                                        />
                                        {errors.email && (
                                            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit phone number"
                                            className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                                                errors.phone ? 'border-red-500' : 'border-slate-600'
                                            }`}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Price Display */}
                                    {coursePrice > 0 && (
                                        <div className="bg-blue-600/20 border border-blue-500/50 rounded-lg p-4 mt-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-300 font-medium">Course Fee:</span>
                                                <span className="text-2xl font-bold text-blue-400">
                                                    ₹{coursePrice.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleProceedToPayment}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
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

                                    <p className="text-center text-xs text-slate-500 mt-4">
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
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        Enrollment Successful!
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        {successMessage}
                                    </p>
                                    <p className="text-slate-500 text-xs">
                                        You will be redirected shortly...
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
                                        Payment Failed
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-6">
                                        {errorMessage}
                                    </p>
                                    <button
                                        onClick={handleRetry}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold text-sm uppercase tracking-widest hover:from-blue-700 hover:to-blue-800 transition-all"
                                    >
                                        Try Again
                                    </button>
                                </motion.div>
                            )}

                            {/* Payment Processing */}
                            {step === 'payment' && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-12 text-center"
                                >
                                    <Loader size={48} className="text-blue-500 mx-auto mb-4 animate-spin" />
                                    <p className="text-slate-300 font-medium">
                                        Opening payment gateway...
                                    </p>
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
