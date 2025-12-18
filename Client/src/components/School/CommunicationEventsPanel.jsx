/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import MotionCard from './MotionCard';
import ActionButton from './ActionButton';

const CommunicationEventsPanel = () => {
  const [announcement, setAnnouncement] = useState('');

  const handleSend = () => {
    if (announcement.trim()) {
      console.log(`Announcement Sent:\n"${announcement}"`); 
      setAnnouncement('');
    }
  };

  return (
    <div className="space-y-6 ">
      <h2 className="text-3xl font-extrabold text-gray-900">Communication & Events</h2>
      
      <MotionCard>
        <h3 className="text-xl font-semibold mb-4">Send School-Wide Announcement</h3>
        <p className="text-sm text-gray-500 mb-4">Use this panel to send critical school-wide notices and event reminders to all users (students, mentors, and parents).</p>
        
        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          rows="6"
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-700"
          placeholder="Type your important announcement here..."
        />
        
        <div className="mt-4 flex justify-end">
          <ActionButton icon={Bell} label="Send Announcement Now" onClick={handleSend} color="bg-orange-600" />
        </div>
      </MotionCard>

      <MotionCard>
        <h3 className="text-xl font-semibold mb-4">Recent Announcements Log</h3>
        <ul className="space-y-3">
          {['Urgent: School closed tomorrow due to weather.', 'Reminder: Parent-Teacher meeting on Oct 28th.', 'New mentorship policy published on portal.'].map((msg, index) => (
            <motion.li 
              key={index}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-start p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400"
            >
              <Bell className="w-5 h-5 text-indigo-600 mr-3 mt-1 shrink-0" />
              <p className="text-gray-700">{msg}</p>
            </motion.li>
          ))}
        </ul>
      </MotionCard>
    </div>
  );
};

export default CommunicationEventsPanel;
