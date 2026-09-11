import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  BookOpen,
  Users,
  Layers,
  FolderDown,
  BookMarked,
  Clock,
  User,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'My Classes & Session', path: '/classes', icon: Clock },
    { label: 'My Batches', path: '/batches', icon: Layers },
    { label: 'Batch Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Students & Roster', path: '/students', icon: Users },
    { label: 'Quizzes & Evaluations', path: '/quizzes', icon: Award },
    { label: 'Homework & Submissions', path: '/homework', icon: BookOpen },
    { label: 'Class Materials', path: '/materials', icon: FolderDown },
    { label: 'Class Guides & Notes', path: '/guides', icon: BookMarked },
    { label: 'Mentor Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-53px)] sticky top-[53px] select-none">
      {/* Navigation Links */}
      <div className="p-3.5 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Offline Operations
          </p>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Footer Info & Sign Out */}
      <div className="p-3.5 border-t border-slate-100 space-y-2">
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="flex items-center space-x-2 text-slate-800 text-[11px] font-bold">
            <Sparkles size={13} className="text-amber-500" />
            <span>Classroom Mode</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
            Take attendance and grade offline STEM projects seamlessly.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
