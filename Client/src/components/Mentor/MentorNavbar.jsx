/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, Bell } from 'lucide-react';


const MentorNavbar = ({ setIsSidebarOpen,IsSidebarOpen }) => (
  <header className="bg-white shadow-md p-4 flex items-center justify-between  sticky top-0 z-30">
     <div className='flex gap-5 items-center justify-between'>
         <button onClick={() => setIsSidebarOpen(true)} className=" p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
        <Menu className="w-6 h-6" /> 
      </button>
      {!IsSidebarOpen ? <h2 className='text-2xl font-bold  text-black'>Mentor Dashboard</h2>:""}
     </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search school reports or users..." 
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <Bell className="w-6 h-6" />
        </motion.button>

        <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-bold cursor-pointer hover:ring-2 ring-indigo-300 transition-all">
          SA
        </div>
      </div>
    </header>
  );
export default MentorNavbar;
