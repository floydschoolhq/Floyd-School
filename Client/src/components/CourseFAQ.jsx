import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import api from '../api/axios';

const faqs = [
    {
        question: "What are the prerequisites for this course?",
        answer: "No prior coding experience is required. We start from the very basics and gradually build up to advanced concepts. A laptop/computer and internet connection are all you need to get started."
    },
    {
        question: "What age group is this course suitable for?",
        answer: "The course is designed for students aged 12-18 years. Content is structured to be age-appropriate while still covering industry-relevant concepts and skills."
    },
    {
        question: "How much time should I dedicate per week?",
        answer: "We recommend 2-3 hours per week for live classes, plus 1-2 hours for assignments and practice. The course is designed to fit alongside regular school studies without overwhelming you."
    },
    {
        question: "What if I miss a live class?",
        answer: "All live sessions are recorded and available for review within 24 hours. You can catch up at your own pace without missing any crucial content."
    }
];

const FAQItem = ({ faq, index, isOpen, onToggle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <span className="text-sm font-medium text-white/80 pr-4">
                    {faq.question}
                </span>
                <ChevronDown 
                    size={18} 
                    className={`flex-shrink-0 text-slate-500 transition-all duration-300 ${
                        isOpen ? 'rotate-180 text-white' : ''
                    }`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-2 text-sm text-slate-500 leading-relaxed border-t border-white/5">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const CourseFAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await api.post('/leads', {
                ...formData,
                source: 'course_faq',
                type: 'query'
            });
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                setShowForm(false);
                setIsSuccess(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
            }, 2000);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <section className="py-16 px-6 bg-black">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        <span className="text-blue-500">F</span>requently <span className="text-blue-500">A</span>sked <span className="text-blue-500">Q</span>uestions
                    </h2>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => toggleFAQ(index)}
                        />
                    ))}
                </div>

                <div className="mt-10">
                    {!showForm ? (
                        <div className="text-center">
                            <p className="text-sm text-slate-500 mb-4">
                                Still have questions?
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/10 transition-all"
                            >
                                Contact Our Team
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/40 border border-white/5 rounded-2xl p-6"
                        >
                            <AnimatePresence>
                                {isSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="py-6 text-center"
                                    >
                                        <p className="text-white font-medium">Message sent!</p>
                                        <p className="text-sm text-slate-500 mt-1">We will get back to you soon.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-sm text-white placeholder-slate-500 ${
                                                    errors.name ? 'border-red-500' : 'border-white/10'
                                                }`}
                                                placeholder="Your name"
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-sm text-white placeholder-slate-500 ${
                                                    errors.email ? 'border-red-500' : 'border-white/10'
                                                }`}
                                                placeholder="your@email.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-sm text-white placeholder-slate-500 ${
                                                    errors.phone ? 'border-red-500' : 'border-white/10'
                                                }`}
                                                placeholder="1234567890"
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm text-slate-400 mb-1">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 resize-none"
                                                placeholder="Your question..."
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="flex-1 py-2.5 border border-white/10 text-slate-400 rounded-lg text-sm hover:bg-white/5"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 py-2.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CourseFAQ;
