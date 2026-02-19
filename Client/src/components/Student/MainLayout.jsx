import React, { useContext } from "react";
import { PortalContext } from "../Context/PortalProvider";
import StudentSidebar from "./StudentSidebar";
import ChatSupport from "./ChatSupport";
import { Menu, User, Home } from "lucide-react";
import { Link } from "react-router-dom";

const MainLayout = ({ children }) => {
  const usePortal = () => useContext(PortalContext);
  const { isSidebarOpen, setIsSidebarOpen, system } = usePortal();


  return (
    <div className="min-h-screen bg-surface-base transition-colors duration-500">

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
        <header className="sticky top-0 z-30 bg-surface-base/80 backdrop-blur-xl border-b border-surface-el p-4 md:px-8 md:py-4 flex items-center justify-between transition-colors duration-500">
          <div className="flex items-center space-x-6">
            <button
              className="md:hidden p-2 text-text-muted rounded-full hover:bg-surface-soft transition-all"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black text-text-main tracking-tight font-['Outfit'] transition-colors duration-500">
              {usePortal().currentView.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-surface-soft hover:bg-surface-el text-text-muted rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
            >
              <Home className="w-4 h-4" />
              Return to Site
            </Link>
            <div className="flex items-center gap-3 pl-6 border-l border-surface-el">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-text-muted uppercase tracking-widest leading-none mb-1 font-['Outfit']">Student</p>
                <p className="text-base font-black text-text-main leading-none font-['Outfit'] transition-colors duration-500">{usePortal().user?.name}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-soft border border-surface-el text-accent-primary transition-all duration-500">
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
