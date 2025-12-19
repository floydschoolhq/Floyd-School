import React from 'react';
import { Bell, Search, User, LifeBuoy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../common/NotificationDropdown';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl w-full max-w-lg border border-slate-200">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Lookup student ID or query..."
                    className="bg-transparent border-none outline-none text-sm font-medium w-full"
                />
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <LifeBuoy size={20} />
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-[10px] font-black uppercase text-slate-400 text-right">Support Status</p>
                        <p className="text-xs font-black text-emerald-500 uppercase">System Online</p>
                    </div>
                </div>

                <div className="h-8 w-px bg-slate-200 mx-2"></div>

                <NotificationDropdown />

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-slate-900 leading-none">
                            {user?.name || 'Growth Associate'}
                        </p>
                        <p className="text-[10px] font-bold text-orange-500 mt-1 uppercase tracking-widest">
                            Student Support Pro
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                        <User size={24} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
