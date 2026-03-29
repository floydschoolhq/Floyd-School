import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import api from '../api/axios';

const EarlyRegistrationForm = ({ isOpen, onClose, courseTitle = "", courseId = "" }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        course: courseTitle,
        courseId: courseId,
        preferredTimeline: '',
        experience: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

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
            const registrationData = {
                ...formData,
                type: 'early_registration',
                source: 'coming_soon_course',
                status: 'pending',
                submittedAt: new Date().toISOString()
            };

            await api.post('/early-registrations', registrationData);
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
            
            setIsSuccess(true);
            
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    course: courseTitle,
                    courseId: courseId,
                    preferredTimeline: '',
                    experience: ''
                });
            }, 3000);
            
        } catch (error) {
            console.error('Early registration error:', error);
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
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
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
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="w-full max-w-md bg-white rounded-xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Early Registration</h2>
                                <p className="text-sm text-slate-500 mt-1">{courseTitle}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-8 text-center"
                                >
                                    <p className="text-lg font-medium text-slate-900 mb-2">Registration Successful!</p>
                                    <p className="text-sm text-slate-500">We'll notify you when the course launches.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isSuccess && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                            errors.fullName ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                        placeholder="Enter your name"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                            errors.email ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                            errors.phone ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                        placeholder="1234567890"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">When do you want to join?</label>
                                    <select
                                        name="preferredTimeline"
                                        value={formData.preferredTimeline}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                            errors.preferredTimeline ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    >
                                        <option value="">Select timeline</option>
                                        <option value="immediately">As soon as it launches</option>
                                        <option value="1-month">Within 1 month</option>
                                        <option value="3-months">Within 3 months</option>
                                        <option value="flexible">Just notify me</option>
                                    </select>
                                    {errors.preferredTimeline && <p className="text-red-500 text-xs mt-1">{errors.preferredTimeline}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                                            errors.experience ? 'border-red-500' : 'border-slate-300'
                                        }`}
                                    >
                                        <option value="">Select experience</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                    {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Register'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EarlyRegistrationForm;
