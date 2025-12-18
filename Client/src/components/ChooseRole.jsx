/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { LogIn, User, BookOpen, Shield, X, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const LOGO_BLUE = '#007FFF';
const LOGO_ORANGE = '#FF8C00';

const RoleCard = ({ icon: Icon, title, path }) => {
  const navigate = useNavigate();

  const handleRoleClick = () => {
    navigate(path);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:border-sky-500 min-w-[160px]"
      whileHover={{ scale: 1.05, translateY: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleRoleClick}
    >
      <div className="p-5 bg-gradient-to-br from-sky-500/20 to-blue-600/20 rounded-full mb-4 text-sky-400 border border-sky-500/30">
        <Icon className="w-10 h-10" />
      </div>
      <p className="text-xl font-bold text-white">{title}</p>
    </motion.div>
  );
};

const ChooseRole = () => {
  const navigate = useNavigate();

  const roles = [
    { title: 'Student', icon: User, path: '/student/login' },
    { title: 'Mentor', icon: BookOpen, path: '/mentor/login' },
    { title: 'Admin', icon: Shield, path: '/admin/login' },
  ];

  const handleExit = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-8 md:p-12 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700 relative z-10"
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700">
          {/* Logo */}
          <div className="text-3xl font-extrabold cursor-text">
            <span style={{ color: LOGO_BLUE }}>think</span>
            <span style={{ color: LOGO_ORANGE }}>skool</span>
          </div>

          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 bg-slate-800 rounded-full hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 border border-slate-700 transition duration-300 cursor-pointer"
            aria-label="Exit to Home Page"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </header>

        {/* Content */}
        <div className="flex flex-col justify-center items-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-10"
          >
            Identify yourself as...
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <RoleCard
                  icon={role.icon}
                  title={role.title}
                  path={role.path}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default ChooseRole;