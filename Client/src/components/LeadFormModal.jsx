import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../api/axios';

const LeadFormModal = ({ isOpen, onClose, source = 'generic' }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            await api.post('/leads', {
                ...formData,
                source,
                type: 'counseling'
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', email: '', phone: '' });
            }, 3000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-white p-8 border-b border-[#FBEFEF] text-slate-900 flex justify-between items-start">
                            <div>
                                {source === 'school_partnership' ? (
                                    <>
                                        <h3 className="text-2xl font-black mb-1 uppercase tracking-tight">Start <span className="text-[#2563EB]">Partnership</span></h3>
                                        <p className="text-slate-500 text-sm font-medium">Schedule a briefing for your institution.</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-black mb-1 uppercase tracking-tight">Book a <span className="text-[#2563EB]">Free Session</span></h3>
                                        <p className="text-slate-500 text-sm font-medium">Get expert guidance for your future.</p>
                                    </>
                                )}
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-[#FCF8F8]">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            {status === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                        <FaCheckCircle />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">Request Received!</h4>
                                    <p className="text-slate-500">
                                        {source === 'school_partnership'
                                            ? 'Our partnership team will contact your school shortly.'
                                            : 'Our expert counselor will call you shortly.'}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {errorMsg && (
                                        <div className="p-3 bg-blue-50 text-blue-600 text-sm rounded-lg">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-1 uppercase tracking-widest text-[10px]">
                                            {source === 'school_partnership' ? 'Administrator Name' : 'Name'}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                                            placeholder={source === 'school_partnership' ? "Enter contact person's name" : "Enter your name"}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-1 uppercase tracking-widest text-[10px]">
                                            {source === 'school_partnership' ? 'Official Email' : 'Email'}
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                                            placeholder={source === 'school_partnership' ? "principal@school.edu" : "Enter your email"}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 mb-1 uppercase tracking-widest text-[10px]">
                                            {source === 'school_partnership' ? 'School Contact Number' : 'Phone Number'}
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB] transition-colors font-medium"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-[#2D2D2D] text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-slate-100 uppercase tracking-widest text-xs active:scale-95"
                                    >
                                        {status === 'loading' ? <FaSpinner className="animate-spin" /> : (source === 'school_partnership' ? 'Request Briefing' : 'Confirm Registration')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LeadFormModal;
