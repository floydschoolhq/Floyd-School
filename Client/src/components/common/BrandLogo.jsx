import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BrandLogo = ({ className = '', size = 'md', theme = 'auto', shine = false, scrolled = false, showTagline = true }) => {
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        navigate('/');
    };
    
    const sizeClasses = {
        xs: 'text-xs tracking-wider',
        sm: 'text-lg tracking-widest',
        md: scrolled ? 'text-[22px] tracking-widest' : 'text-[28px] tracking-widest',
        lg: 'text-4xl tracking-[0.2em]',
        xl: 'text-6xl tracking-[0.25em]',
    };

    const lineHeights = {
        xs: 'h-[1.5px]',
        sm: 'h-[2px]',
        md: scrolled ? 'h-[2px]' : 'h-[3px]',
        lg: 'h-[4px]',
        xl: 'h-[6px]',
    };

    const themeStyles = {
        dark: { text: 'text-white', line: 'bg-red-600' },
        light: { text: 'text-slate-900', line: 'bg-red-600' },
        brand: { text: 'text-white', line: 'bg-red-600' },
        auto: { text: 'text-slate-900 dark:text-white', line: 'bg-red-600' }
    };

    const style = themeStyles[theme] || themeStyles.dark;
    const lineHeight = lineHeights[size] || lineHeights.md;

    const shineVariants = {
        animate: (i) => ({
            filter: shine ? [
                "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))",
                "brightness(1.5) drop-shadow(0 0 8px rgba(255,255,255,0.2))",
                "brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))"
            ] : "none",
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
            }
        })
    };

    return (
        <div className={`flex flex-col items-center select-none ${className}`}>
            <div 
                onClick={handleLogoClick}
                className={`flex items-center font-extrabold uppercase tracking-widest transition-all duration-300 cursor-pointer hover:opacity-90 ${sizeClasses[size] || sizeClasses.md} ${style.text}`}
            >
                {/* FLOYD */}
                <motion.span variants={shineVariants} animate={shine ? "animate" : ""} custom={0}>
                    FLOYD
                </motion.span>
                
                {/* SPACE */}
                <span className="mx-1.5">&nbsp;</span>
                
                {/* SCH */}
                <motion.span variants={shineVariants} animate={shine ? "animate" : ""} custom={1}>
                    SCH
                </motion.span>
                
                {/* Connected OO */}
                <span className="relative inline-flex items-center mx-[0.5px]">
                    <motion.span variants={shineVariants} animate={shine ? "animate" : ""} custom={2}>
                        O
                    </motion.span>
                    <motion.span variants={shineVariants} animate={shine ? "animate" : ""} custom={3}>
                        O
                    </motion.span>
                    {/* The red bridge line connecting the centers of the two Os */}
                    <span 
                        className={`absolute left-[20%] right-[20%] rounded-full z-10 ${style.line} ${lineHeight}`}
                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                    ></span>
                </span>
                
                {/* L */}
                <motion.span variants={shineVariants} animate={shine ? "animate" : ""} custom={4}>
                    L
                </motion.span>
            </div>
            {showTagline && (
                <span className={`text-[10px] text-slate-400 font-semibold tracking-widest transition-all duration-300 uppercase ${scrolled ? 'mt-[-1px]' : 'mt-[-3px]'} block text-center`}>
                    Learn Beyond Classroom
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
