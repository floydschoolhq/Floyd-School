import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useIsMobile from '../../hooks/useIsMobile';

const ScrollDarkenHeading = ({ children, className = "", sizeClass = "text-5xl md:text-8xl", variant = "light" }) => {
    const targetRef = useRef(null);
    const isMobile = useIsMobile();
    
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const isDark = variant === "dark";

    // Light variant: light slate -> dark slate (for white bg)
    // Dark variant: muted slate -> pure white (for dark bg)
    const color = useTransform(
        scrollYProgress,
        [0.2, 0.4, 0.6, 0.8],
        isDark 
            ? ["#334155", "#ffffff", "#ffffff", "#334155"] 
            : ["#cbd5e1", "#0f172a", "#0f172a", "#cbd5e1"]
    );

    return (
        <motion.h2
            ref={targetRef}
            style={!isMobile ? { color } : {}}
            className={`${sizeClass} font-black uppercase tracking-tighter leading-none ${isMobile ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-300'} ${className}`}
        >
            {children}
        </motion.h2>
    );
};

export default ScrollDarkenHeading;
