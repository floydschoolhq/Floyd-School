import { BarChart, BookOpen, ClipboardCheck, Code, LayoutDashboard, Video, X, LifeBuoy, PlayCircle, ChevronRight } from "lucide-react";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { PortalContext } from "../../contexts/PortalProvider";
import { NavLink } from "./SharedComponentStudent";
import { motion, AnimatePresence } from "framer-motion";


const StudentSidebar = () => {
  const usePortal = () => useContext(PortalContext);
  const { user, system, currentView, setView, isSidebarOpen, setIsSidebarOpen } = usePortal();
  const location = useLocation();

  const links = [
    { icon: LayoutDashboard, title: 'Dashboard', view: 'Dashboard', path: '/student/dashboard' },
    { icon: BookOpen, title: 'Classroom', view: 'Classroom', path: '/student/classroom' },
    { icon: Code, title: 'Cloud Lab', view: 'CodingLab', path: '/student/coding-lab' },
    { icon: Video, title: 'Recordings', view: 'Recordings', path: '/student/recordings' },
    { icon: PlayCircle, title: 'Live Session', view: 'LiveSession', path: '/student/live-session' },
    { icon: BarChart, title: 'Progress', view: 'ProgressTracking', path: '/student/progress' },
    { icon: ClipboardCheck, title: 'Reports', view: 'PerformanceReport', path: '/student/reports' },
    { icon: LifeBuoy, title: 'Support', view: 'Support', path: '/student/support' }
  ];

  return (
    <AnimatePresence>
      {(isSidebarOpen || true) && (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className={`
            fixed inset-y-0 left-0 z-50 transform 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 transition-transform duration-300 ease-in-out
            w-64 bg-surface-base border-r border-surface-el p-6 shadow-2xl md:shadow-none flex flex-col justify-between
            transition-colors duration-500
          `}
        >
          {/* Header */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="text-2xl font-black flex items-center tracking-tighter hover:opacity-80 transition-opacity">
                <span className='text-text-main transition-colors duration-500'>think</span>
                <span style={{ color: 'var(--accent-primary)' }}>skool</span>
              </Link>
              <button
                className="md:hidden p-2 text-text-muted hover:text-text-main rounded-full hover:bg-surface-soft transition-all"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 p-4 bg-surface-soft rounded-2xl border border-surface-el transition-colors duration-500"
            >
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Authenticated As</p>
              <p className="text-base font-black text-text-main truncate transition-colors duration-500">{user?.name}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-primary/10 text-accent-primary text-[11px] font-black uppercase rounded-lg tracking-tighter">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                {system} Access
              </div>
            </motion.div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {links.map((link, idx) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.view}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx + 0.15 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isActive
                          ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20'
                          : 'text-text-muted hover:text-text-main hover:bg-surface-soft'
                        }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-accent-primary rounded-2xl -z-10"
                        />
                      )}
                      <link.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-text-muted group-hover:text-text-main'} transition-colors`} />
                      <span className={`text-[13px] font-black uppercase tracking-wider ${isActive ? 'text-white' : ''} transition-colors`}>
                        {link.title}
                      </span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80 ml-auto" />}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          {/* Footer branding */}
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted/40 text-center pb-2 transition-colors duration-500">
            Student Portal v2.0 ✦
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StudentSidebar;

