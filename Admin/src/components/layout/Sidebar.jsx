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
    Award,
    School,
    BarChart3,
    UserPlus
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <Activity size={18} />, label: 'Analytics', path: '/' },
        { icon: <Users size={18} />, label: 'User Governance', path: '/users' },
        { icon: <BarChart3 size={18} />, label: 'Attendance Software', path: '/attendance-monitoring' },
        { icon: <ShieldCheck size={18} />, label: 'Access Requests', path: '/requests' },
        { icon: <GraduationCap size={18} />, label: 'Student Registrations', path: '/student-registrations' },
        { icon: <UserPlus size={18} />, label: 'Guest Details', path: '/guest-details' },

        { icon: <BookOpen size={18} />, label: 'Courses', path: '/courses' },
        { icon: <Target size={18} />, label: 'Lead Intel', path: '/leads' },
        { icon: <MessageCircle size={18} />, label: 'Chatbot Leads', path: '/chatbot-leads' },
        { icon: <ShieldCheck size={18} />, label: 'School Partners', path: '/school-partnership-leads' },
        { icon: <School size={18} />, label: 'Offline Schools', path: '/offline-schools' },
        { icon: <Award size={18} />, label: 'Hackathon Leads', path: '/hackathon-leads' },
        { icon: <TrendingUp size={18} />, label: 'Success Engine', path: '/success-engine' },
        { icon: <Monitor size={18} />, label: 'Live Monitor', path: '/monitoring' },
        { icon: <Video size={18} />, label: 'Recordings', path: '/recordings' },
        { icon: <DollarSign size={18} />, label: 'Payments', path: '/payments' },
        { icon: <Bell size={18} />, label: 'Broadcast', path: '/broadcast' },
        { icon: <Settings size={18} />, label: 'System Settings', path: '/settings' },
    ];

    return (
        <div className="w-64 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200 shrink-0 select-none shadow-xs">
            <div className="p-6 border-b border-slate-100">
                <BrandLogo size="md" suffix="Admin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Root Controller Authority</p>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-xs tracking-wide ${isActive
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
