import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ShieldCheck,
    BarChart,
    Users,
    Activity,
    Settings,
    LogOut,
    Bell,
    Cpu,
    BookOpen,
    Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <Activity size={20} />, label: 'Analytics', path: '/' },
        { icon: <Users size={20} />, label: 'User Governance', path: '/users' },
        { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
        { icon: <Target size={20} />, label: 'Lead Intel', path: '/leads' },
        { icon: <Bell size={20} />, label: 'Broadcast', path: '/notifications' },
    ];

    return (
        <div className="w-64 h-screen bg-[#0f172a] text-slate-400 flex flex-col border-r border-slate-800">
            <div className="p-8">
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                    <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
                        <Cpu size={22} />
                    </div>
                    <span className="font-['Outfit'] italic">THINK<span className="text-sky-400 not-italic">OS</span></span>
                </h1>
                <p className="text-[10px] font-black text-sky-500/60 uppercase tracking-[0.3em] mt-3 ml-1">Root Authority</p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest ${isActive
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                                : 'hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                >
                    <LogOut size={18} />
                    Safe Terminate
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
