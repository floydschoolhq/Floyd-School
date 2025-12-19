import React from 'react';
import { Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from '../common/NotificationDropdown';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-2xl w-96 border border-slate-200 focus-within:border-sky-500 focus-within:bg-white transition-all group">
                <Search size={18} className="text-slate-400 group-focus-within:text-sky-500" />
                <input
                    type="text"
                    placeholder="Search for courses, students..."
                    className="bg-transparent border-none outline-none text-sm font-medium w-full"
                />
            </div>

            <div className="flex items-center gap-6">
                <NotificationDropdown />

                <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                    <div className="text-right">
                        <p className="text-sm font-black text-slate-900 leading-none">
                            {user?.name || 'Mentor Name'}
                        </p>
                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">
                            Professional Mentor
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                        <User size={24} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
