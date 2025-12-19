import { BarChart, BookOpen, ClipboardCheck, Code, LayoutDashboard, Video, X, LifeBuoy } from "lucide-react";
import { useContext } from "react";
import { PortalContext } from "../Context/PortalProvider";
import { NavLink } from "./SharedComponentStudent";


const StudentSidebar = () => {
  const usePortal = () => useContext(PortalContext);
  const { user, system, currentView, setView, isSidebarOpen, setIsSidebarOpen } = usePortal();

  const links = [
    { icon: LayoutDashboard, title: 'Dashboard', view: 'Dashboard' },
    { icon: BookOpen, title: 'Classroom & Lessons', view: 'Classroom' },
    { icon: Code, title: 'Cloud Coding Lab', view: 'CodingLab' },
    { icon: Video, title: 'Recordings', view: 'Recordings' },
    { icon: BarChart, title: 'Progress Tracking', view: 'ProgressTracking' },
    { icon: ClipboardCheck, title: 'Performance Reports', view: 'PerformanceReport' },
    { icon: LifeBuoy, title: 'Concierge Support', view: 'Support' },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 transform 
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 transition-transform duration-300 ease-in-out
      w-64 bg-white p-6 shadow-2xl md:shadow-xl flex flex-col justify-between
    `}>
      {/* Header */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl font-black flex items-center tracking-tighter font-['Outfit']">
            <span className='text-slate-900'>think</span><span className='text-[#fca96d]'>skool</span>
          </div>
          <button
            className="md:hidden p-2 text-slate-500 hover:text-slate-700 rounded-full"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 font-['Inter']">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 font-['Outfit']">Authenticated as</p>
          <p className="text-sm font-black text-slate-900 truncate font-['Outfit']">{user?.name}</p>
          <div className="mt-2 inline-block px-2 py-0.5 bg-[#fca96d]/10 text-[#fca96d] text-[10px] font-black uppercase rounded tracking-tighter font-['Outfit']">
            {system} Access
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.view}
              {...link}
              currentView={currentView}
              setView={setView}
            />
          ))}
        </nav>
      </div>

      {/* Footer is now just padding, as logout is removed */}

    </div>
  );
};

export default StudentSidebar;
