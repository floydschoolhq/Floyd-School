/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Shield, CheckCircle } from 'lucide-react';
import MotionCard from './MotionCard';
import ActionButton from './ActionButton';

const ContentModerationPanel = () => {
  const pendingContent = [
    { id: 1, type: 'Course Material', title: 'Chapter 5: Cell Biology', author: 'Mentor A', date: '2 days ago' },
    { id: 2, type: 'Quiz', title: 'Physics Final Exam Draft', author: 'Mentor B', date: '1 day ago' },
  ];

  const flaggedContent = [
    { id: 3, type: 'Discussion Post', user: 'Student X', reason: 'Inappropriate language', date: '3 hours ago' },
  ];

  const handleReview = (item) => console.log(`Reviewing ${item.title}`);
  const handleModerate = (item) => console.log(`Moderating flagged content from ${item.user}`);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-900">Content & Moderation</h2>

      {/* Content Approval */}
      <MotionCard>
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-cyan-600" />
          <span>Pending Content & Material Approval</span>
        </h3>
        <div className="space-y-3">
          {pendingContent.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-500">{item.type} by {item.author} - {item.date}</p>
              </div>
              <ActionButton icon={CheckCircle} label="Review & Approve" onClick={() => handleReview(item)} color="bg-cyan-600" />
            </motion.div>
          ))}
        </div>
      </MotionCard>

      {/* Misconduct/Flagged Content */}
      <MotionCard>
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Shield className="w-6 h-6 text-red-600" />
          <span>Misconduct & Flagged Content</span>
        </h3>
        <div className="space-y-3">
          {flaggedContent.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex justify-between items-center p-4 bg-red-50 rounded-lg shadow-sm border border-red-300"
            >
              <div>
                <p className="font-medium text-red-800">Flagged: {item.type} by {item.user}</p>
                <p className="text-sm text-red-600">Reason: {item.reason} ({item.date})</p>
              </div>
              <ActionButton icon={Shield} label="Moderate Action" onClick={() => handleModerate(item)} color="bg-red-600" />
            </motion.div>
          ))}
        </div>
      </MotionCard>
    </div>
  );
};

export default ContentModerationPanel;
