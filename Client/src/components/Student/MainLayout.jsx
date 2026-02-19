import React, { useContext, useState, useEffect } from "react";
import { PortalContext } from "../Context/PortalProvider";
import { ThemeContext } from "../Context/ThemeProvider";
import { useToast } from "../Context/ToastProvider";
import StudentSidebar from "./StudentSidebar";
import ChatSupport from "./ChatSupport";
import CommandPalette from "../dashboard/CommandPalette";
import { Menu, User, Home, Command } from "lucide-react";
import { Link } from "react-router-dom";

const MainLayout = ({ children }) => {
  const { isSidebarOpen, setIsSidebarOpen, setView, currentView, user } = useContext(PortalContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const toast = useToast();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Command Palette Keyboard Listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success('Theme Updated', `Switched to ${newTheme} mode`);
  };


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
              {currentView.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Command Palette Trigger Hint */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-surface-soft border border-surface-el rounded-xl text-text-muted hover:text-text-main transition-all group"
            >
              <Command className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
              <kbd className="text-[10px] font-black bg-surface-base px-1.5 py-0.5 rounded border border-surface-el group-hover:border-accent-primary/30 transition-colors">K</kbd>
            </button>
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
                <p className="text-base font-black text-text-main leading-none font-['Outfit'] transition-colors duration-500">{user?.name}</p>
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

      {/* Command Palette Overlay */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={setView}
        onTheme={handleThemeChange}
      />

      {/* Global Chat Support Widget */}
      <ChatSupport />
    </div>
  );
};

export default MainLayout;
