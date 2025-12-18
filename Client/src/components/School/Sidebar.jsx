/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';


const Sidebar = ({ isOpen, setOpen, navItems, activeFeature, setActiveFeature }) => (
  <div >
    {/* Backdrop for mobile only */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
        />
      )}
    </AnimatePresence>
    <motion.aside
      initial={false}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 flex flex-col space-y-8 z-50   lg:h-screen shadow-xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-indigo-400">School Admin</h1>
        <button 
          onClick={() => setOpen(false)} 
          className=" p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col space-y-1 flex-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => {
              setActiveFeature(item.id); 
              // Close sidebar on mobile after selection
              if (window.innerWidth < 1024) {
                setOpen(false);
              }
              setOpen(false);
              
            }}
            whileHover={{ x: 5, backgroundColor: 'rgba(55, 65, 81, 1)' }}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-colors text-left ${
              activeFeature === item.id
                ? 'bg-[#007FFF] text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="font-medium">{item.name}</span>
          </motion.button>
        ))}
      </nav>

      
    </motion.aside>
  </div>
);

export default Sidebar;