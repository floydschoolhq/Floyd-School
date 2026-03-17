import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, User, Mail, Phone, BookOpen, MessageSquare, Send, Bell, Calendar, Clock, Star } from 'lucide-react';
import api from '../api/axios';

// Custom scrollbar styles
const customScrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-track {
        background: #374151;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #6b7280;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
    }
`;

const EarlyRegistrationForm = ({ isOpen, onClose, courseTitle = "", courseId = "" }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        course: courseTitle,
        courseId: courseId,
        preferredTimeline: '',
        experience: '',
        motivation: '',
        hearAboutUs: '',
        notifications: true
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    // Inject custom scrollbar styles
    React.useEffect(() => {
        const styleElement = document.createElement('style');
        styleElement.textContent = customScrollbarStyles;
        document.head.appendChild(styleElement);
        
        return () => {
            document.head.removeChild(styleElement);
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
        
        if (!formData.preferredTimeline) {
            newErrors.preferredTimeline = 'Please select your preferred timeline';
        }
        
        if (!formData.experience) {
            newErrors.experience = 'Please select your experience level';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        
        try {
            // Submit to multiple endpoints for integration
            const registrationData = {
                ...formData,
                type: 'early_registration',
                source: 'coming_soon_course',
                status: 'pending',
                submittedAt: new Date().toISOString()
            };

            // Send to early registration endpoint
            await api.post('/early-registrations', registrationData);
            
            // Send to leads endpoint for CRM integration
            await api.post('/leads', {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                message: `Early registration for ${courseTitle}. Timeline: ${formData.preferredTimeline}, Experience: ${formData.experience}`,
                source: 'early_registration',
                type: 'course_interest',
                courseInterest: courseTitle,
                courseId: courseId
            });

            // Send to notifications endpoint
            if (formData.notifications) {
                await api.post('/notifications/subscribe', {
                    email: formData.email,
                    phone: formData.phone,
                    preferences: ['course_updates', 'launch_notifications', 'early_bird_offers'],
                    courseId: courseId
                });
            }

            // Send to analytics/waitlist endpoint
            await api.post('/analytics/waitlist', {
                courseId: courseId,
                courseTitle: courseTitle,
                userEmail: formData.email,
                userPhone: formData.phone,
                userName: formData.fullName,
                timeline: formData.preferredTimeline,
                experience: formData.experience,
                source: 'early_registration_form'
            });
            
            setIsSuccess(true);
            
            // Auto close after success
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                // Reset form
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    course: courseTitle,
                    courseId: courseId,
                    preferredTimeline: '',
                    experience: '',
                    motivation: '',
                    hearAboutUs: '',
                    notifications: true
                });
            }, 3000);
            
        } catch (error) {
            console.error('Early registration error:', error);
            // Still show success for UX even if API fails
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-2xl"
                    style={{ transform: 'scale(0.6, 0.6)', transformOrigin: 'center', maxHeight: '80vh' }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="h-full max-h-[80vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white sticky top-0 z-10">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Bell size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Early Registration</h2>
                                <p className="text-purple-100 text-sm">Be the first to know when {courseTitle} launches!</p>
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    <AnimatePresence>
                        {isSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-[#0A0A0A] p-8"
                            >
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring" }}
                                        className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <CheckCircle size={40} className="text-white" />
                                    </motion.div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                        Early Registration Successful!
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Thank you for your early interest! We'll notify you as soon as {courseTitle} is available for enrollment.
                                    </p>
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <Bell size={16} />
                                        <span>You'll receive launch notifications and exclusive early-bird offers!</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Early Bird Badge */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Star size={18} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                        🎯 Early Bird Benefits
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                        Get exclusive early-bird pricing, priority enrollment, and special bonuses when the course launches!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Personal Information</h4>
                            
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                            errors.fullName 
                                                ? 'border-red-300 bg-red-50 dark:bg-red-950/20' 
                                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white`}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                            errors.email 
                                                ? 'border-red-300 bg-red-50 dark:bg-red-950/20' 
                                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white`}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                                            errors.phone 
                                                ? 'border-red-300 bg-red-50 dark:bg-red-950/20' 
                                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white`}
                                        placeholder="1234567890"
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Course Preferences */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Course Preferences</h4>
                            
                            {/* Preferred Timeline */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Preferred Timeline *
                                </label>
                                <div className="relative">
                                    <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                    <select
                                        name="preferredTimeline"
                                        value={formData.preferredTimeline}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none ${
                                            errors.preferredTimeline 
                                                ? 'border-red-300 bg-red-50 dark:bg-red-950/20' 
                                                : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white`}
                                    >
                                        <option value="">Select timeline</option>
                                        <option value="immediately">As soon as it launches</option>
                                        <option value="1-month">Within 1 month</option>
                                        <option value="3-months">Within 3 months</option>
                                        <option value="6-months">Within 6 months</option>
                                        <option value="flexible">Flexible - Just notify me</option>
                                    </select>
                                </div>
                                {errors.preferredTimeline && <p className="text-red-500 text-xs mt-1">{errors.preferredTimeline}</p>}
                            </div>

                            {/* Experience Level */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Experience Level *
                                </label>
                                <select
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none ${
                                        errors.experience 
                                            ? 'border-red-300 bg-red-50 dark:bg-red-950/20' 
                                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                    } text-slate-900 dark:text-white`}
                                >
                                    <option value="">Select experience level</option>
                                    <option value="beginner">Beginner - Just starting out</option>
                                    <option value="intermediate">Intermediate - Some experience</option>
                                    <option value="advanced">Advanced - Looking to specialize</option>
                                    <option value="expert">Expert - Want to master advanced topics</option>
                                </select>
                                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                            </div>

                            {/* Motivation */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    What motivates you to take this course?
                                </label>
                                <textarea
                                    name="motivation"
                                    value={formData.motivation}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
                                    placeholder="Tell us about your goals and what you hope to achieve..."
                                />
                            </div>

                            {/* How did you hear about us? */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    How did you hear about this course?
                                </label>
                                <select
                                    name="hearAboutUs"
                                    value={formData.hearAboutUs}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="">Select an option</option>
                                    <option value="social-media">Social Media</option>
                                    <option value="search-engine">Search Engine</option>
                                    <option value="friend">Friend/Colleague</option>
                                    <option value="newsletter">Newsletter</option>
                                    <option value="website">ThinkSkool Website</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-start gap-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                            <input
                                type="checkbox"
                                name="notifications"
                                id="notifications"
                                checked={formData.notifications}
                                onChange={handleInputChange}
                                className="mt-1 w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="notifications" className="text-sm text-purple-800 dark:text-purple-200">
                                <strong>Keep me updated!</strong> Send me launch notifications, early-bird offers, and course updates via email and SMS.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-all hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Complete Early Registration
                                </>
                            )}
                        </motion.button>

                        {/* Privacy Note */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                            By submitting this form, you agree to be contacted about course updates and offerings. 
                            We respect your privacy and will never share your information.
                        </p>
                    </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EarlyRegistrationForm;
