import React from 'react';
import { Search, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl w-full max-w-xl focus-within:border-slate-600 transition-all">
                <Search size={18} className="text-slate-500" />
                <input
                    type="text"
                    placeholder="Query platform database..."
                    className="bg-transparent border-none outline-none text-sm font-bold text-white w-full placeholder:text-slate-500"
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden relative">
                    <Zap size={14} className="text-slate-300 relative z-10" fill="currentColor" />
                    <span className="text-[10px] font-bold uppercase text-slate-300 tracking-widest relative z-10">System Latency: 24ms</span>
                </div>

                <div className="h-8 w-px bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-4 pl-4">
                    <div className="text-right">
                        <p className="text-sm font-black text-white leading-none tracking-tight">
                            {user?.name || 'Admin'}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                            Primary Controller
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white border border-slate-700">
                        <Shield size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
