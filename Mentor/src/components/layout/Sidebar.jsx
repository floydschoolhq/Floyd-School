import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Video,
    Users,
    LifeBuoy,
    LogOut,
    CalendarCheck,
    BarChart3
} from 'lucide-react';
import BrandLogo from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
        { icon: <FileText size={20} />, label: 'Assignments', path: '/assignments' },
        { icon: <CalendarCheck size={20} />, label: 'Offline Attendance', path: '/offline-attendance' },
        { icon: <BarChart3 size={20} />, label: 'Attendance Software', path: '/attendance-monitoring' },
        { icon: <Video size={20} />, label: 'Live Classes', path: '/live' },
        { icon: <Video size={20} />, label: 'Recordings', path: '/recordings' },
        { icon: <Users size={20} />, label: 'Student Leads', path: '/leads' },
        { icon: <LifeBuoy size={20} />, label: 'Support Ticket', path: '/support' },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
            <div className="p-6">
                <BrandLogo size="md" suffix="Mentor" />
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto" aria-label="Main Navigation">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        aria-label={`Navigate to ${item.label}`}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-wider ${isActive
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
                    aria-label="Secure Logout"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
