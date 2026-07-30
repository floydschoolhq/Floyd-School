import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Loader2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { PortalContext } from '../../contexts/PortalProvider';

const CLASS_OPTIONS = ['6', '7', '8', '9', '10', '11', '12', 'College', 'Other'];
const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'Other'];

const GuestLoginModal = ({ isOpen, onClose }) => {
    const { updateUser } = useContext(PortalContext);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        class: '',
        section: '',
        school: '',
        city: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // ESC key handler
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', mobile: '', class: '', section: '', school: '', city: '' });
            setErrors({});
            setSuccess(false);
            setLoading(false);
        }
    }, [isOpen]);

    // Outside click handler
    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
        }

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d+$/.test(formData.mobile.trim())) {
            newErrors.mobile = 'Only numbers are allowed';
        } else if (formData.mobile.trim().length !== 10) {
            newErrors.mobile = 'Mobile must be exactly 10 digits';
        }

        if (!formData.class) {
            newErrors.class = 'Class is required';
        }

        if (!formData.section.trim()) {
            newErrors.section = 'Section is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await api.post('/guest/create', formData);
            const { token, guest } = res.data;

            // Store token and user data
            localStorage.setItem('token', token);
            const guestUser = {
                _id: guest.id,
                name: guest.name,
                role: 'guest',
                class: guest.class,
                isGuest: true
            };
            updateUser(guestUser);

            setSuccess(true);
            toast.success('🎉 Thank you for submitting! Welcome to Floyd School!', {
                duration: 3000,
                style: {
                    background: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    borderRadius: '12px'
                }
            });

            setTimeout(() => {
                onClose();
                navigate('/student/dashboard');
            }, 1500);
        } catch (err) {
            const message = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(message, {
                style: {
                    background: '#1e293b',
                    color: '#e2e8f0',
                    border: '1px solid #334155',
                    borderRadius: '12px'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const isFreeTextSection = formData.class === 'College' || formData.class === 'Other';

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleOverlayClick}
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 max-h-[90vh] overflow-y-auto relative"
                    >
                        {/* Top accent bar */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent rounded-t-[2rem]" />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                        <UserPlus size={20} className="text-[#2563EB]" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                        Continue as <span className="text-[#2563EB]">Guest</span>
                                    </h2>
                                </div>
                                <p className="text-slate-500 text-sm font-medium ml-[52px]">
                                    Please provide your details before entering the platform
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Success State */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-12"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                        className="w-20 h-20 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-6"
                                    >
                                        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <motion.path
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">Thank You for Submitting!</h3>
                                    <p className="text-[#2563EB] font-semibold text-sm mb-1">Welcome to Floyd School!</p>
                                    <p className="text-slate-400 text-xs">Redirecting you to the dashboard...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        {!success && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                                            errors.name ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-blue-200 focus:border-[#2563EB]'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-red-500" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Mobile Number */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Mobile Number <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                                            errors.mobile ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-blue-200 focus:border-[#2563EB]'
                                        }`}
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                    />
                                    {errors.mobile && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-red-500" />
                                            {errors.mobile}
                                        </p>
                                    )}
                                </div>

                                {/* Class & Section Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Class */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                            Class <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.class}
                                                onChange={(e) => {
                                                    handleChange('class', e.target.value);
                                                    if (e.target.value === 'College' || e.target.value === 'Other' ||
                                                        formData.class === 'College' || formData.class === 'Other') {
                                                        handleChange('section', '');
                                                    }
                                                }}
                                                className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer text-sm ${
                                                    errors.class ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200 focus:border-[#2563EB]'
                                                } ${!formData.class ? 'text-slate-400' : ''}`}
                                            >
                                                <option value="" className="text-slate-400">Select</option>
                                                {CLASS_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                        {errors.class && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-red-500" />
                                                {errors.class}
                                            </p>
                                        )}
                                    </div>

                                    {/* Section */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                            Section <span className="text-red-400">*</span>
                                        </label>
                                        {isFreeTextSection ? (
                                            <input
                                                type="text"
                                                value={formData.section}
                                                onChange={(e) => handleChange('section', e.target.value)}
                                                className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all text-sm ${
                                                    errors.section ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200 focus:border-[#2563EB]'
                                                }`}
                                                placeholder="Enter section/dept"
                                            />
                                        ) : (
                                            <div className="relative">
                                                <select
                                                    value={formData.section}
                                                    onChange={(e) => handleChange('section', e.target.value)}
                                                    className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer text-sm ${
                                                        errors.section ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200 focus:border-[#2563EB]'
                                                    } ${!formData.section ? 'text-slate-400' : ''}`}
                                                >
                                                    <option value="" className="text-slate-400">Select</option>
                                                    {SECTION_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            </div>
                                        )}
                                        {errors.section && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                <span className="w-1 h-1 rounded-full bg-red-500" />
                                                {errors.section}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* School Name (optional) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        School Name <span className="text-slate-300 text-[10px] normal-case tracking-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.school}
                                        onChange={(e) => handleChange('school', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#2563EB] transition-all text-sm"
                                        placeholder="Your school/college name"
                                    />
                                </div>

                                {/* City (optional) */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        City <span className="text-slate-300 text-[10px] normal-case tracking-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => handleChange('city', e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-[#2563EB] transition-all text-sm"
                                        placeholder="Your city"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 mt-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-sm"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        'Continue'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GuestLoginModal;
