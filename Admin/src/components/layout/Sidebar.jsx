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
        { icon: <Activity size={17} />, label: 'Analytics', path: '/' },
        { icon: <Users size={17} />, label: 'User Governance', path: '/users' },
        { icon: <BarChart3 size={17} />, label: 'Attendance Software', path: '/attendance-monitoring' },
        { icon: <ShieldCheck size={17} />, label: 'Access Requests', path: '/requests' },
        { icon: <GraduationCap size={17} />, label: 'Student Registrations', path: '/student-registrations' },
        { icon: <UserPlus size={17} />, label: 'Guest Details', path: '/guest-details' },

        { icon: <BookOpen size={17} />, label: 'Courses', path: '/courses' },
        { icon: <Target size={17} />, label: 'Lead Intel', path: '/leads' },
        { icon: <MessageCircle size={17} />, label: 'Chatbot Leads', path: '/chatbot-leads' },
        { icon: <ShieldCheck size={17} />, label: 'School Partners', path: '/school-partnership-leads' },
        { icon: <School size={17} />, label: 'Offline Schools', path: '/offline-schools' },
        { icon: <Award size={17} />, label: 'Hackathon Leads', path: '/hackathon-leads' },
        { icon: <TrendingUp size={17} />, label: 'Success Engine', path: '/success-engine' },
        { icon: <Monitor size={17} />, label: 'Live Monitor', path: '/monitoring' },
        { icon: <Video size={17} />, label: 'Recordings', path: '/recordings' },
        { icon: <DollarSign size={17} />, label: 'Payments', path: '/payments' },
        { icon: <Bell size={17} />, label: 'Broadcast', path: '/broadcast' },
        { icon: <Settings size={17} />, label: 'System Settings', path: '/settings' },
    ];

    return (
        <div className="w-60 h-screen bg-white text-slate-600 flex flex-col border-r border-slate-200 shrink-0 select-none">
            <div className="p-5 border-b border-slate-100">
                <BrandLogo size="md" suffix="Admin" />
                <p className="text-xs font-normal text-slate-400 mt-1">Institutional Administration</p>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all text-xs ${isActive
                                ? 'bg-slate-900 text-white font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-3 border-t border-slate-100">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium text-xs cursor-pointer"
                >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
