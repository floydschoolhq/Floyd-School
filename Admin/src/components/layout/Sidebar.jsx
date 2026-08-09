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
    BarChart3
} from 'lucide-react';
import { UserPlus } from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <Activity size={20} />, label: 'Analytics', path: '/' },
        { icon: <Users size={20} />, label: 'User Governance', path: '/users' },
        { icon: <BarChart3 size={20} />, label: 'Attendance Software', path: '/attendance-monitoring' },
        { icon: <ShieldCheck size={20} />, label: 'Access Requests', path: '/requests' },
        { icon: <GraduationCap size={20} />, label: 'Student Registrations', path: '/student-registrations' },
        { icon: <UserPlus size={20} />, label: 'Guest Details', path: '/guest-details' },

        { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
        { icon: <Target size={20} />, label: 'Lead Intel', path: '/leads' },
        { icon: <MessageCircle size={20} />, label: 'Chatbot Leads', path: '/chatbot-leads' },
        { icon: <ShieldCheck size={20} />, label: 'School Partners', path: '/school-partnership-leads' },
        { icon: <School size={20} />, label: 'Offline Schools', path: '/offline-schools' },
        { icon: <Award size={20} />, label: 'Hackathon Leads', path: '/hackathon-leads' },
        { icon: <TrendingUp size={20} />, label: 'Success Engine', path: '/success-engine' },
        { icon: <Monitor size={20} />, label: 'Live Monitor', path: '/monitoring' },
        { icon: <Video size={20} />, label: 'Recordings', path: '/recordings' },
        { icon: <DollarSign size={20} />, label: 'Payments', path: '/payments' },
        { icon: <Bell size={20} />, label: 'Broadcast', path: '/broadcast' },
        { icon: <Settings size={20} />, label: 'System Settings', path: '/settings' },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800 shrink-0">
            <div className="p-6">
                <BrandLogo size="md" suffix="Admin" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Root Controller Authority</p>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all text-xs uppercase tracking-wider ${isActive
                                ? 'bg-slate-800 text-white border border-slate-700'
                                : 'hover:bg-slate-800/60 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
