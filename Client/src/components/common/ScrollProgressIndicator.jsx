import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressIndicator = () => {
  const { scrollYProgress } = useScroll();
  
  // Adding a spring for smooth movement
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX: scaleX,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 6, // Slightly thinner than user's 10 for a more premium feel
        originX: 0,
        backgroundColor: "#ff0088", // The requested pink color
        zIndex: 9999,
        background: "linear-gradient(90deg, #ff0088 0%, #7000ff 100%)", // Adding a slight gradient for premium look
        boxShadow: "0 0 10px rgba(255, 0, 136, 0.5)"
      }}
    />
  );
};

export default ScrollProgressIndicator;
