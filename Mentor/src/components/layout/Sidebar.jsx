import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Video,
    Users,
    GraduationCap,
    LifeBuoy,
    Settings,
    LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <BookOpen size={20} />, label: 'Courses', path: '/courses' },
        { icon: <GraduationCap size={20} />, label: 'Student Roster', path: '/roster' },
        { icon: <FileText size={20} />, label: 'Assignments', path: '/assignments' },
        { icon: <Video size={20} />, label: 'Live Classes', path: '/live' },
        { icon: <Users size={20} />, label: 'Student Leads', path: '/leads' },
        { icon: <LifeBuoy size={20} />, label: 'Support Ticket', path: '/support' },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
            <div className="p-6">
                <h1 className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                    ThinkSkool <span className="text-sky-500">Mentor</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1" aria-label="Main Navigation">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        aria-label={`Navigate to ${item.label}`}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider ${isActive
                                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                                : 'hover:bg-slate-800 hover:text-white'
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
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
