import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Mail, AlertCircle, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Authentication sequence failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-6 relative overflow-hidden font-['Outfit']">
            {/* Circuit board pattern background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 mb-8 shadow-[0_0_50px_rgba(56,189,248,0.3)]">
                        <div className="w-full h-full bg-[#0b0f1a] rounded-[inherit] flex items-center justify-center">
                            <Shield size={48} className="text-sky-400" strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-4 italic">
                        THINK<span className="text-sky-500 not-italic">OS</span>
                    </h1>
                    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">Administrative Override</p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    {/* Scanning line effect */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-sky-500/20 animate-[scan_3s_linear_infinite]"></div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-black uppercase tracking-widest"
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex justify-between">
                                User Hash <span>(Email)</span>
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-sky-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="master.admin@thinkskool.infra"
                                    className="w-full bg-slate-950/50 border border-slate-800 p-5 pl-14 rounded-[1.5rem] text-white font-bold outline-none focus:border-sky-500/50 focus:bg-slate-950 transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex justify-between">
                                Encryption Key <span>(Password)</span>
                            </label>
                            <div className="relative group">
                                <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-sky-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-slate-950/50 border border-slate-800 p-5 pl-14 rounded-[1.5rem] text-white font-bold outline-none focus:border-sky-500/50 focus:bg-slate-950 transition-all placeholder:text-slate-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-500 text-slate-950 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_50px_rgba(56,189,248,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {loading ? (
                                <Cpu className="animate-spin" size={20} />
                            ) : (
                                'Initiate Handshake'
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 flex items-center justify-center gap-6 text-slate-600 font-black text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div> Secure Node</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div> DB Link Verified</span>
                    <span className="flex items-center gap-2"><div className="w-1 h-1 bg-sky-500 rounded-full animate-pulse"></div> v4.2.0-STABLE</span>
                </div>
            </motion.div>

            <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default Login;
