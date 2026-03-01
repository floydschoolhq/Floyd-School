/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiPhone, FiCalendar, FiX, FiArrowLeft } from 'react-icons/fi';
// Make sure this path and the baseURL inside it are correct!
import api from '../api/axios';
import { LampContainer } from './ui/lamp';

// --- Modal Component (No changes needed here) ---
const BookingModal = ({ isOpen, onClose, onBook }) => {
    // ... (rest of BookingModal component code is unchanged) ...
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [email, setEmail] = useState('');

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: {
            y: "0",
            opacity: 1,
            transition: { delay: 0.1, type: "spring", stiffness: 100 }
        },
        exit: { y: "100vh", opacity: 0 }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !date) {
            alert("Please enter your name and select a date/time.");
            return;
        }
        onBook({ name, date });
        setName('');
        setDate('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex justify-center items-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl relative border border-[#FBEFEF]"
                variants={modalVariants}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition"
                    aria-label="Close modal"
                >
                    <FiX className="w-6 h-6" />
                </button>

                <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Book Your <span className="text-[#2563EB]">Demo</span></h3>
                <p className="text-slate-500 mb-8 font-medium text-sm">Select your preferred slot for a deep-dive session.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-5 py-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                            placeholder="Engineering Lead"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='engineering@company.com'
                            className="w-full px-5 py-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date & Time</label>
                        <input
                            type="datetime-local"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-5 py-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center space-x-3 px-8 py-5 rounded-2xl bg-[#2D2D2D] text-white text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-95"
                    >
                        Confirm Booking
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

// --- Contact Component (Updated handleBooking) ---
const Contact = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading/disable button

    // Function to handle the actual booking submission
    const handleBooking = async ({ name, date, email }) => {
        setIsSubmitting(true);
        try {
            const response = await api.post('/contact/book-demo', { name, date, email });

            // Success response from backend
            alert(`🎉 Success! ${response.data.message}\nYour booking details:\nName: ${name}\nDate: ${new Date(date).toLocaleString()}\n email:${email}`);

        } catch (error) {
            console.error('Booking failed:', error);
            const errorMessage = error.response?.data?.message || 'Failed to book demo. Please check the server status.';
            alert(`❌ Booking Failed: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Framer Motion variants... (rest of the variants are unchanged)
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 60,
                damping: 10,
                delay: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <LampContainer className="pt-32 md:pt-48">
            <motion.div
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="flex flex-col items-center justify-center text-center px-4 mt-52"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="bg-white p-12 md:p-24 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(245,175,175,0.15)] text-center relative border border-[#FBEFEF] overflow-hidden"
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                        {/* Back Button */}
                        <a
                            href="/"
                            className="absolute top-8 left-8 text-slate-400 hover:text-[#2563EB] transition duration-300 p-4 rounded-2xl bg-[#FCF8F8] border border-[#FBEFEF] group z-10"
                            aria-label="Go back to home"
                        >
                            <FiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
                        </a>

                        <motion.h2
                            className="text-[10px] uppercase tracking-[0.4em] font-black text-[#2563EB] mb-4"
                            variants={itemVariants}
                        >
                            Connect with us
                        </motion.h2>
                        <motion.h1
                            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900"
                            variants={itemVariants}
                        >
                            Ready to <span className="text-[#2563EB]">Succeed?</span>
                        </motion.h1>
                        <motion.p
                            className="text-base md:text-lg text-slate-600 mb-16 max-w-2xl mx-auto font-medium leading-relaxed"
                            variants={itemVariants}
                        >
                            Join the <span className="text-blue-600">ThinkSkool</span> ecosystem. Let's discuss how we can accelerate your engineering journey to industry mastery.
                        </motion.p>

                        {/* Contact Details Grid */}
                        <div className="flex justify-center flex-wrap gap-12 mb-16">
                            {/* Email */}
                            <motion.div
                                className="flex flex-col items-center gap-4 group"
                                variants={itemVariants}
                            >
                                <div className="w-16 h-16 rounded-3xl bg-[#FBEFEF] flex items-center justify-center text-[#2563EB] shadow-lg group-hover:scale-110 transition-transform">
                                    <FiMail className="text-2xl" />
                                </div>
                                <a
                                    href="mailto:thinkskool.office@gmail.com"
                                    className="text-lg font-black text-blue-600 hover:text-slate-900 transition tracking-tight"
                                >
                                    <span className="text-blue-600">thinkskool</span>.office@gmail.com
                                </a>
                            </motion.div>

                            {/* Phone */}
                            <motion.div
                                className="flex flex-col items-center gap-4 group"
                                variants={itemVariants}
                            >
                                <div className="w-16 h-16 rounded-3xl bg-[#FBEFEF] flex items-center justify-center text-[#2563EB] shadow-lg group-hover:scale-110 transition-transform">
                                    <FiPhone className="text-2xl" />
                                </div>
                                <a
                                    href="tel:+918527740849"
                                    className="text-lg font-black text-slate-900 hover:text-[#2563EB] transition tracking-tight"
                                >
                                    +91 85277 40849
                                </a>
                            </motion.div>
                        </div>

                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center space-x-4 px-12 py-6 rounded-[2rem] bg-[#2D2D2D] text-white text-xs font-black uppercase tracking-[0.2em] transition-all hover:bg-slate-800 shadow-2xl shadow-slate-200 hover:-translate-y-1 active:scale-95"
                            variants={itemVariants}
                            disabled={isSubmitting}
                        >
                            <FiCalendar className="text-xl" />
                            <span>{isSubmitting ? 'Architecting...' : 'Book a Demo Call'}</span>
                        </motion.button>
                    </motion.div>
                </div>

                {/* The Booking Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <BookingModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onBook={handleBooking}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </LampContainer>
    );
};

export default Contact;

