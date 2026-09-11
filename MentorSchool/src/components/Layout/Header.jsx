import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Bell,
  GraduationCap,
  LogOut,
  User,
  Layers,
  ChevronDown
} from 'lucide-react';

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-900 px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-2xs">
      <div className="flex items-center space-x-3">
        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-1.5 rounded bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Logo Branding */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 rounded bg-slate-900 text-white flex items-center justify-center font-bold">
            <GraduationCap size={18} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-900 tracking-tight">FLOYDSCHOOL</span>
              <span className="bg-slate-900 text-white text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded">
                MentorSchool
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Offline Classroom Operations Portal</p>
          </div>
        </div>
      </div>

      {/* Right Header Navigation & Actions */}
      <div className="flex items-center space-x-3">
        {/* Quick role chip */}
        <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold capitalize">{user?.role || 'Mentor'}</span>
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdown(!profileDropdown)}
            className="flex items-center space-x-2 p-1 pl-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
          >
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[120px] truncate">
              {user?.name || 'Mentor'}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-scale-in text-xs font-medium">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setProfileDropdown(false);
                  navigate('/profile');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
              >
                <User size={14} />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setProfileDropdown(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center space-x-2 text-rose-600 border-t border-slate-100"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
