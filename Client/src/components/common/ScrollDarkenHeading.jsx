import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const ScrollDarkenHeading = ({ children, className = "", sizeClass = "text-5xl md:text-8xl" }) => {
    const targetRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    // We want it dark (#0f172a) for a 20% center area (0.4 to 0.6), light (#cbd5e1) outside.
    const color = useTransform(
        scrollYProgress,
        [0.2, 0.4, 0.6, 0.8],
        ["#cbd5e1", "#0f172a", "#0f172a", "#cbd5e1"]
    );

    return (
        <motion.h2
            ref={targetRef}
            style={{ color }}
            className={`${sizeClass} font-black uppercase tracking-tighter leading-none text-slate-300 ${className}`}
        >
            {children}
        </motion.h2>
    );
};

export default ScrollDarkenHeading;
