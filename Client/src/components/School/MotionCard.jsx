/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Card Wrapper
 * A reusable card component with fade-in animation
 */
const MotionCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    className={`bg-white p-6 rounded-xl shadow-lg ${className}`}
  >
    {children}
  </motion.div>
);

export default MotionCard;
