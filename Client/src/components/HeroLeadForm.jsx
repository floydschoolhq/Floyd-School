import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const HeroLeadForm = ({ onSuccess, onClose }) => {
    const [selectedExperience, setSelectedExperience] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        topic: ''
    });
    const [status, setStatus] = useState('idle');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExperience || !formData.topic || !formData.name || !formData.phone || !formData.email) {
            alert("Please fill in all details to proceed.");
            return;
        }

        setStatus('loading');
        try {
            const payload = {
                ...formData,
                experience: selectedExperience,
                source: 'hero_form_student_modal',
                type: 'course_enquiry'
            };

            await api.post('/leads', payload);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', topic: '' });
            setSelectedExperience('');
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Form submission failed", error);
            alert("Failed to submit inquiry. Please try again.");
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 relative z-10">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight">Thank You</h3>
                <p className="text-white/40 text-[12px] font-black uppercase tracking-widest">We will get back to you shortly.</p>
                <button 
                    onClick={() => {
                        setStatus('idle');
                        if (onClose) onClose();
                    }} 
                    className="mt-8 px-8 py-3 bg-white text-slate-950 rounded-full font-bold text-[12px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                    Close
                </button>
            </motion.div>
        );
    }

    return (
        <form className="space-y-6 relative z-10" onSubmit={handleFormSubmit}>
            <div className="mb-4">
                <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-[0.3em]">Select Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                    {["Class 8-9", "Class 9-10", "Class 11-12", "College"].map((option, idx) => (
                        <button 
                            key={idx} 
                            type="button" 
                            onClick={() => setSelectedExperience(option)} 
                            className={`py-3.5 px-1 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] transition-all border ${selectedExperience === option ? 'bg-white text-slate-950 font-extrabold border-white' : 'bg-white/5 text-white/30 border-white/5 hover:border-white/10'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.3em]">Specialization Track</label>
                    <select 
                        name="topic" 
                        value={formData.topic} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full text-[13px] p-4 rounded-xl bg-white/5 border border-white/5 text-white/90 appearance-none focus:outline-none focus:bg-white/10 focus:border-blue-500/30 font-semibold tracking-tight cursor-pointer"
                    >
                        <option value="" className="bg-slate-900">Select Track</option>
                        <option value="Full Stack" className="bg-slate-900">Full Stack Engineering</option>
                        <option value="AI & ML" className="bg-slate-900">AI & Machine Learning</option>
                        <option value="Cyber Security" className="bg-slate-950">Cyber Intelligence</option>
                        <option value="Robotics" className="bg-slate-900">Robotics & IoT</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Full Name" 
                        className="w-full text-[13px] p-4 rounded-xl bg-white/5 border border-white/5 text-white/90 focus:outline-none focus:bg-white/10 focus:border-blue-500/30 placeholder:text-white/20 font-semibold tracking-tight" 
                    />
                    <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Phone Number" 
                        className="w-full text-[13px] p-4 rounded-xl bg-white/5 border border-white/5 text-white/90 focus:outline-none focus:bg-white/10 focus:border-blue-500/30 placeholder:text-white/20 font-semibold tracking-tight" 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Email Address" 
                        className="w-full text-[13px] p-4 rounded-xl bg-white/5 border border-white/5 text-white/90 focus:outline-none focus:bg-white/10 focus:border-blue-500/30 placeholder:text-white/20 font-semibold tracking-tight" 
                    />
                </div>
            </div>

            <motion.button 
                type="submit" 
                disabled={status === 'loading'} 
                className="w-full rounded-[2.5rem] bg-white hover:bg-slate-100 py-4 shadow-3xl shadow-white/10 active:scale-[0.98] transition-all mt-4"
            >
                <div className="text-slate-950 font-bold text-[13px] tracking-[0.2em] flex items-center justify-center gap-2 uppercase">
                    {status === 'loading' ? <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" /> : <>Get Started <ArrowRight size={16} /></>}
                </div>
            </motion.button>
        </form>
    );
};

export default HeroLeadForm;
