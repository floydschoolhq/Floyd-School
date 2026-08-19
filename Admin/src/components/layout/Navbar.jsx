import React from 'react';
import { Search, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3 bg-slate-100/80 border border-slate-200 px-4 py-2.5 rounded-2xl w-full max-w-md focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Query platform database..."
                    className="bg-transparent border-none outline-none text-xs font-bold text-slate-900 w-full placeholder:text-slate-400"
                />
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Zap size={13} className="text-emerald-600" fill="currentColor" />
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Latency: 24ms</span>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900 leading-none tracking-tight">
                            {user?.name || 'Admin'}
                        </p>
                        <p className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                            Primary Controller
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
                        <Shield size={18} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
