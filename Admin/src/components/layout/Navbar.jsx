import React from 'react';
import { Bell, Search, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl w-full max-w-xl focus-within:border-sky-500/50 transition-all">
                <Search size={18} className="text-slate-500" />
                <input
                    type="text"
                    placeholder="Query platform database..."
                    className="bg-transparent border-none outline-none text-sm font-bold text-white w-full placeholder:text-slate-600"
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-sky-500/5 border border-sky-500/10 rounded-2xl overflow-hidden relative">
                    <Zap size={14} className="text-sky-400 relative z-10" fill="currentColor" />
                    <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest relative z-10">System Latency: 24ms</span>
                </div>

                <div className="h-8 w-px bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-4 pl-4">
                    <div className="text-right">
                        <p className="text-sm font-black text-white leading-none tracking-tight">
                            {user?.name || 'Admin'}
                        </p>
                        <p className="text-[9px] font-black text-sky-500 mt-1 uppercase tracking-[0.2em]">
                            Primary Controller
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-sky-500 border border-slate-700 shadow-xl">
                        <Shield size={24} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
