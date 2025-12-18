/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Action Button
 * A button component with icon, label, and hover effects
 */
const ActionButton = ({ icon: Icon, label, onClick, color = 'bg-indigo-600' }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg text-white ${color} hover:${color.replace('600', '700')} transition-colors shadow-md`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </motion.button>
);

export default ActionButton;
