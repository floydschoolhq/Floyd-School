import React from 'react';
import { Search, Shield, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl w-full max-w-md focus-within:border-blue-500 focus-within:bg-white transition-all">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                    type="text"
                    placeholder="Search platform..."
                    className="bg-transparent border-none outline-none text-xs font-normal text-slate-800 w-full placeholder:text-slate-400"
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <Zap size={13} className="text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">Latency: 24ms</span>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-slate-900 leading-tight">
                            {user?.name || 'Admin'}
                        </p>
                        <p className="text-[11px] font-normal text-slate-500">
                            Primary Controller
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                        <Shield size={15} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
