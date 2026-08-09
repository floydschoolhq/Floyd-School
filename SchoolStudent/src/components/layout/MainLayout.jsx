import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  BookOpen,
  Clock,
  HelpCircle,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Class Attendance', path: '/attendance', icon: CalendarCheck },
    { label: 'Quizzes & Examinations', path: '/quizzes', icon: Award },
    { label: 'Homework & Projects', path: '/assignments', icon: BookOpen },
    { label: 'Class Timetable', path: '/schedule', icon: Clock },
    { label: 'Academic Helpdesk', path: '/help', icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col">
      {/* Clean Minimalist White Topbar Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">
              <GraduationCap size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900 tracking-tight">FLOYDSCHOOL</span>
                <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded-full">
                  Student Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Offline Student Academic Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span className="font-mono text-slate-800 text-[11px]">Roll: {user?.offlineRollNo || 'ST-GRA-001'}</span>
          </div>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Student Name'}</p>
              <p className="text-[10px] text-slate-500 font-medium">{user?.grade || 'Grade 10-A'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Desktop Navigation Sidebar */}
        <aside className="hidden lg:flex w-56 shrink-0 bg-white border-r border-slate-200 flex-col justify-between p-3.5 shadow-2xs">
          <div className="space-y-4">
            <div>
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Student Menu
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600">
            <p className="font-bold text-slate-800 mb-0.5">Academic Student Record</p>
            <p className="leading-tight text-slate-500">Official student portal for class materials and records.</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/30 backdrop-blur-2xs flex">
            <div className="w-56 bg-white border-r border-slate-200 p-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">Navigation</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-900">
                    <X size={18} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs ${
                          isActive
                            ? 'bg-slate-900 text-white font-semibold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500'} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2 px-3 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5"
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto space-y-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
