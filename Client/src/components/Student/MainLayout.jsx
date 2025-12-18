import React, { useContext } from "react";
import { PortalContext } from "../Context/PortalProvider";
import StudentSidebar from "./StudentSidebar";
import ChatSupport from "./ChatSupport";
import { Menu, User, Users } from "lucide-react";

const MainLayout = ({ children }) => {
  const usePortal = () => useContext(PortalContext);
  const { isSidebarOpen, setIsSidebarOpen, system } = usePortal();

  const RoleSwitcher = () => {
    const { system, switchRole } = usePortal();
    const targetRole = system === 'student' ? 'parent' : 'student';
    const targetIcon = system === 'student' ? Users : User;

    return (
      <button
        onClick={switchRole}
        className="flex items-center space-x-2 p-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
      >
        {React.createElement(targetIcon, { className: "w-4 h-4 text-blue-600" })}
        <span>Switch to {targetRole.charAt(0).toUpperCase() + targetRole.slice(1)} View</span>
      </button>
    );
  };

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
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 text-gray-700 rounded-full hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {usePortal().currentView.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <RoleSwitcher /> {/* <-- Role Switcher Added Here */}
            <div className={`p-2 rounded-full ${system === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{usePortal().user?.name}</span>
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