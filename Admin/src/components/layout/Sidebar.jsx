import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    ShieldCheck,
    Users,
    Activity,
    Settings,
    LogOut,
    Bell,
    BookOpen,
    Target,
    TrendingUp,
    Monitor,
    GraduationCap,
    Video,
    DollarSign,
    MessageCircle,
    Award
} from 'lucide-react';
import { UserPlus } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <Activity size={20} />, label: 'Analytics', path: '/' },
        { icon: <Users size={20} />, label: 'User Governance', path: '/users' },
        { icon: <ShieldCheck size={20} />, label: 'Access Requests', path: '/requests' },
        { icon: <GraduationCap size={20} />, label: 'Student Registrations', path: '/student-registrations' },
        { icon: <UserPlus size={20} />, label: 'Guest Details', path: '/guest-details' },

        { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
        { icon: <Target size={20} />, label: 'Lead Intel', path: '/leads' },
        { icon: <MessageCircle size={20} />, label: 'Chatbot Leads', path: '/chatbot-leads' },
        { icon: <ShieldCheck size={20} />, label: 'School Partners', path: '/school-partnership-leads' },
        { icon: <Award size={20} />, label: 'Hackathon Leads', path: '/hackathon-leads' },
        { icon: <TrendingUp size={20} />, label: 'Success Engine', path: '/success-engine' },
        { icon: <Monitor size={20} />, label: 'Live Monitor', path: '/monitoring' },
        { icon: <Video size={20} />, label: 'Recordings', path: '/recordings' },
        { icon: <DollarSign size={20} />, label: 'Payments', path: '/payments' },
        { icon: <Bell size={20} />, label: 'Broadcast', path: '/broadcast' },
        { icon: <Settings size={20} />, label: 'System Settings', path: '/settings' },
    ];

    return (
        <div className="w-64 h-screen bg-[#0f172a] text-slate-400 flex flex-col border-r border-slate-800">
            <div className="p-8">
                <BrandLogo size="md" suffix="Admin" />
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
