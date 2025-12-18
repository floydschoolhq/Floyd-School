/* eslint-disable no-unused-vars */
import React from 'react';
import MotionCard from "./MotionCard.jsx";

/**
 * Reusable Statistic Block
 * Displays a stat with an icon, title, and value
 */
const StatCard = ({ icon: Icon, title, value, colorClass = 'text-indigo-500' }) => (
  <MotionCard className="flex items-center space-x-4">
    <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`} style={{ backgroundColor: colorClass.replace('text-', 'bg-') + '1A' }}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </MotionCard>
);

export default StatCard;
