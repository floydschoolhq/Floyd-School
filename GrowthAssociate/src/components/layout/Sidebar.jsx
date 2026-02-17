import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    BarChart3,
    MessageCircle,
    Users,
    AlertTriangle,
    Settings,
    LogOut,
    Heart,
    MessageSquare,
    Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <BarChart3 size={20} />, label: 'Engagement', path: '/' },
        { icon: <MessageCircle size={20} />, label: 'Support Hub', path: '/support' },
        { icon: <MessageSquare size={20} />, label: 'Discussions', path: '/discussions' },
        { icon: <Users size={20} />, label: 'Student List', path: '/students' },
        { icon: <Monitor size={20} />, label: 'Live Monitor', path: '/monitoring' },
        { icon: <AlertTriangle size={20} />, label: 'Escalations', path: '/escalations' },
    ];

    return (
        <div className="w-64 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200">
            <div className="p-8">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                        <Heart size={18} fill="currentColor" />
                    </div>
                    <span className="font-['Outfit']">THINK<span className="text-orange-500">GS</span></span>
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Support Unit</p>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-sm ${isActive
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'hover:bg-slate-50 hover:text-orange-500'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
