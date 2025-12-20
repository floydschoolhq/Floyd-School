import { User, UserPlus, LogOutIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { PortalContext } from '../../components/Context/PortalProvider';

const StudentSignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { updateUser } = useContext(PortalContext);

    const handleExit = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) return;

        setIsSubmitting(true);

        try {
            const response = await api.post('/auth/signup', {
                name,
                email,
                password,
                role: 'student',
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(response.data));

            if (updateUser) {
                updateUser(response.data);
            }

            navigate('/student');
        } catch (error) {
            console.error('Signup failed:', error.response?.data?.message || error.message);
            alert(error.response?.data?.message || 'Signup failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden font-['Inter']">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F5AFAF]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FBEFEF]/30 rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_50px_100px_-20px_rgba(245,175,175,0.1),0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-[#FBEFEF] relative overflow-hidden group">
                    {/* Top Decorative Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#F5AFAF] to-transparent"></div>

                    <header className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-2 cursor-pointer group/logo" onClick={handleExit}>
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg group-hover/logo:scale-110 transition-transform duration-300">
                                <span className="text-white font-black text-xl font-['Outfit']">TS</span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tighter text-slate-800 font-['Outfit']">
                                think<span className="text-[#F5AFAF]">skool</span>
                            </h1>
                        </div>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-left">
                            <h3 className="text-4xl font-black text-slate-900 tracking-tight font-['Outfit'] mb-2">Build Your <span className="text-[#F5AFAF]">Profile</span></h3>
                            <p className="text-slate-500 text-sm font-medium tracking-wide">Initialize your journey into master-level engineering</p>
                        </div>

                        <div className="space-y-4">
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-['Outfit']">Full Legal Name</label>
                                <input
                                    type="text"
                                    placeholder="Engineer Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F5AFAF] focus:ring-4 focus:ring-[#F5AFAF]/10 transition-all duration-300 font-medium shadow-inner"
                                />
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-['Outfit']">Communication Node (Email)</label>
                                <input
                                    type="email"
                                    placeholder="name@university.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F5AFAF] focus:ring-4 focus:ring-[#F5AFAF]/10 transition-all duration-300 font-medium shadow-inner"
                                />
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block font-['Outfit']">Access Cipher (Password)</label>
                                <input
                                    type="password"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-4 bg-[#FCF8F8] border border-[#FBEFEF] rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F5AFAF] focus:ring-4 focus:ring-[#F5AFAF]/10 transition-all duration-300 font-medium shadow-inner"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!name || !email || !password || isSubmitting}
                            className={`w-full group relative overflow-hidden rounded-2xl p-5 font-black text-[11px] uppercase tracking-[0.3em] font-['Outfit'] transition-all duration-500
                                ${(!name || !email || !password || isSubmitting)
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                    : 'bg-slate-900 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]'
                                }
                            `}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Syncing Nodes...
                                    </>
                                ) : (
                                    <>Establish Identity <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </span>
                        </motion.button>

                        <div className="text-center pt-4 border-t border-slate-50">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                Identity confirmed? <Link to="/student/login" className="text-[#F5AFAF] hover:text-slate-900 transition-colors ml-1">Access Terminal</Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Floating Back Link */}
                <button
                    onClick={handleExit}
                    className="mt-8 mx-auto flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-white rounded-full shadow-sm hover:shadow-md border border-slate-100"
                >
                    <LogOutIcon size={12} className="rotate-180" /> Abort Initialization
                </button>
            </motion.div>
        </div>
    );
};

export default StudentSignupPage;

