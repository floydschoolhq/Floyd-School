import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaSpinner, FaArrowRight } from 'react-icons/fa';
import api from '../api/axios';

import HeroLeadForm from './HeroLeadForm';

const LeadFormModal = ({ isOpen, onClose, source = 'generic' }) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
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
                type: source === 'contact' ? 'query' : 'counseling'
            });
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', email: '', phone: '', message: '' });
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
                        className={`relative bg-slate-950 border border-white/10 rounded-[2.5rem] shadow-2xl w-full ${source === 'contact' ? 'max-w-xl' : 'max-w-md'} overflow-hidden transition-all duration-500`}
                    >
                        {/* Header */}
                        <div className="bg-slate-900/50 p-8 md:p-10 border-b border-white/5 text-white flex justify-between items-start">
                            <div>
                                {source === 'school_partnership' ? (
                                    <>
                                        <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Start <span className="text-[#2563EB]">Partnership</span></h3>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Build industrial labs for schools.</p>
                                    </>
                                ) : source === 'contact' ? (
                                    <>
                                        <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Get in <span className="text-[#2563EB]">Touch</span></h3>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Please fill in your details below.</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Schedule <span className="text-[#2563EB]">Call</span></h3>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Consult with our experts.</p>
                                    </>
                                )}
                            </div>
                            <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-[#2563EB]">
                                <FaTimes />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8 md:p-10">
                            {source === 'contact' ? (
                                <HeroLeadForm onClose={onClose} />
                            ) : status === 'success' ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-blue-500/10 text-[#2563EB] rounded-2xl flex items-center justify-center mx-auto mb-8 text-4xl border border-[#2563EB]/20 shadow-2xl">
                                        <FaCheckCircle />
                                    </div>
                                    <h4 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Success</h4>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-loose">
                                        {source === 'school_partnership'
                                            ? 'Our industrial team will establish contact within 24 hours.'
                                            : source === 'contact'
                                                ? 'Our team will contact you soon.'
                                                : 'An expert counselor will ping you shortly.'}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {errorMsg && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                            {errorMsg}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.3em]">
                                                {source === 'school_partnership' ? 'Administrator Name' : 'Full Name'}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:border-[#2563EB] focus:bg-[#2563EB]/5 text-white transition-all font-medium placeholder:text-slate-700"
                                                placeholder={source === 'school_partnership' ? "Enter contact person's name" : "Your full name"}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.3em]">
                                                {source === 'school_partnership' ? 'Institutional Email' : 'Email Address'}
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:border-[#2563EB] focus:bg-[#2563EB]/5 text-white transition-all font-medium placeholder:text-slate-700"
                                                placeholder={source === 'school_partnership' ? "principal@school.edu" : "email@example.com"}
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.3em]">
                                                {source === 'school_partnership' ? 'Phone Number' : 'Phone Number'}
                                            </label>
                                            <input
                                                type="tel"
                                                className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:outline-none focus:border-[#2563EB] focus:bg-[#2563EB]/5 text-white transition-all font-medium placeholder:text-slate-700"
                                                placeholder="+91 XXXXX XXXXX"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-[#2563EB] text-white font-black py-5 rounded-2xl hover:bg-blue-600 hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] shadow-2xl active:scale-95 group/btn"
                                    >
                                        {status === 'loading' ? <FaSpinner className="animate-spin" /> : (
                                            <>
                                                {source === 'school_partnership' ? 'Contact Us' : source === 'contact' ? 'Submit Inquiry' : 'Schedule Call'}
                                                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
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

