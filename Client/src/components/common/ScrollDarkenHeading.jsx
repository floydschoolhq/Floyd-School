import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useIsMobile from '../../hooks/useIsMobile';

const ScrollDarkenHeading = ({ children, className = "", sizeClass = "text-5xl md:text-8xl", variant = "light", uppercase = true }) => {
    const isDark = variant === "dark";

    return (
        <h2
            className={`${sizeClass} font-black ${uppercase ? 'uppercase' : ''} tracking-tighter leading-none 
                ${isDark ? 'text-slate-200' : 'text-slate-500'} ${className}`}
        >
            {children}
        </h2>
    );
};

export default ScrollDarkenHeading;
