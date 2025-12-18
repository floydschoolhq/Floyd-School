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
            className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-4"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="bg-gray-700 w-full max-w-md p-6 rounded-xl shadow-2xl relative"
                variants={modalVariants}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
                    aria-label="Close modal"
                >
                    <FiX className="w-6 h-6" />
                </button>

                <h3 className="text-2xl font-bold text-white mb-4">Book Your Demo Call</h3>
                <p className="text-gray-300 mb-6">Enter your details and select a preferred date/time.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Email Id</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='enter your email'
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Date/Time Input */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Preferred Date & Time</label>
                        <input
                            type="datetime-local"
                            id="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center items-center space-x-2 px-6 py-3 mt-4 rounded-lg text-lg font-bold transition-all duration-300 transform shadow-md"
                        style={{ backgroundColor: '#FF8C00', color: '#1F2937' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
    const handleBooking = async ({ name, date ,email }) => {
        setIsSubmitting(true);
        try {
            const response = await api.post('/contact/book-demo', { name, date ,email });
            
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
                        className="bg-gray-800 p-8 md:p-16 rounded-2xl shadow-2xl text-center relative"
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.4 }}
                    >
                        {/* Back Button */}
                        <a
                            href="/" 
                            className="absolute top-4 left-4 md:top-8 md:left-8 text-white hover:text-blue-400 transition duration-300 p-3 rounded-full bg-gray-700/50 hover:bg-gray-700 z-10"
                            aria-label="Go back to home"
                        >
                            <FiArrowLeft className="text-2xl" />
                        </a>

                        {/* Header/Text content */}
                        <motion.h2
                            className="text-sm uppercase tracking-widest font-semibold text-blue-400 mb-2"
                            variants={itemVariants}
                        >
                            CONTACT
                        </motion.h2>
                        <motion.h1
                            className="text-4xl md:text-5xl font-extrabold mb-6"
                            variants={itemVariants}
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto"
                            variants={itemVariants}
                        >
                            Whether you’re a school looking to integrate STEM education or a student eager to learn, our team is ready to help.
                        </motion.p>

                        {/* Contact Details Grid */}
                        <motion.div
                            className="flex justify-center flex-wrap gap-8 mb-12"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ staggerChildren: 0.2 }}
                        >
                            {/* Email */}
                            <motion.div
                                className="flex items-center space-x-3"
                                variants={itemVariants}
                            >
                                <FiMail className="text-2xl text-blue-400" />
                                <a
                                    href="mailto:info@thinkskool.in"
                                    className="text-lg font-medium text-white hover:text-blue-300 transition"
                                >
                                    thinkskool.office@gmil.com
                                </a>
                            </motion.div>

                            {/* Phone */}
                            <motion.div
                                className="flex items-center space-x-3"
                                variants={itemVariants}
                            >
                                <FiPhone className="text-2xl text-blue-400" />
                                <a
                                    href="tel:+918527740849"
                                    className="text-lg font-medium text-white hover:text-blue-300 transition"
                                >
                                    +91-8527740849
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Button: Book a Demo Call */}
                        <motion.button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center space-x-3 px-10 py-4 rounded-full text-xl font-bold transition-all duration-300 transform shadow-lg"
                            style={{ backgroundColor: '#FF8C00', color: '#1F2937' }}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(255, 140, 0, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            variants={itemVariants}
                            disabled={isSubmitting} // Disable while submitting
                        >
                            <FiCalendar className="text-2xl" />
                            <span>{isSubmitting ? 'Booking...' : 'Book a Demo Call'}</span>
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