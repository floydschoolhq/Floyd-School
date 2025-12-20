import React, { useContext } from "react";
import { PortalContext } from "../Context/PortalProvider";
import StudentSidebar from "./StudentSidebar";
import ChatSupport from "./ChatSupport";
import { Menu, User } from "lucide-react";

const MainLayout = ({ children }) => {
  const usePortal = () => useContext(PortalContext);
  const { isSidebarOpen, setIsSidebarOpen, system } = usePortal();


  return (
    <div className="min-h-screen bg-gray-50">

      <StudentSidebar />

      {/* Backdrop for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content Area */}
      <div className="md:ml-64 transition-all duration-300">
        {/* Header/Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 md:px-8 md:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              className="md:hidden p-2 text-slate-600 rounded-full hover:bg-slate-50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">
              {usePortal().currentView.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
          </div>

          <div className="flex items-center space-x-6 font-['Inter']">
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 font-['Outfit']">Standard Account</p>
                <p className="text-base font-black text-slate-900 leading-none font-['Outfit']">{usePortal().user?.name}</p>
              </div>
              <div className={`p-2 rounded-xl border ${system === 'student' ? 'bg-slate-50 border-slate-100 text-[#F5AFAF]' : 'bg-slate-50 border-slate-100 text-[#F5AFAF]'}`}>
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
      {/* Global Chat Support Widget */}
      <ChatSupport />
    </div>
  );
};

export default MainLayout;
