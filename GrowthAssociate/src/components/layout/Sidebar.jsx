import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart3,
    MessageCircle,
    Users,
    AlertTriangle,
    Settings,
    LogOut,
    Heart,
    MessageSquare,
    Monitor,
    School
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <BarChart3 size={20} />, label: 'Engagement', path: '/' },
        { icon: <MessageCircle size={20} />, label: 'Support Hub', path: '/support' },
        { icon: <School size={20} />, label: 'School Partnerships', path: '/school-partnerships' },
        { icon: <MessageSquare size={20} />, label: 'Discussions', path: '/discussions' },
        { icon: <Users size={20} />, label: 'Student List', path: '/students' },
        { icon: <Monitor size={20} />, label: 'Live Monitor', path: '/monitoring' },
        { icon: <AlertTriangle size={20} />, label: 'Escalations', path: '/escalations' },
    ];

    return (
        <div className="w-64 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200">
            <div className="p-8">
                <BrandLogo size="md" suffix="Support" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3 ml-1">Support Unit</p>
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
