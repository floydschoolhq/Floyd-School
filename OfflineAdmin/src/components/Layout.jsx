import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  FileSpreadsheet,
  KeyRound,
  CalendarCheck,
  TrendingUp,
  FileText,
  HelpCircle,
  FolderArchive,
  BookOpen,
  ShieldCheck,
  Wrench,
  Bell,
  Activity,
  History,
  Settings,
  Download,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MaintenanceBanner from './MaintenanceBanner';
import api from '../api/axios';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [maintenance, setMaintenance] = useState(null);

  useEffect(() => {
    // Fetch maintenance settings
    api.get('/offline-admin/maintenance')
      .then(res => setMaintenance(res.data.data))
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'COMMAND CENTER',
      links: [
        { to: '/', label: 'Global Dashboard', icon: LayoutDashboard, end: true }
      ]
    },
    {
      title: 'INSTITUTION OPERATIONS',
      links: [
        { to: '/schools', label: 'Partner Schools', icon: Building2 },
        { to: '/batches', label: 'Offline Batches', icon: Layers },
        { to: '/students', label: 'Student Directory', icon: Users },
        { to: '/mentors', label: 'Mentor Staff', icon: Briefcase },
        { to: '/coordinators', label: 'School Coordinators', icon: GraduationCap }
      ]
    },
    {
      title: 'PROVISIONING & CREDENTIALS',
      links: [
        { to: '/import', label: 'Bulk Excel Import', icon: FileSpreadsheet, badge: 'Wizard' },
        { to: '/credentials', label: 'Credential Manager', icon: KeyRound }
      ]
    },
    {
      title: 'ACADEMIC MONITORING',
      links: [
        { to: '/attendance', label: 'Global Attendance', icon: CalendarCheck },
        { to: '/progress', label: 'Progress Analytics', icon: TrendingUp },
        { to: '/assignments', label: 'Homework & Labs', icon: FileText },
        { to: '/quizzes', label: 'Assessments & Quizzes', icon: HelpCircle },
        { to: '/materials', label: 'Learning Materials', icon: FolderArchive },
        { to: '/courses', label: 'Curriculum & Tracks', icon: BookOpen }
      ]
    },
    {
      title: 'GOVERNANCE & CONTROL',
      links: [
        { to: '/permissions', label: 'RBAC Permission Matrix', icon: ShieldCheck },
        { to: '/maintenance', label: 'Maintenance Control', icon: Wrench },
        { to: '/notifications', label: 'Announcements', icon: Bell },
        { to: '/audit-logs', label: 'Audit Trail', icon: History },
        { to: '/system-health', label: 'System Health', icon: Activity },
        { to: '/reports', label: 'Export Reports', icon: Download },
        { to: '/settings', label: 'System Settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090D16] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Maintenance alert banner */}
      <MaintenanceBanner maintenance={maintenance} />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              FS
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-white">FLOYD SCHOOL</span>
              <span className="ml-2 text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/50">
                CONTROL CENTER
              </span>
            </div>
          </div>
        </div>

        {/* Portal Ecosystem Links & User Info */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 border border-slate-800 rounded px-2.5 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ECOSYSTEM:</span>
            <a href="http://localhost:5178" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">5178 Student</a>
            <span>•</span>
            <a href="http://localhost:5179" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">5179 Partner</a>
            <span>•</span>
            <a href="http://localhost:5180" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">5180 Mentor</a>
            <span>•</span>
            <span className="text-blue-400 font-semibold">5181 Admin</span>
          </div>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200 leading-none">{user?.name || 'Super Admin'}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Body: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0B0F19] border-r border-slate-800/80 pt-14 lg:pt-0 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } overflow-y-auto`}
        >
          <div className="p-4 space-y-6">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx}>
                <p className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 mb-2 px-2.5">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.links.map((link, lIdx) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={lIdx}
                        to={link.to}
                        end={link.end}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{link.label}</span>
                        </div>
                        {link.badge && (
                          <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 px-1 rounded border border-blue-400/20">
                            {link.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <p>Floyd School Ecosystem v3.4</p>
            <p className="text-slate-500">Node/Atlas Unified Cluster</p>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090D16]">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
